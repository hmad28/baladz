import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Berkas Persyaratan — PSB Ma'had Baladz",
  description: "Kelengkapan dan verifikasi berkas persyaratan calon santri baru.",
};

export default function BerkasPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
