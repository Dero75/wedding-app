import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import WeddingCard from "@/components/WeddingCard";

interface AdminAccordionSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

export default function AdminAccordionSection({
  icon,
  title,
  children,
}: AdminAccordionSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <WeddingCard className="mb-4 !p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "hsl(var(--accent))" }}>{icon}</span>
          <span
            className="font-sans text-sm font-medium"
            style={{ color: "hsl(var(--foreground))" }}
          >
            {title}
          </span>
        </div>
        <span style={{ color: "hsl(var(--muted-foreground))" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-border">{children}</div>}
    </WeddingCard>
  );
}
