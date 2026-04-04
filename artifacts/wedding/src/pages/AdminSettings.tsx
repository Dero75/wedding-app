import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
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
      <PageContainer>
        <div className="mb-5">
          <Link href="/admin">
            <WeddingButton variant="ghost" type="button">
              <ArrowLeft size={13} className="mr-2" />
              Torna alla gestione
            </WeddingButton>
          </Link>
        </div>

        <SectionTitle title="Impostazioni" />

        <AdminContentSection
          content={content}
          onContentChange={(key, value) => updateContent({ [key]: value })}
        />
      </PageContainer>
    </Layout>
  );
}
