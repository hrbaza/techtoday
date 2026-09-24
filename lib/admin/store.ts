import fs from "node:fs/promises";
import path from "node:path";
import type { PostFile } from "@/content/articles/types";

// Where the admin panel reads and writes posts.
//
// - "github": production. Every save is a commit to the repo via the GitHub
//   API (needs GITHUB_TOKEN with Contents read/write on the repo). Vercel then
//   redeploys, and the post goes live in about a minute.
// - "local": `npm run dev` without a token. Files are written straight into
//   this checkout so the change shows up immediately.
// - "unconfigured": production without a token — the panel can't save.

export const POSTS_DIR = "content/posts";
export const IMAGES_DIR = "public/images/posts";

const REPO = process.env.GITHUB_REPO || "hrbaza/techtoday";
const BRANCH = process.env.GITHUB_BRANCH || "main";
const TOKEN = process.env.GITHUB_TOKEN || "";

export type StoreMode = "github" | "local" | "unconfigured";

export function storeMode(): StoreMode {
  if (TOKEN) return "github";
  if (process.env.NODE_ENV !== "production") return "local";
  return "unconfigured";
}

export type FileChange = { path: string; content: Buffer | null };

async function github(pathname: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`https://api.github.com/repos/${REPO}${pathname}`, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
}

async function githubJson<T>(pathname: string, init?: RequestInit): Promise<T> {
  const res = await github(pathname, init);
  if (!res.ok) {
    throw new Error(`GitHub ${res.status} on ${pathname}: ${await res.text()}`);
  }
  return (await res.json()) as T;
}

async function githubRawFile(filePath: string): Promise<string | null> {
  const res = await github(`/contents/${filePath}?ref=${BRANCH}`, {
    headers: { Accept: "application/vnd.github.raw+json" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub ${res.status} reading ${filePath}`);
  return res.text();
}

function assertConfigured() {
  if (storeMode() === "unconfigured") {
    throw new Error(
      "GITHUB_TOKEN is not set in Vercel, so the admin panel cannot save.",
    );
  }
}

export async function listPosts(): Promise<PostFile[]> {
  assertConfigured();
  let names: string[];
  if (storeMode() === "github") {
    const res = await github(`/contents/${POSTS_DIR}?ref=${BRANCH}`);
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GitHub ${res.status} listing posts`);
    const entries = (await res.json()) as { name: string; type: string }[];
    names = entries
      .filter((entry) => entry.type === "file" && entry.name.endsWith(".json"))
      .map((entry) => entry.name);
  } else {
    const dir = path.join(/*turbopackIgnore: true*/ process.cwd(), POSTS_DIR);
    names = (await fs.readdir(dir)).filter((name) => name.endsWith(".json"));
  }
  const posts = await Promise.all(
    names.map((name) => getPost(name.replace(/\.json$/, ""))),
  );
  return posts
    .filter((post): post is PostFile => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export async function getPost(slug: string): Promise<PostFile | null> {
  assertConfigured();
  const filePath = `${POSTS_DIR}/${slug}.json`;
  let raw: string | null;
  if (storeMode() === "github") {
    raw = await githubRawFile(filePath);
  } else {
    raw = await fs
      .readFile(path.join(/*turbopackIgnore: true*/ process.cwd(), filePath), "utf8")
      .catch(() => null);
  }
  return raw ? (JSON.parse(raw) as PostFile) : null;
}

// Applies all changes as one commit (github) or straight to disk (local).
// A change with content null deletes that file.
export async function commitChanges(changes: FileChange[], message: string) {
  assertConfigured();
  if (storeMode() === "local") {
    for (const change of changes) {
      const target = path.join(/*turbopackIgnore: true*/ process.cwd(), change.path);
      if (change.content === null) {
        await fs.rm(target, { force: true });
      } else {
        await fs.mkdir(path.dirname(target), { recursive: true });
        await fs.writeFile(target, change.content);
      }
    }
    return;
  }

  const ref = await githubJson<{ object: { sha: string } }>(
    `/git/ref/heads/${BRANCH}`,
  );
  const parent = await githubJson<{ tree: { sha: string } }>(
    `/git/commits/${ref.object.sha}`,
  );
  const tree = await Promise.all(
    changes.map(async (change) => {
      if (change.content === null) {
        return { path: change.path, mode: "100644", type: "blob", sha: null };
      }
      const blob = await githubJson<{ sha: string }>(`/git/blobs`, {
        method: "POST",
        body: JSON.stringify({
          content: change.content.toString("base64"),
          encoding: "base64",
        }),
      });
      return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
    }),
  );
  const newTree = await githubJson<{ sha: string }>(`/git/trees`, {
    method: "POST",
    body: JSON.stringify({ base_tree: parent.tree.sha, tree }),
  });
  const commit = await githubJson<{ sha: string }>(`/git/commits`, {
    method: "POST",
    body: JSON.stringify({ message, tree: newTree.sha, parents: [ref.object.sha] }),
  });
  await githubJson(`/git/refs/heads/${BRANCH}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });
}
