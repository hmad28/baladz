import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Pengumuman Hasil Seleksi — PSB Ma'had Baladz",
  description: "Hasil kelulusan seleksi penerimaan santri baru Ma'had Baladz Al-Qur'an.",
};

export default function PengumumanPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
