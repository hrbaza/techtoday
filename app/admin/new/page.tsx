import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { listPosts } from "@/lib/posts";
import PostEditor from "../_components/PostEditor";
import StoreNotice from "../_components/StoreNotice";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  if (!(await isAdmin())) redirect("/admin/login");
  const posts = await listPosts({ includeDrafts: true });
  const categories = [...new Set(posts.map((post) => post.category))].sort();

  return (
    <>
      <StoreNotice />
      <PostEditor categories={categories} />
    </>
  );
}
