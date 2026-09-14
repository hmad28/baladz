import { AdminDashboard } from "@/components/baladz/AdminDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export default function AdminPage() {
  return (
    <SiteContentProvider>
      <AdminDashboard />
    </SiteContentProvider>
  );
}
