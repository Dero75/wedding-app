import { CheckCircle, Edit3 } from "lucide-react";
import { DIETARY_FLAG_LABELS, DIETARY_FLAG_VALUES } from "@/config/rsvp";
import WeddingButton from "@/components/WeddingButton";
import WeddingCard from "@/components/WeddingCard";
import type { RSVPEntry } from "@/lib/storage";

interface RsvpConfirmationViewProps {
  submitted: RSVPEntry;
  onEdit: () => void;
}

export default function RsvpConfirmationView({ submitted, onEdit }: RsvpConfirmationViewProps) {
  const otherGuestsCount = submitted.guestCount + submitted.childrenCount - 1;
  const fullName = `${submitted.firstName} ${submitted.lastName}`.trim();
  const selectedDietary = DIETARY_FLAG_VALUES.filter((flag) => submitted.dietaryCounts[flag] > 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WeddingCard className="text-center mb-6 bg-white">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
          style={{ background: "hsl(var(--accent) / 0.12)" }}
        >
          <CheckCircle size={28} style={{ color: "hsl(var(--accent))" }} />
        </div>
        <h3 className="font-serif text-xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Grazie, {fullName}!
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Non vediamo l'ora di festeggiare con te
          {otherGuestsCount > 0 ? ` e i tuoi ${otherGuestsCount} ospiti` : ""}!
        </p>

        <WeddingButton variant="outline" onClick={onEdit} data-testid="button-edit-rsvp">
          <Edit3 size={13} className="mr-2" />
          Modifica risposta
        </WeddingButton>
      </WeddingCard>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Conferma", value: "Registrata ✓" },
          { label: "Adulti", value: submitted.guestCount },
          { label: "Under 18", value: submitted.childrenCount },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              {item.label}
            </p>
            <p className="font-sans text-base" style={{ color: "hsl(var(--foreground))" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {selectedDietary.length > 0 && (
        <div className="mt-3 rounded-xl border border-border bg-white px-4 py-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">
            Esigenze alimentari
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedDietary.map((flag) => (
              <span
                key={flag}
                className="inline-flex items-center rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-wide"
              >
                {DIETARY_FLAG_LABELS[flag]}: {submitted.dietaryCounts[flag]}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
