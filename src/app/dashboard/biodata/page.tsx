import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Biodata Calon Santri — PSB Ma'had Baladz",
  description: "Data diri dan orang tua/wali calon santri baru Ma'had Baladz Al-Qur'an.",
};

export default function BiodataPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
