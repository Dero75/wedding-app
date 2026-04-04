import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Edit3, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import WeddingCard from "@/components/WeddingCard";
import { getMyRSVP, saveMyRSVP, generateId, RSVPEntry, getContent } from "@/lib/storage";

const schema = z.object({
  fullName: z.string().min(2, "Inserisci almeno nome e cognome"),
  attending: z.enum(["yes", "no"], { errorMap: () => ({ message: "Scegli se parteciperai" }) }),
  guestCount: z.number().min(1).max(10),
  dietaryNotes: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function InputField({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-xs mt-1 animate-in slide-in-from-top-1 duration-200" style={{ color: "hsl(var(--destructive))" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function RSVP() {
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(null);
  const [editing, setEditing] = useState(false);
  const c = getContent();

  const saved = getMyRSVP();

  useEffect(() => {
    if (saved && !editing) {
      setSubmitted(saved);
    }
  }, [editing]);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: saved?.fullName ?? "",
      attending: saved ? (saved.attending ? "yes" : "no") : undefined,
      guestCount: saved?.guestCount ?? 1,
      dietaryNotes: saved?.dietaryNotes ?? "",
      message: saved?.message ?? "",
    },
  });

  const attendingValue = form.watch("attending");

  const onSubmit = (data: FormData) => {
    const entry: RSVPEntry = {
      id: saved?.id ?? generateId(),
      fullName: data.fullName,
      attending: data.attending === "yes",
      guestCount: data.guestCount,
      dietaryNotes: data.dietaryNotes ?? "",
      message: data.message ?? "",
      submittedAt: new Date().toISOString(),
    };
    saveMyRSVP(entry);
    setSubmitted(entry);
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showForm = !submitted || editing;

  const inputClass =
    "w-full border border-border rounded-xl px-4 py-3.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent placeholder:text-muted-foreground transition-all text-sm";

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Conferma la tua presenza" subtitle="RSVP" />

        <p className="text-center text-sm text-muted-foreground mb-8">
          Rispondi entro il <strong style={{ color: "hsl(var(--foreground))" }}>{c.rsvpDeadline}</strong>
        </p>

        {/* ─── Confirmation state ─── */}
        {!showForm && submitted && (
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
                  ? `Non vediamo l'ora di festeggiare con te${submitted.guestCount > 1 ? ` e i tuoi ${submitted.guestCount - 1} ospiti` : ""}!`
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
              <WeddingButton
                variant="outline"
                onClick={() => setEditing(true)}
                data-testid="button-edit-rsvp"
              >
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
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                D & D 2025
              </span>
              <Heart size={10} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
            </div>
          </div>
        )}

        {/* ─── Form ─── */}
        {showForm && (
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

            {/* Name */}
            <InputField label="Nome e cognome *" error={form.formState.errors.fullName?.message}>
              <input
                {...form.register("fullName")}
                data-testid="input-full-name"
                className={inputClass}
                placeholder="Il tuo nome e cognome"
              />
            </InputField>

            {/* Attending */}
            <InputField label="Parteciperai al matrimonio? *" error={form.formState.errors.attending?.message}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "yes", label: "Sì, ci sarò!" },
                  { value: "no", label: "Purtroppo no" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-center gap-2 border-2 rounded-xl py-3.5 cursor-pointer transition-all active:scale-[0.97] ${
                      attendingValue === opt.value
                        ? "border-accent bg-background"
                        : "border-border bg-card hover:border-border/60"
                    }`}
                    style={{
                      color:
                        attendingValue === opt.value
                          ? "hsl(var(--accent))"
                          : "hsl(var(--muted-foreground))",
                    }}
                  >
                    <input
                      type="radio"
                      {...form.register("attending")}
                      value={opt.value}
                      className="sr-only"
                      data-testid={`radio-attending-${opt.value}`}
                    />
                    <span className="text-sm font-sans">{opt.label}</span>
                  </label>
                ))}
              </div>
            </InputField>

            {/* Guest count — only if attending */}
            {attendingValue === "yes" && (
              <InputField
                label="Numero di persone (incluso te) *"
                error={form.formState.errors.guestCount?.message}
              >
                <select
                  {...form.register("guestCount", { valueAsNumber: true })}
                  data-testid="select-guest-count"
                  className={inputClass}
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "persona" : "persone"}
                    </option>
                  ))}
                </select>
              </InputField>
            )}

            {/* Dietary */}
            {attendingValue === "yes" && (
              <InputField
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
              </InputField>
            )}

            {/* Message */}
            <InputField label="Un messaggio per noi" hint="Facoltativo">
              <textarea
                {...form.register("message")}
                data-testid="textarea-message"
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Lascia un pensiero per gli sposi…"
              />
            </InputField>

            <div className="flex gap-3 pt-1">
              {editing && (
                <WeddingButton
                  variant="outline"
                  type="button"
                  onClick={() => setEditing(false)}
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
        )}
      </PageContainer>
    </Layout>
  );
}
