import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Dashboard Calon Santri — PSB Ma'had Baladz",
  description: "Portal pendaftaran online, kelengkapan berkas, pembayaran, dan pengumuman seleksi Ma'had Baladz Al-Qur'an.",
};

export default function DashboardPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
