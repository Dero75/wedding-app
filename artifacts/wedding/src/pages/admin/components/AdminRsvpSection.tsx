import { DIETARY_FLAG_LABELS } from "@/config/rsvp";
import type { RSVPEntry } from "@/lib/storage";

interface AdminRsvpSectionProps {
  rsvps: RSVPEntry[];
}

export default function AdminRsvpSection({ rsvps }: AdminRsvpSectionProps) {
  return (
    <div className="h-full min-h-0 overflow-y-auto pr-0.5 space-y-2.5">
      {rsvps.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-6">Nessuna risposta ancora.</p>
      ) : (
        rsvps.map((rsvp) => (
          <div
            key={rsvp.id}
            className="p-3 rounded-xl border border-border bg-card"
          >
            <div className="min-w-0">
              <p
                className="font-serif text-[0.98rem] leading-snug"
                style={{ color: "hsl(var(--foreground))" }}
                data-testid={`rsvp-name-${rsvp.id}`}
              >
                {rsvp.fullName}
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-0.5">
                Confermato · {rsvp.guestCount} {rsvp.guestCount === 1 ? "adulto" : "adulti"}
                {rsvp.childrenCount > 0
                  ? ` · ${rsvp.childrenCount} ${rsvp.childrenCount === 1 ? "bambino" : "bambini"}`
                  : ""}
              </p>
              {rsvp.dietaryFlags.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {rsvp.dietaryFlags.map((flag) => (
                    <span
                      key={flag}
                      className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground"
                    >
                      {DIETARY_FLAG_LABELS[flag]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
