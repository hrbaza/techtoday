import Link from "next/link";
import { redirect } from "next/navigation";
import { formatDateLabel, type PostFile } from "@/content/articles/types";
import { isAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/posts";
import DeleteButton from "./_components/DeleteButton";
import StoreNotice from "./_components/StoreNotice";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");

  let posts: PostFile[] = [];
  let loadError = "";
  try {
    posts = await listPosts({ includeDrafts: true });
  } catch (error) {
    console.error("[admin] could not load articles", error);
    loadError = "Could not load articles from the database.";
  }

  return (
    <>
      <div className="admin-bar">
        <div>
          <h1>Articles</h1>
          <p className="admin-hint">
            {posts.length} total · {posts.filter((post) => post.draft).length} drafts
          </p>
        </div>
        <div className="admin-bar-actions">
          <Link className="admin-btn primary" href="/admin/new">
            + New article
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="admin-btn" type="submit">
              Log out
            </button>
          </form>
        </div>
      </div>

      <StoreNotice />
      {loadError && <div className="admin-notice error">{loadError}</div>}

      <div className="admin-card">
        {posts.length === 0 ? (
          <p>No articles yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.slug}>
                  <td>
                    <div className="post-title">{post.title}</div>
                    <div className="post-slug">/blog/{post.slug}</div>
                  </td>
                  <td>{post.category}</td>
                  <td>{formatDateLabel(post.date)}</td>
                  <td>
                    <span className={`admin-badge ${post.draft ? "draft" : "live"}`}>
                      {post.draft ? "Draft" : "Published"}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <Link className="admin-btn" href={`/admin/edit/${post.slug}`}>
                        Edit
                      </Link>
                      {!post.draft && (
                        <a
                          className="admin-btn"
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                      )}
                      <DeleteButton slug={post.slug} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
