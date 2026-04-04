import { FileText } from "lucide-react";
import type { EditableContent } from "@/lib/storage";
import AdminAccordionSection from "./AdminAccordionSection";
import AdminTextField from "./AdminTextField";
import { CONTENT_SECTIONS } from "../constants";

interface AdminContentSectionProps {
  content: EditableContent;
  onContentChange: (key: keyof EditableContent, value: string) => void;
}

export default function AdminContentSection({
  content,
  onContentChange,
}: AdminContentSectionProps) {
  return (
    <AdminAccordionSection icon={<FileText size={16} />} title="Testi e contenuti">
      <div className="mt-2">
        {CONTENT_SECTIONS.map((section, sectionIndex) => (
          <div key={section.title}>
            <p
              className={`text-xs mb-1 font-sans font-medium uppercase tracking-widest ${
                sectionIndex === 0 ? "mt-4" : "mt-6"
              }`}
              style={{ color: "hsl(var(--foreground))" }}
            >
              {section.title}
            </p>
            {section.fields.map((field) => (
              <AdminTextField
                key={field.key}
                label={field.label}
                value={content[field.key]}
                multiline={field.multiline}
                onChange={(value) => onContentChange(field.key, value)}
              />
            ))}
          </div>
        ))}
      </div>
    </AdminAccordionSection>
  );
}
