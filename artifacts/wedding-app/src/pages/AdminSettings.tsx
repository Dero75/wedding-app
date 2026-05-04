import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getContent, saveContent, type EditableContent } from "@/lib/storage";
import AdminContentSection from "@/pages/admin/components/AdminContentSection";

const googleSheetBackupUrl = import.meta.env.VITE_GOOGLE_SHEET_RSVP_BACKUP_URL as string | undefined;

export default function AdminSettings() {
  const [content, setContent] = useState<EditableContent>(() => getContent());
  const hasGoogleSheetBackupUrl = Boolean(googleSheetBackupUrl?.trim());

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

        <div className="pt-5 pb-2">
          {hasGoogleSheetBackupUrl ? (
            <a
              href={googleSheetBackupUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="button-open-google-sheet"
              className="mx-auto flex w-full max-w-xs items-center justify-center gap-2 rounded-full border border-[#7f9b73] bg-[#8fa878] px-5 py-3 font-sans text-xs uppercase tracking-wider text-white shadow-sm transition-opacity hover:opacity-95"
            >
              <ExternalLink size={15} />
              Foglio Google
            </a>
          ) : (
            <button
              type="button"
              disabled
              data-testid="button-open-google-sheet-disabled"
              className="mx-auto flex w-full max-w-xs cursor-not-allowed items-center justify-center gap-2 rounded-full border border-[#9eb194] bg-[#a9b99a] px-5 py-3 font-sans text-xs uppercase tracking-wider text-white opacity-60"
            >
              <ExternalLink size={15} />
              Foglio Google
            </button>
          )}
        </div>
      </PageContainer>
    </Layout>
  );
}
