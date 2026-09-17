import { SantriDashboard } from "@/components/baladz/SantriDashboard";
import { SiteContentProvider } from "@/components/baladz/SiteContentProvider";

export const metadata = {
  title: "Biaya & Pembayaran — PSB Ma'had Baladz",
  description: "Status pembayaran biaya pendaftaran calon santri baru.",
};

export default function PembayaranPage() {
  return (
    <SiteContentProvider>
      <SantriDashboard />
    </SiteContentProvider>
  );
}
