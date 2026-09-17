import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Daftar Ulang Santri Baru — PSB Ma'had Baladz",
  description: "Penyelesaian dan konfirmasi daftar ulang santri baru Ma'had Baladz Al-Qur'an.",
};

export default function DaftarUlangPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
