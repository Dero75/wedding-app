import { Eye } from "lucide-react";
import type { AdminSettings } from "@/lib/storage";
import Toggle from "@/components/Toggle";
import AdminAccordionSection from "./AdminAccordionSection";
import { VISIBILITY_ITEMS, type VisibilityKey } from "../constants";

interface AdminVisibilitySectionProps {
  settings: AdminSettings;
  onVisibilityChange: (key: VisibilityKey, value: boolean) => void;
}

export default function AdminVisibilitySection({
  settings,
  onVisibilityChange,
}: AdminVisibilitySectionProps) {
  return (
    <AdminAccordionSection icon={<Eye size={16} />} title="Visibilità sezioni">
      <div className="space-y-4 mt-4">
        {VISIBILITY_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between">
            <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
              {item.label}
            </span>
            <Toggle
              checked={settings[item.key]}
              onChange={(checked) => onVisibilityChange(item.key, checked)}
              data-testid={`toggle-${item.key}`}
            />
          </div>
        ))}
      </div>
    </AdminAccordionSection>
  );
}
