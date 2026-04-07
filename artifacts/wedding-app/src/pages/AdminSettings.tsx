import { useState } from "react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getContent, saveContent, type EditableContent } from "@/lib/storage";
import AdminContentSection from "@/pages/admin/components/AdminContentSection";

export default function AdminSettings() {
  const [content, setContent] = useState<EditableContent>(() => getContent());

  const updateContent = (partial: Partial<EditableContent>) => {
    const next = { ...content, ...partial };
    setContent(next);
    saveContent(next);
  };

  return (
    <Layout>
      <PageContainer className="pt-8">
        <SectionTitle title="Impostazioni" />

        <AdminContentSection
          content={content}
          onContentChange={(key, value) => updateContent({ [key]: value })}
        />
      </PageContainer>
    </Layout>
  );
}
