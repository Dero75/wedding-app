import { useState } from "react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { normalizeAdminContentValue } from "@/lib/contentCase";
import { getContent, saveContent, type EditableContent } from "@/lib/storage";
import AdminContentSection from "@/pages/admin/components/AdminContentSection";

export default function AdminSettings() {
  const [content, setContent] = useState<EditableContent>(() => getContent());

  const updateContent = (key: keyof EditableContent, value: string, normalize: boolean) => {
    const nextValue = normalize ? normalizeAdminContentValue(key, value) : value;
    const next = { ...content, [key]: nextValue };
    setContent(next);
    saveContent(next);
  };

  return (
    <Layout>
      <PageContainer className="pt-8">
        <SectionTitle title="Impostazioni" />

        <AdminContentSection
          content={content}
          onContentChange={(key, value) => updateContent(key, value, false)}
          onContentBlur={(key, value) => updateContent(key, value, true)}
        />
      </PageContainer>
    </Layout>
  );
}
