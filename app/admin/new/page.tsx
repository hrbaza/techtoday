import { redirect } from "next/navigation";
import { TOPIC_NAMES } from "@/content/topics";
import { isAdmin } from "@/lib/admin/auth";
import PostEditor from "../_components/PostEditor";
import StoreNotice from "../_components/StoreNotice";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <StoreNotice />
      <PostEditor categories={TOPIC_NAMES} />
    </>
  );
}
