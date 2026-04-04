import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle, Edit3 } from "lucide-react";
import { WEDDING } from "@/config/content";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import WeddingCard from "@/components/WeddingCard";
import { getMyRSVP, saveMyRSVP, generateId, RSVPEntry } from "@/lib/storage";

const schema = z.object({
  fullName: z.string().min(2, "Inserisci il tuo nome"),
  attending: z.enum(["yes", "no"]),
  guestCount: z.number().min(1).max(10),
  dietaryNotes: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RSVP() {
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(null);
  const [editing, setEditing] = useState(false);

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
      attending: saved?.attending ? "yes" : "no",
      guestCount: saved?.guestCount ?? 1,
      dietaryNotes: saved?.dietaryNotes ?? "",
      message: saved?.message ?? "",
    },
  });

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
  };

  const showForm = !submitted || editing;

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Conferma la tua presenza" subtitle="RSVP" />
        <p className="text-center text-sm text-[#8B6F5E] mb-8">
          Ti chiediamo di rispondere entro il <strong>{WEDDING.rsvpDeadline}</strong>
        </p>

        {!showForm && submitted && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <WeddingCard className="text-center mb-6">
              <CheckCircle size={36} className="mx-auto text-[#9CAF88] mb-3" />
              <h3 className="font-serif text-xl text-[#4A3728] mb-1">
                Grazie, {submitted.fullName}!
              </h3>
              <p className="text-sm text-[#8B6F5E] mb-4">
                {submitted.attending
                  ? `Non vediamo l'ora di festeggiate con te${submitted.guestCount > 1 ? ` e i tuoi ${submitted.guestCount - 1} ospiti` : ""}!`
                  : "Ci dispiace che non riuscirai a esserci. Saremo con te nel cuore."}
              </p>
              {submitted.message && (
                <div className="bg-[#FAF5EE] rounded-xl p-4 text-left mb-4">
                  <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-1">Il tuo messaggio</p>
                  <p className="text-sm text-[#4A3728] italic">"{submitted.message}"</p>
                </div>
              )}
              <WeddingButton variant="outline" onClick={() => setEditing(true)} data-testid="button-edit-rsvp">
                <Edit3 size={14} className="mr-2" />
                Modifica risposta
              </WeddingButton>
            </WeddingCard>

            <div className="grid grid-cols-2 gap-3 text-center">
              {[
                { label: "Presenza", value: submitted.attending ? "Confermata" : "Non presente" },
                { label: "Ospiti", value: submitted.guestCount },
              ].map((item) => (
                <div key={item.label} className="bg-white/70 border border-[#E8D9C5] rounded-xl p-4">
                  <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="font-serif text-[#4A3728]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs text-[#8B6F5E] uppercase tracking-widest mb-1">
                Nome e cognome *
              </label>
              <input
                {...form.register("fullName")}
                data-testid="input-full-name"
                className="w-full border border-[#D8C9B5] rounded-xl px-4 py-3 text-[#4A3728] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#C2878A]/40 focus:border-[#C2878A] placeholder:text-[#C9B99A] transition-all"
                placeholder="Il tuo nome"
              />
              {form.formState.errors.fullName && (
                <p className="text-xs text-red-400 mt-1">{form.formState.errors.fullName.message}</p>
              )}
            </div>

            {/* Attending */}
            <div>
              <label className="block text-xs text-[#8B6F5E] uppercase tracking-widest mb-2">
                Parteciperai al matrimonio? *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "yes", label: "Sì, ci sarò!" },
                  { value: "no", label: "Purtroppo no" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center justify-center gap-2 border rounded-xl py-3 cursor-pointer transition-all ${
                      form.watch("attending") === opt.value
                        ? "border-[#C2878A] bg-[#C2878A]/10 text-[#4A3728]"
                        : "border-[#D8C9B5] bg-white/70 text-[#8B6F5E] hover:border-[#C9B99A]"
                    }`}
                  >
                    <input
                      type="radio"
                      {...form.register("attending")}
                      value={opt.value}
                      className="sr-only"
                      data-testid={`radio-attending-${opt.value}`}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Guest count */}
            <div>
              <label className="block text-xs text-[#8B6F5E] uppercase tracking-widest mb-1">
                Numero di persone (incluso te) *
              </label>
              <select
                {...form.register("guestCount", { valueAsNumber: true })}
                data-testid="select-guest-count"
                className="w-full border border-[#D8C9B5] rounded-xl px-4 py-3 text-[#4A3728] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#C2878A]/40 focus:border-[#C2878A] transition-all"
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Dietary */}
            <div>
              <label className="block text-xs text-[#8B6F5E] uppercase tracking-widest mb-1">
                Intolleranze o preferenze alimentari
              </label>
              <textarea
                {...form.register("dietaryNotes")}
                data-testid="textarea-dietary-notes"
                rows={2}
                className="w-full border border-[#D8C9B5] rounded-xl px-4 py-3 text-[#4A3728] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#C2878A]/40 focus:border-[#C2878A] placeholder:text-[#C9B99A] transition-all resize-none"
                placeholder="es. vegetariano, celiaco…"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs text-[#8B6F5E] uppercase tracking-widest mb-1">
                Un messaggio per noi
              </label>
              <textarea
                {...form.register("message")}
                data-testid="textarea-message"
                rows={3}
                className="w-full border border-[#D8C9B5] rounded-xl px-4 py-3 text-[#4A3728] bg-white/70 focus:outline-none focus:ring-2 focus:ring-[#C2878A]/40 focus:border-[#C2878A] placeholder:text-[#C9B99A] transition-all resize-none"
                placeholder="Lascia un pensiero per gli sposi…"
              />
            </div>

            <div className="flex gap-3 pt-2">
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
              <WeddingButton
                type="submit"
                fullWidth
                data-testid="button-submit-rsvp"
              >
                {editing ? "Aggiorna risposta" : "Invia risposta"}
              </WeddingButton>
            </div>
          </form>
        )}
      </PageContainer>
    </Layout>
  );
}
