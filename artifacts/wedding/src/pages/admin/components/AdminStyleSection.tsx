import { Palette } from "lucide-react";
import type { AdminSettings } from "@/lib/storage";
import AdminAccordionSection from "./AdminAccordionSection";
import { PRESET_COLORS, PRESET_LABELS, STYLE_PRESETS } from "../constants";

interface AdminStyleSectionProps {
  selectedPreset: AdminSettings["stylePreset"];
  onPresetChange: (preset: AdminSettings["stylePreset"]) => void;
}

export default function AdminStyleSection({
  selectedPreset,
  onPresetChange,
}: AdminStyleSectionProps) {
  return (
    <AdminAccordionSection icon={<Palette size={16} />} title="Stile dell'app">
      <p
        className="text-xs mt-4 mb-3 uppercase tracking-widest"
        style={{ color: "hsl(var(--muted-foreground))" }}
      >
        Scegli il tema visivo
      </p>
      <div className="grid grid-cols-2 gap-3">
        {STYLE_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            data-testid={`button-preset-${preset}`}
            onClick={() => onPresetChange(preset)}
            className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
              selectedPreset === preset
                ? "border-accent"
                : "border-border hover:border-muted-foreground/40"
            }`}
          >
            <div
              className="w-8 h-8 rounded-full shadow-inner border border-border/60"
              style={{ background: PRESET_COLORS[preset] }}
            />
            <span
              className="text-[10px] text-center leading-tight"
              style={{
                color:
                  selectedPreset === preset ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))",
                fontWeight: selectedPreset === preset ? 600 : 400,
              }}
            >
              {PRESET_LABELS[preset]}
            </span>
          </button>
        ))}
      </div>
    </AdminAccordionSection>
  );
}
