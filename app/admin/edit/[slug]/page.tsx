import { notFound, redirect } from "next/navigation";
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
  const categories = [...new Set(posts.map((item) => item.category))].sort();
  const { saved, mode: savedMode } = await searchParams;

  return (
    <>
      <StoreNotice />
      <PostEditor
        key={post.slug}
        initial={post}
        categories={categories}
        initialMessage={saved ? savedMessage(saved, savedMode) : ""}
      />
    </>
  );
}
