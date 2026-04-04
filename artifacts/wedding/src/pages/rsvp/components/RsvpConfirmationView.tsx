import { CheckCircle, Edit3, Heart } from "lucide-react";
import WeddingButton from "@/components/WeddingButton";
import WeddingCard from "@/components/WeddingCard";
import type { RSVPEntry } from "@/lib/storage";

interface RsvpConfirmationViewProps {
  submitted: RSVPEntry;
  onEdit: () => void;
}

export default function RsvpConfirmationView({ submitted, onEdit }: RsvpConfirmationViewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WeddingCard className="text-center mb-6">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
          style={{ background: "hsl(var(--accent) / 0.12)" }}
        >
          <CheckCircle size={28} style={{ color: "hsl(var(--accent))" }} />
        </div>
        <h3 className="font-serif text-xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Grazie, {submitted.fullName}!
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {submitted.attending
            ? `Non vediamo l'ora di festeggiare con te${
                submitted.guestCount > 1 ? ` e i tuoi ${submitted.guestCount - 1} ospiti` : ""
              }!`
            : "Ci dispiace che non riuscirai a esserci. Saremo con te nel cuore."}
        </p>

        {submitted.message && (
          <div className="bg-background border border-border rounded-xl p-4 text-left mb-5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              Il tuo messaggio
            </p>
            <p className="text-sm italic" style={{ color: "hsl(var(--foreground))" }}>
              "{submitted.message}"
            </p>
          </div>
        )}

        <WeddingButton variant="outline" onClick={onEdit} data-testid="button-edit-rsvp">
          <Edit3 size={13} className="mr-2" />
          Modifica risposta
        </WeddingButton>
      </WeddingCard>

      <div className="grid grid-cols-2 gap-3">
        {[
          {
            label: "Presenza",
            value: submitted.attending ? "Confermata ✓" : "Non presente",
            ok: submitted.attending,
          },
          { label: "Ospiti", value: submitted.guestCount, ok: true },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1.5">
              {item.label}
            </p>
            <p
              className="font-serif text-base"
              style={{
                color: item.ok ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        <Heart size={10} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
        <span className="text-xs text-muted-foreground tracking-widest uppercase">D & D 2025</span>
        <Heart size={10} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
      </div>
    </div>
  );
}
