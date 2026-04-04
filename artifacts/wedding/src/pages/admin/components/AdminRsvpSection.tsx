import { CheckCircle, RefreshCw, Trash2, Users, XCircle } from "lucide-react";
import type { RSVPEntry } from "@/lib/storage";
import AdminAccordionSection from "./AdminAccordionSection";

interface AdminRsvpSectionProps {
  rsvps: RSVPEntry[];
  attendingCount: number;
  nonAttendingCount: number;
  totalGuests: number;
  onRefresh: () => void;
  onDelete: (id: string) => void;
}

export default function AdminRsvpSection({
  rsvps,
  attendingCount,
  nonAttendingCount,
  totalGuests,
  onRefresh,
  onDelete,
}: AdminRsvpSectionProps) {
  return (
    <AdminAccordionSection icon={<Users size={16} />} title={`Lista RSVP (${rsvps.length})`}>
      <div className="flex items-center justify-between mt-4 mb-3">
        <span className="text-xs text-muted-foreground">
          {attendingCount} presenti · {totalGuests} ospiti totali
        </span>
        <button
          type="button"
          onClick={onRefresh}
          className="text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-refresh-rsvps"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {rsvps.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-6">Nessuna risposta ancora.</p>
      ) : (
        <div className="space-y-2">
          {rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background/50"
            >
              <div className="mt-0.5 shrink-0">
                {rsvp.attending ? (
                  <CheckCircle size={15} style={{ color: "hsl(var(--accent))" }} />
                ) : (
                  <XCircle size={15} className="text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className="font-serif text-sm leading-snug"
                  style={{ color: "hsl(var(--foreground))" }}
                  data-testid={`rsvp-name-${rsvp.id}`}
                >
                  {rsvp.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rsvp.attending
                    ? `Presente · ${rsvp.guestCount} ${rsvp.guestCount === 1 ? "persona" : "persone"}`
                    : "Non presente"}
                </p>
                {rsvp.dietaryNotes && (
                  <p className="text-xs text-muted-foreground mt-0.5 italic">{rsvp.dietaryNotes}</p>
                )}
                {rsvp.message && (
                  <p className="text-xs text-muted-foreground italic mt-1">"{rsvp.message}"</p>
                )}
              </div>

              <button
                type="button"
                onClick={() => onDelete(rsvp.id)}
                data-testid={`button-delete-rsvp-${rsvp.id}`}
                className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {nonAttendingCount > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          {nonAttendingCount}{" "}
          {nonAttendingCount === 1 ? "persona non potrà" : "persone non potranno"} essere presente
        </p>
      )}
    </AdminAccordionSection>
  );
}
