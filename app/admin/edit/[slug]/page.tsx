import { notFound, redirect } from "next/navigation";
import { topicFor, TOPIC_NAMES } from "@/content/topics";
import { isAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/posts";
import { savedMessage } from "@/lib/admin/format";
import PostEditor from "../../_components/PostEditor";
import StoreNotice from "../../_components/StoreNotice";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string; mode?: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const posts = await listPosts({ includeDrafts: true });
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  const { saved, mode: savedMode } = await searchParams;
  // Older articles carry a free-text category; open them on their topic so the
  // next save stores the topic name.
  const initial = { ...post, category: topicFor(post).name };

  return (
    <>
      <StoreNotice />
      <PostEditor
        key={post.slug}
        initial={initial}
        categories={TOPIC_NAMES}
        initialMessage={saved ? savedMessage(saved, savedMode) : ""}
      />
    </>
  );
}
