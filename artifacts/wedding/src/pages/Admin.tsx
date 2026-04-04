import { useState } from "react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import {
  deleteRSVP,
  getAdminSettings,
  getContent,
  getRSVPs,
  saveAdminSettings,
  saveContent,
  type AdminSettings,
  type EditableContent,
  type RSVPEntry,
} from "@/lib/storage";
import AdminContentSection from "@/pages/admin/components/AdminContentSection";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import AdminStats from "@/pages/admin/components/AdminStats";
import AdminStyleSection from "@/pages/admin/components/AdminStyleSection";
import AdminVisibilitySection from "@/pages/admin/components/AdminVisibilitySection";
import type { VisibilityKey } from "@/pages/admin/constants";

export default function Admin() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [content, setContent] = useState<EditableContent>(() => getContent());

  const attending = rsvps.filter((rsvp) => rsvp.attending);
  const nonAttending = rsvps.filter((rsvp) => !rsvp.attending);
  const totalGuests = attending.reduce((acc, rsvp) => acc + rsvp.guestCount, 0);

  const updateSettings = (partial: Partial<AdminSettings>) => {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveAdminSettings(next);
    document.documentElement.dataset.preset = next.stylePreset;
    window.dispatchEvent(new Event("preset-changed"));
  };

  const updateContent = (partial: Partial<EditableContent>) => {
    const next = { ...content, ...partial };
    setContent(next);
    saveContent(next);
  };

  const handleVisibilityChange = (key: VisibilityKey, value: boolean) => {
    updateSettings({ [key]: value } as Pick<AdminSettings, VisibilityKey>);
  };

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

        <AdminStyleSection
          selectedPreset={settings.stylePreset}
          onPresetChange={(preset) => updateSettings({ stylePreset: preset })}
        />

        <AdminVisibilitySection settings={settings} onVisibilityChange={handleVisibilityChange} />

        <AdminContentSection
          content={content}
          onContentChange={(key, value) => updateContent({ [key]: value })}
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
