import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getRSVPs } from "@/lib/storage";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import AdminStats from "@/pages/admin/components/AdminStats";

export default function Admin() {
  const rsvps = getRSVPs();

  const confirmedAdults = rsvps.reduce((acc, rsvp) => acc + rsvp.guestCount, 0);

  return (
    <Layout>
      <PageContainer className="h-[calc(100dvh-3.5rem)] max-h-[calc(100dvh-3.5rem)] overflow-hidden flex flex-col pt-8 pb-4">
        <SectionTitle title="Gestione Invitati" />

        <AdminStats confirmedAdults={confirmedAdults} />

        <div className="flex-1 min-h-0">
          <AdminRsvpSection rsvps={rsvps} />
        </div>
      </PageContainer>
    </Layout>
  );
}
