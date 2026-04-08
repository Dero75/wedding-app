import type { EditableContent } from "@/lib/storage";
import AdminTextField from "./AdminTextField";
import { CONTENT_SECTIONS } from "../constants";

interface AdminContentSectionProps {
  content: EditableContent;
  onContentChange: (key: keyof EditableContent, value: string) => void;
  onContentBlur: (key: keyof EditableContent, value: string) => void;
}

export default function AdminContentSection({
  content,
  onContentChange,
  onContentBlur,
}: AdminContentSectionProps) {
  return (
    <div className="space-y-4">
      {CONTENT_SECTIONS.map((section) => (
        <section key={section.title} className="rounded-2xl border border-border bg-white px-4 py-4">
          <p
            className="text-xs mb-1 font-sans font-medium uppercase tracking-wider"
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
              onBlur={() => onContentBlur(field.key, content[field.key])}
            />
          ))}
        </section>
      ))}
    </div>
  );
}
