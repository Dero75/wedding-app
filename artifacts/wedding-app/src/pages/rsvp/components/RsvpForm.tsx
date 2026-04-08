import { Edit3, Leaf, WheatOff } from "lucide-react";
import { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { DIETARY_FLAG_LABELS, type DietaryFlag } from "@/config/rsvp";
import WeddingButton from "@/components/WeddingButton";
import { normalizePersonName } from "@/lib/personName";
import type { RSVPFormData } from "@/pages/rsvp/schema";
import RsvpInputField from "./RsvpInputField";

const inputClass =
  "w-full border border-border rounded-xl px-4 py-3.5 bg-white text-foreground outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent placeholder:text-muted-foreground transition-all text-sm";

const dietarySelectClass =
  "w-[88px] border border-border rounded-lg px-3 py-2 bg-white text-foreground outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent text-sm";

interface RsvpFormProps {
  form: UseFormReturn<RSVPFormData>;
  editing: boolean;
  onCancelEdit: () => void;
  onSubmit: (data: RSVPFormData) => void;
  onDecline: (firstName: string, lastName: string) => Promise<void> | void;
}

const dietaryOptions: { flag: DietaryFlag; Icon: typeof Leaf }[] = [
  { flag: "vegetarian", Icon: Leaf },
  { flag: "celiac", Icon: WheatOff },
];

const dietaryIconColor: Record<DietaryFlag, string> = {
  vegetarian: "#6f8f4a",
  celiac: "#b38a63",
};

export default function RsvpForm({ form, editing, onCancelEdit, onSubmit, onDecline }: RsvpFormProps) {
  const [declineMode, setDeclineMode] = useState(false);
  const dietaryCountsError = form.formState.errors.dietaryCounts;
  const dietaryCountsErrorMessage =
    dietaryCountsError && "message" in dietaryCountsError && typeof dietaryCountsError.message === "string"
      ? dietaryCountsError.message
      : undefined;
  const firstNameField = form.register("firstName");
  const lastNameField = form.register("lastName");
  const handleSubmitForm = form.handleSubmit((data) => {
    if (declineMode) {
      return onDecline(data.firstName, data.lastName);
    }
    return onSubmit(data);
  });

  const normalizeNameOnBlur = (field: "firstName" | "lastName", value: string) => {
    const normalized = normalizePersonName(value);
    if (value === normalized) return;
    form.setValue(field, normalized, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      {editing && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm border border-border bg-white"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          <Edit3 size={13} />
          <span>Stai modificando la tua risposta</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <RsvpInputField label="Nome *" error={form.formState.errors.firstName?.message}>
          <input
            {...firstNameField}
            data-testid="input-first-name"
            className={inputClass}
            placeholder="Nome"
            onBlur={(event) => {
              firstNameField.onBlur(event);
              normalizeNameOnBlur("firstName", event.target.value);
            }}
          />
        </RsvpInputField>

        <RsvpInputField label="Cognome *" error={form.formState.errors.lastName?.message}>
          <input
            {...lastNameField}
            data-testid="input-last-name"
            className={inputClass}
            placeholder="Cognome"
            onBlur={(event) => {
              lastNameField.onBlur(event);
              normalizeNameOnBlur("lastName", event.target.value);
            }}
          />
        </RsvpInputField>
      </div>

      {!declineMode && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <RsvpInputField label="Adulti *" error={form.formState.errors.guestCount?.message}>
              <select
                {...form.register("guestCount", { valueAsNumber: true })}
                data-testid="select-guest-count"
                className={inputClass}
              >
                {[1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "adulto" : "adulti"}
                  </option>
                ))}
              </select>
            </RsvpInputField>

            <RsvpInputField label="Minorenni" error={form.formState.errors.childrenCount?.message}>
              <select
                {...form.register("childrenCount", { valueAsNumber: true })}
                data-testid="select-children-count"
                className={inputClass}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((count) => (
                  <option key={count} value={count}>
                    {count} {count === 1 ? "minorenne" : "minorenni"}
                  </option>
                ))}
              </select>
            </RsvpInputField>
          </div>

          <RsvpInputField label="Esigenze alimentari" error={dietaryCountsErrorMessage}>
            <div className="space-y-2.5">
              {dietaryOptions.map(({ flag, Icon }) => (
                <div
                  key={flag}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 flex items-center justify-between gap-3"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon size={16} style={{ color: dietaryIconColor[flag] }} />
                    <span className="font-sans text-xs tracking-wider uppercase text-foreground">
                      {DIETARY_FLAG_LABELS[flag]}
                    </span>
                  </span>

                  <select
                    {...form.register(`dietaryCounts.${flag}`, { valueAsNumber: true })}
                    data-testid={`select-dietary-${flag}`}
                    className={dietarySelectClass}
                  >
                    {Array.from({ length: 7 }, (_, index) => index).map((count) => (
                      <option key={`${flag}-${count}`} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </RsvpInputField>
        </>
      )}

      <div className="flex gap-3 pt-1">
        {(editing || declineMode) && (
          <WeddingButton
            variant="outline"
            type="button"
            onClick={() => {
              if (declineMode) {
                setDeclineMode(false);
                return;
              }
              onCancelEdit();
            }}
            data-testid="button-cancel-edit"
          >
            Annulla
          </WeddingButton>
        )}
        <WeddingButton type="submit" fullWidth data-testid="button-submit-rsvp">
          {editing ? "Aggiorna risposta" : declineMode ? "Conferma la tua assenza" : "Invia conferma"}
        </WeddingButton>
      </div>

      {!editing && !declineMode && (
        <button
          type="button"
          data-testid="button-decline-rsvp"
          onClick={() => setDeclineMode(true)}
          className="w-full inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-xs uppercase tracking-wider text-foreground hover:opacity-95 transition-opacity"
        >
          Non potrò partecipare
        </button>
      )}

    </form>
  );
}
