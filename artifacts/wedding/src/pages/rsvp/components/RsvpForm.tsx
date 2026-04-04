import { Edit3, Leaf, Sprout, WheatOff } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { DIETARY_FLAG_LABELS, type DietaryFlag } from "@/config/rsvp";
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
  const selectedFlags = form.watch("dietaryFlags") ?? [];

  const dietaryOptions: { flag: DietaryFlag; Icon: typeof Leaf }[] = [
    { flag: "vegetarian", Icon: Leaf },
    { flag: "vegan", Icon: Sprout },
    { flag: "celiac", Icon: WheatOff },
  ];

  const toggleDietaryFlag = (flag: DietaryFlag) => {
    if (selectedFlags.includes(flag)) {
      form.setValue(
        "dietaryFlags",
        selectedFlags.filter((item) => item !== flag),
        { shouldDirty: true, shouldTouch: true },
      );
      return;
    }

    form.setValue("dietaryFlags", [...selectedFlags, flag], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

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
        label="Numero adulti confermati (incluso te) *"
        error={form.formState.errors.guestCount?.message}
      >
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

      <RsvpInputField
        label="Numero bambini sotto i 16 anni"
        error={form.formState.errors.childrenCount?.message}
      >
        <select
          {...form.register("childrenCount", { valueAsNumber: true })}
          data-testid="select-children-count"
          className={inputClass}
        >
          {[0, 1, 2, 3, 4, 5, 6].map((count) => (
            <option key={count} value={count}>
              {count} {count === 1 ? "bambino" : "bambini"}
            </option>
          ))}
        </select>
      </RsvpInputField>

      <RsvpInputField label="Esigenze alimentari" hint="Facoltativo">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {dietaryOptions.map(({ flag, Icon }) => {
            const isSelected = selectedFlags.includes(flag);
            return (
              <button
                key={flag}
                type="button"
                onClick={() => toggleDietaryFlag(flag)}
                data-testid={`toggle-dietary-${flag}`}
                aria-pressed={isSelected}
                className={`w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={16} style={{ color: "hsl(var(--accent))" }} />
                  <span className="font-sans text-xs tracking-wide uppercase">
                    {DIETARY_FLAG_LABELS[flag]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
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
