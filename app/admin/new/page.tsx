import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { listPosts, storeMode } from "@/lib/admin/store";
import PostEditor from "../_components/PostEditor";
import StoreNotice from "../_components/StoreNotice";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  if (!(await isAdmin())) redirect("/admin/login");
  const mode = storeMode();
  const posts = mode === "unconfigured" ? [] : await listPosts();
  const categories = [...new Set(posts.map((post) => post.category))].sort();

  return (
    <>
      <StoreNotice mode={mode} />
      <PostEditor categories={categories} />
    </>
  );
}
