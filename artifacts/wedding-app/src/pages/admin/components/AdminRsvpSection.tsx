import { useMemo, useState } from "react";
import { AlertTriangle, Leaf, Trash2, WheatOff, X } from "lucide-react";
import { DIETARY_FLAG_LABELS, DIETARY_FLAG_VALUES } from "@/config/rsvp";
import type { RSVPEntry } from "@/lib/storage";
import AdminRsvpEditModal from "./AdminRsvpEditModal";

interface AdminRsvpSectionProps {
  rsvps: RSVPEntry[];
  onDeleteRsvp: (id: string) => Promise<void>;
  onUpdateRsvp: (entry: RSVPEntry) => Promise<void>;
}

const SUBMITTED_DATE_FORMATTER = new Intl.DateTimeFormat("it-IT", {
  day: "numeric",
  month: "long",
});

function formatSubmittedDate(submittedAt: string): string | null {
  const date = new Date(submittedAt);
  if (Number.isNaN(date.getTime())) return null;
  const formatted = SUBMITTED_DATE_FORMATTER.format(date);
  return formatted.replace(/\p{L}+/u, (word) => word.charAt(0).toUpperCase() + word.slice(1));
}

export default function AdminRsvpSection({
  rsvps,
  onDeleteRsvp,
  onUpdateRsvp,
}: AdminRsvpSectionProps) {
  const [selectedRsvpId, setSelectedRsvpId] = useState<string | null>(null);
  const [editingRsvpId, setEditingRsvpId] = useState<string | null>(null);
  const [deleteStep, setDeleteStep] = useState<1 | 2 | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const selectedRsvp = useMemo(
    () => (selectedRsvpId ? (rsvps.find((rsvp) => rsvp.id === selectedRsvpId) ?? null) : null),
    [rsvps, selectedRsvpId],
  );
  const editingRsvp = useMemo(
    () => (editingRsvpId ? (rsvps.find((rsvp) => rsvp.id === editingRsvpId) ?? null) : null),
    [editingRsvpId, rsvps],
  );

  const selectedName = selectedRsvp
    ? `${selectedRsvp.firstName} ${selectedRsvp.lastName}`.trim()
    : "";

  const resetDeleteState = () => {
    setDeleteStep(null);
    setSelectedRsvpId(null);
    setDeleteError(null);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    resetDeleteState();
  };

  const startDeleteFlow = (id: string) => {
    setSelectedRsvpId(id);
    setDeleteStep(1);
    setDeleteError(null);
  };

  const continueDeleteFlow = () => {
    setDeleteStep(2);
    setDeleteError(null);
  };

  const handleDelete = async () => {
    if (!selectedRsvpId) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await onDeleteRsvp(selectedRsvpId);
      resetDeleteState();
    } catch {
      setDeleteError("Eliminazione non riuscita. Riprova tra pochi secondi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="h-full min-h-0 overflow-y-auto overscroll-contain pr-0.5 space-y-1.5">
        {rsvps.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-6">Nessuna risposta ancora.</p>
        ) : (
          rsvps.map((rsvp) => (
            <div
              key={rsvp.id}
              role="button"
              tabIndex={0}
              onClick={() => setEditingRsvpId(rsvp.id)}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setEditingRsvpId(rsvp.id);
              }}
              className="p-3 rounded-xl border bg-white cursor-pointer transition-colors hover:border-primary-border focus:outline-none focus:ring-2 focus:ring-ring/35"
              data-testid={`card-rsvp-${rsvp.id}`}
              style={
                rsvp.attending
                  ? undefined
                  : { borderColor: "hsl(0 70% 82%)", background: "hsl(0 80% 98%)" }
              }
            >
              <div className="min-w-0 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p
                    className="font-sans text-[0.98rem] leading-snug"
                    style={{ color: "hsl(var(--foreground))" }}
                    data-testid={`rsvp-name-${rsvp.id}`}
                  >
                    {`${rsvp.firstName} ${rsvp.lastName}`.trim()}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-xs text-muted-foreground">
                    {(() => {
                      const submittedDate = formatSubmittedDate(rsvp.submittedAt);
                      if (!submittedDate) return null;
                      return (
                        <>
                          <span>{submittedDate}</span>
                          <span aria-hidden="true">·</span>
                        </>
                      );
                    })()}
                    {rsvp.attending ? (
                      <>
                        <span style={{ color: "#6f8f4a" }}>Confermato</span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {`${rsvp.guestCount} ${rsvp.guestCount === 1 ? "adulto" : "adulti"}${
                            rsvp.childrenCount > 0 ? ` · ${rsvp.childrenCount} under18` : ""
                          }`}
                        </span>
                      </>
                    ) : (
                      <span>Non partecipa</span>
                    )}

                    {rsvp.attending &&
                      DIETARY_FLAG_VALUES.filter((flag) => rsvp.dietaryCounts[flag] > 0).map(
                        (flag) => {
                          const isVegetarian = flag === "vegetarian";
                          const DietaryIcon = isVegetarian ? Leaf : WheatOff;
                          const iconColor = isVegetarian ? "#6f8f4a" : "#b38a63";

                          return (
                            <span
                              key={flag}
                              className="inline-flex items-center gap-1"
                              aria-label={`${DIETARY_FLAG_LABELS[flag]} ${rsvp.dietaryCounts[flag]}`}
                            >
                              <DietaryIcon size={12} style={{ color: iconColor }} />
                              <span>{rsvp.dietaryCounts[flag]}</span>
                            </span>
                          );
                        },
                      )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    startDeleteFlow(rsvp.id);
                  }}
                  data-testid={`button-delete-rsvp-${rsvp.id}`}
                  className="inline-flex items-center justify-center p-1 text-[#b74a4a] hover:text-[#a53f3f] transition-colors shrink-0"
                  aria-label={`Elimina invitato ${`${rsvp.firstName} ${rsvp.lastName}`.trim()}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingRsvp && (
        <AdminRsvpEditModal
          rsvp={editingRsvp}
          onClose={() => setEditingRsvpId(null)}
          onSaveRsvp={onUpdateRsvp}
        />
      )}

      {deleteStep && selectedRsvp && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-foreground/30 px-4 py-4 backdrop-blur-sm [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-top:max(1rem,env(safe-area-inset-top))] sm:px-5"
          onClick={closeDeleteModal}
        >
          <div
            className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            data-testid={deleteStep === 1 ? "modal-delete-rsvp-step-1" : "modal-delete-rsvp-step-2"}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="inline-flex items-center justify-center rounded-full p-2 bg-accent/10 text-accent">
                <AlertTriangle size={16} />
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Chiudi conferma eliminazione"
              >
                <X size={16} />
              </button>
            </div>

            {deleteStep === 1 ? (
              <>
                <h3
                  className="font-serif text-2xl mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Eliminare invitato?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stai per rimuovere <strong>{selectedName}</strong> dalla lista dei confermati.
                </p>

                <div className="mt-5 flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={continueDeleteFlow}
                    data-testid="button-delete-rsvp-continue"
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-primary-border bg-primary px-4 py-2.5 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity"
                  >
                    Continua
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3
                  className="font-serif text-2xl mb-2"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  Conferma definitiva
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Questa azione elimina in modo permanente <strong>{selectedName}</strong>.
                </p>
                {deleteError && <p className="mt-2 text-xs text-destructive">{deleteError}</p>}

                <div className="mt-5 flex gap-2.5">
                  <button
                    type="button"
                    onClick={closeDeleteModal}
                    disabled={isDeleting}
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors disabled:opacity-60"
                  >
                    Annulla
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    data-testid="button-delete-rsvp-confirm"
                    className="flex-1 inline-flex items-center justify-center rounded-full border border-primary-border bg-primary px-4 py-2.5 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity disabled:opacity-60"
                  >
                    {isDeleting ? "Elimino..." : "Elimina invitato"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
