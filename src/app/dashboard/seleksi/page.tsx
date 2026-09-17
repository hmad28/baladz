import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Undangan Ujian Seleksi — PSB Ma'had Baladz",
  description: "Jadwal dan petunjuk teknis ujian seleksi calon santri baru.",
};

export default function SeleksiPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
