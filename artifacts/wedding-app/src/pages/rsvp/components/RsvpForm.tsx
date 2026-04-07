import { Edit3, Leaf, WheatOff } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { DIETARY_FLAG_LABELS, type DietaryFlag } from "@/config/rsvp";
import WeddingButton from "@/components/WeddingButton";
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
}

const dietaryOptions: { flag: DietaryFlag; Icon: typeof Leaf }[] = [
  { flag: "vegetarian", Icon: Leaf },
  { flag: "celiac", Icon: WheatOff },
];

const dietaryIconColor: Record<DietaryFlag, string> = {
  vegetarian: "#6f8f4a",
  celiac: "#b38a63",
};

export default function RsvpForm({ form, editing, onCancelEdit, onSubmit }: RsvpFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            {...form.register("firstName")}
            data-testid="input-first-name"
            className={inputClass}
            placeholder="Nome"
          />
        </RsvpInputField>

        <RsvpInputField label="Cognome *" error={form.formState.errors.lastName?.message}>
          <input
            {...form.register("lastName")}
            data-testid="input-last-name"
            className={inputClass}
            placeholder="Cognome"
          />
        </RsvpInputField>
      </div>

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

      <RsvpInputField label="Esigenze alimentari">
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
