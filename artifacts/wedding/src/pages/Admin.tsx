import { useState } from "react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { deleteRSVP, getRSVPs, type RSVPEntry } from "@/lib/storage";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import AdminStats from "@/pages/admin/components/AdminStats";

export default function Admin() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());

  const attending = rsvps.filter((rsvp) => rsvp.attending);
  const nonAttending = rsvps.filter((rsvp) => !rsvp.attending);
  const totalGuests = attending.reduce((acc, rsvp) => acc + rsvp.guestCount, 0);

  const handleDeleteRsvp = (id: string) => {
    deleteRSVP(id);
    setRsvps(getRSVPs());
  };

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Pannello Admin" subtitle="Gestione" />

        <AdminStats
          totalResponses={rsvps.length}
          attendingCount={attending.length}
          totalGuests={totalGuests}
        />

        <AdminRsvpSection
          rsvps={rsvps}
          attendingCount={attending.length}
          nonAttendingCount={nonAttending.length}
          totalGuests={totalGuests}
          onRefresh={() => setRsvps(getRSVPs())}
          onDelete={handleDeleteRsvp}
        />
      </PageContainer>
    </Layout>
  );
}
