import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import {
  getAdminSettings,
  getContent,
  saveAdminSettings,
  saveContent,
  type AdminSettings,
  type EditableContent,
} from "@/lib/storage";
import AdminContentSection from "@/pages/admin/components/AdminContentSection";
import AdminStyleSection from "@/pages/admin/components/AdminStyleSection";
import AdminVisibilitySection from "@/pages/admin/components/AdminVisibilitySection";
import type { VisibilityKey } from "@/pages/admin/constants";

export default function AdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings());
  const [content, setContent] = useState<EditableContent>(() => getContent());

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

  return (
    <Layout>
      <PageContainer>
        <div className="mb-5">
          <Link href="/admin">
            <WeddingButton variant="ghost" type="button">
              <ArrowLeft size={13} className="mr-2" />
              Torna alla gestione
            </WeddingButton>
          </Link>
        </div>

        <SectionTitle title="Impostazioni" subtitle="Admin" />

        <AdminStyleSection
          selectedPreset={settings.stylePreset}
          onPresetChange={(preset) => updateSettings({ stylePreset: preset })}
        />

        <AdminVisibilitySection settings={settings} onVisibilityChange={handleVisibilityChange} />

        <AdminContentSection
          content={content}
          onContentChange={(key, value) => updateContent({ [key]: value })}
        />
      </PageContainer>
    </Layout>
  );
}
