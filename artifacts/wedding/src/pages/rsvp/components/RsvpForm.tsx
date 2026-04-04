import { Edit3 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import WeddingButton from "@/components/WeddingButton";
import type { RSVPFormData } from "@/pages/rsvp/schema";
import RsvpInputField from "./RsvpInputField";

const inputClass =
  "w-full border border-border rounded-xl px-4 py-3.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent placeholder:text-muted-foreground transition-all text-sm";

interface RsvpFormProps {
  form: UseFormReturn<RSVPFormData>;
  editing: boolean;
  onCancelEdit: () => void;
  onSubmit: (data: RSVPFormData) => void;
}

export default function RsvpForm({ form, editing, onCancelEdit, onSubmit }: RsvpFormProps) {
  const attendingValue = form.watch("attending");

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {editing && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}
        >
          <Edit3 size={13} />
          <span>Stai modificando la tua risposta</span>
        </div>
      )}

      <RsvpInputField label="Nome e cognome *" error={form.formState.errors.fullName?.message}>
        <input
          {...form.register("fullName")}
          data-testid="input-full-name"
          className={inputClass}
          placeholder="Il tuo nome e cognome"
        />
      </RsvpInputField>

      <RsvpInputField
        label="Parteciperai al matrimonio? *"
        error={form.formState.errors.attending?.message}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "yes", label: "Sì, ci sarò!" },
            { value: "no", label: "Purtroppo no" },
          ].map((option) => (
            <label
              key={option.value}
              className={`flex items-center justify-center gap-2 border-2 rounded-xl py-3.5 cursor-pointer transition-all active:scale-[0.97] ${
                attendingValue === option.value
                  ? "border-accent bg-background"
                  : "border-border bg-card hover:border-border/60"
              }`}
              style={{
                color:
                  attendingValue === option.value
                    ? "hsl(var(--accent))"
                    : "hsl(var(--muted-foreground))",
              }}
            >
              <input
                type="radio"
                {...form.register("attending")}
                value={option.value}
                className="sr-only"
                data-testid={`radio-attending-${option.value}`}
              />
              <span className="text-sm font-sans">{option.label}</span>
            </label>
          ))}
        </div>
      </RsvpInputField>

      {attendingValue === "yes" && (
        <RsvpInputField
          label="Numero di persone (incluso te) *"
          error={form.formState.errors.guestCount?.message}
        >
          <select
            {...form.register("guestCount", { valueAsNumber: true })}
            data-testid="select-guest-count"
            className={inputClass}
          >
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? "persona" : "persone"}
              </option>
            ))}
          </select>
        </RsvpInputField>
      )}

      {attendingValue === "yes" && (
        <RsvpInputField
          label="Intolleranze o preferenze alimentari"
          hint="Facoltativo — es. vegetariano, celiaco"
        >
          <textarea
            {...form.register("dietaryNotes")}
            data-testid="textarea-dietary-notes"
            rows={2}
            className={`${inputClass} resize-none`}
            placeholder="Es. vegetariano, celiaco, allergie…"
          />
        </RsvpInputField>
      )}

      <RsvpInputField label="Un messaggio per noi" hint="Facoltativo">
        <textarea
          {...form.register("message")}
          data-testid="textarea-message"
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Lascia un pensiero per gli sposi…"
        />
      </RsvpInputField>

      <div className="flex gap-3 pt-1">
        {editing && (
          <WeddingButton
            variant="outline"
            type="button"
            onClick={onCancelEdit}
            data-testid="button-cancel-edit"
          >
            Annulla
          </WeddingButton>
        )}
        <WeddingButton type="submit" fullWidth data-testid="button-submit-rsvp">
          {editing ? "Aggiorna risposta" : "Invia risposta"}
        </WeddingButton>
      </div>
    </form>
  );
}
