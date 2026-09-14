import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminDashboard } from "@/components/baladz/AdminDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <SiteContentProvider>
      <AdminDashboard />
    </SiteContentProvider>
  );
}
