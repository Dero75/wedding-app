import type { EditableContent } from "@/lib/storage";
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
  const homeSections = CONTENT_SECTIONS.filter(
    (section) => section.title === "Benvenuto" || section.title === "Bottoni Home",
  );
  const programSections = CONTENT_SECTIONS.filter(
    (section) =>
      section.title !== "Benvenuto" &&
      section.title !== "Bottoni Home" &&
      !section.title.startsWith("Regalo"),
  );
  const giftSections = CONTENT_SECTIONS.filter((section) => section.title.startsWith("Regalo"));

  const renderSection = (section: (typeof CONTENT_SECTIONS)[number]) => (
    <section key={section.title} className="rounded-2xl border border-border bg-white px-4 py-4">
      {section.title !== "Benvenuto" &&
        section.title !== "Bottoni Home" &&
        section.title !== "Programma" &&
        section.title !== "Cerimonia" &&
        section.title !== "Ricevimento" &&
        section.title !== "Outfit" &&
        !section.title.startsWith("Regalo") && (
        <p
          className="text-xs mb-1 font-sans font-medium uppercase tracking-wider"
          style={{ color: "hsl(var(--foreground))" }}
        >
          {section.title}
        </p>
      )}
      {section.fields.map((field) => (
        <AdminTextField
          key={field.key}
          label={field.label}
          value={content[field.key]}
          multiline={field.multiline}
          onChange={(value) => onContentChange(field.key, value)}
        />
      ))}
    </section>
  );

  return (
    <div className="space-y-4">
      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Home
      </p>
      {homeSections.map(renderSection)}

      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground pt-1 font-semibold">
        Programma
      </p>
      {programSections.map(renderSection)}

      <p className="text-center text-xs uppercase tracking-wider text-muted-foreground pt-1 font-semibold">
        Regalo
      </p>
      {giftSections.map(renderSection)}
    </div>
  );
}
