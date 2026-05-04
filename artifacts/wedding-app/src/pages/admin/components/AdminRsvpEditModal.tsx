import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Check, Leaf, WheatOff, X } from "lucide-react";
import {
  DIETARY_FLAG_LABELS,
  DIETARY_FLAG_VALUES,
  createDefaultDietaryCounts,
} from "@/config/rsvp";
import { normalizePersonName } from "@/lib/personName";
import type { RSVPEntry } from "@/lib/storage";

const fieldClass =
  "w-full rounded-xl border border-border bg-white px-3.5 py-3 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-ring/40";

const compactSelectClass =
  "w-[82px] rounded-lg border border-border bg-white px-2.5 py-2 text-sm text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-ring/40";

interface AdminRsvpEditModalProps {
  rsvp: RSVPEntry;
  onClose: () => void;
  onSaveRsvp: (entry: RSVPEntry) => Promise<void>;
}

type EditDraft = Pick<
  RSVPEntry,
  "firstName" | "lastName" | "attending" | "guestCount" | "childrenCount" | "dietaryCounts"
>;

export default function AdminRsvpEditModal({ rsvp, onClose, onSaveRsvp }: AdminRsvpEditModalProps) {
  const [draft, setDraft] = useState<EditDraft>(() => ({
    firstName: rsvp.firstName,
    lastName: rsvp.lastName,
    attending: rsvp.attending,
    guestCount: rsvp.attending ? rsvp.guestCount : 1,
    childrenCount: rsvp.attending ? rsvp.childrenCount : 0,
    dietaryCounts: rsvp.attending ? rsvp.dietaryCounts : createDefaultDietaryCounts(),
  }));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalGuests = Math.max(0, draft.guestCount + draft.childrenCount);
  const dietaryTotal = DIETARY_FLAG_VALUES.reduce(
    (acc, flag) => acc + draft.dietaryCounts[flag],
    0,
  );
  const selectedName = `${rsvp.firstName} ${rsvp.lastName}`.trim();

  const dietaryOptions = useMemo(
    () => Array.from({ length: Math.max(totalGuests, 0) + 1 }, (_, index) => index),
    [totalGuests],
  );

  useEffect(() => {
    if (!draft.attending) {
      setDraft((current) => ({
        ...current,
        guestCount: 1,
        childrenCount: 0,
        dietaryCounts: createDefaultDietaryCounts(),
      }));
      return;
    }

    setDraft((current) => ({
      ...current,
      dietaryCounts: {
        vegetarian: Math.min(current.dietaryCounts.vegetarian, totalGuests),
        celiac: Math.min(current.dietaryCounts.celiac, totalGuests),
      },
    }));
  }, [draft.attending, totalGuests]);

  const updateDietaryCount = (flag: keyof RSVPEntry["dietaryCounts"], value: number) => {
    setDraft((current) => ({
      ...current,
      dietaryCounts: {
        ...current.dietaryCounts,
        [flag]: value,
      },
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    const firstName = normalizePersonName(draft.firstName);
    const lastName = normalizePersonName(draft.lastName);

    if (firstName.length < 2 || lastName.length < 2) {
      setError("Inserisci nome e cognome completi.");
      return;
    }

    if (draft.attending && dietaryTotal > totalGuests) {
      setError("Le esigenze alimentari non possono superare il totale invitati.");
      return;
    }

    const nextEntry: RSVPEntry = {
      ...rsvp,
      firstName,
      lastName,
      attending: draft.attending,
      guestCount: draft.attending ? draft.guestCount : 0,
      childrenCount: draft.attending ? draft.childrenCount : 0,
      dietaryCounts: draft.attending ? draft.dietaryCounts : createDefaultDietaryCounts(),
    };

    setIsSaving(true);
    setError(null);
    try {
      await onSaveRsvp(nextEntry);
      onClose();
    } catch {
      setError("Modifica non riuscita. Riprova tra pochi secondi.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-foreground/30 px-4 py-4 backdrop-blur-sm [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-top:max(1rem,env(safe-area-inset-top))] sm:px-5"
      onClick={isSaving ? undefined : onClose}
    >
      <form
        onSubmit={(event) => void handleSubmit(event)}
        className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Modifica conferma ${selectedName}`}
        data-testid="modal-edit-rsvp"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
              Gestione invitato
            </p>
            <h3
              className="font-serif text-2xl leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Modifica conferma
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-60"
            aria-label="Chiudi modifica invitato"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-full border border-border bg-white p-1">
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, attending: true }))}
            className={`rounded-full px-3 py-2 text-[10px] uppercase tracking-wider transition-colors ${
              draft.attending ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
            data-testid="button-edit-rsvp-attending"
          >
            Confermato
          </button>
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, attending: false }))}
            className={`rounded-full px-3 py-2 text-[10px] uppercase tracking-wider transition-colors ${
              !draft.attending ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
            data-testid="button-edit-rsvp-declined"
          >
            Assente
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1.5">
              <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
                Nome
              </span>
              <input
                value={draft.firstName}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, firstName: event.target.value }))
                }
                onBlur={(event) =>
                  setDraft((current) => ({
                    ...current,
                    firstName: normalizePersonName(event.target.value),
                  }))
                }
                className={fieldClass}
                data-testid="input-edit-rsvp-first-name"
              />
            </label>

            <label className="space-y-1.5">
              <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
                Cognome
              </span>
              <input
                value={draft.lastName}
                onChange={(event) =>
                  setDraft((current) => ({ ...current, lastName: event.target.value }))
                }
                onBlur={(event) =>
                  setDraft((current) => ({
                    ...current,
                    lastName: normalizePersonName(event.target.value),
                  }))
                }
                className={fieldClass}
                data-testid="input-edit-rsvp-last-name"
              />
            </label>
          </div>

          {draft.attending && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <label className="space-y-1.5">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
                    Adulti
                  </span>
                  <select
                    value={draft.guestCount}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        guestCount: Number(event.target.value),
                      }))
                    }
                    className={fieldClass}
                    data-testid="select-edit-rsvp-guest-count"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? "adulto" : "adulti"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
                    Under18
                  </span>
                  <select
                    value={draft.childrenCount}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        childrenCount: Number(event.target.value),
                      }))
                    }
                    className={fieldClass}
                    data-testid="select-edit-rsvp-children-count"
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} under18
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2.5">
                {DIETARY_FLAG_VALUES.map((flag) => {
                  const isVegetarian = flag === "vegetarian";
                  const DietaryIcon = isVegetarian ? Leaf : WheatOff;
                  const iconColor = isVegetarian ? "#6f8f4a" : "#b38a63";

                  return (
                    <div
                      key={flag}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2.5"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <DietaryIcon size={16} style={{ color: iconColor }} />
                        <span className="font-sans text-[10px] uppercase tracking-wider text-foreground">
                          {DIETARY_FLAG_LABELS[flag]}
                        </span>
                      </span>
                      <select
                        value={draft.dietaryCounts[flag]}
                        onChange={(event) => updateDietaryCount(flag, Number(event.target.value))}
                        className={compactSelectClass}
                        data-testid={`select-edit-rsvp-dietary-${flag}`}
                      >
                        {dietaryOptions.map((count) => (
                          <option key={`${flag}-${count}`} value={count}>
                            {count}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {error && <p className="mt-3 text-xs text-destructive">{error}</p>}

        <div className="mt-5 flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground disabled:opacity-60"
          >
            Annulla
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-primary-border bg-primary px-4 py-2.5 text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-95 disabled:opacity-60"
            data-testid="button-save-edit-rsvp"
          >
            <Check size={14} />
            {isSaving ? "Salvo..." : "Salva"}
          </button>
        </div>
      </form>
    </div>
  );
}
