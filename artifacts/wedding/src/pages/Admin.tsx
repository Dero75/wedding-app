import { useState } from "react";
import {
  Trash2, Users, CheckCircle, XCircle, RefreshCw, Settings,
  FileText, Eye, Palette, Key, ChevronDown, ChevronUp,
} from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import WeddingButton from "@/components/WeddingButton";
import Toggle from "@/components/Toggle";
import AdminPinGate from "@/components/AdminPinGate";
import {
  getRSVPs,
  deleteRSVP,
  getAdminSettings,
  saveAdminSettings,
  AdminSettings,
  RSVPEntry,
  getContent,
  saveContent,
  EditableContent,
  getAdminPIN,
  setAdminPIN,
  isAdminSessionUnlocked,
} from "@/lib/storage";

// ─── Section accordion ───────────────────────────────────────────────────────
function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <WeddingCard className="mb-4 !p-0 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: "hsl(var(--accent))" }}>{icon}</span>
          <span className="font-sans text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>
            {title}
          </span>
        </div>
        <span style={{ color: "hsl(var(--muted-foreground))" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>
      {open && <div className="px-5 pb-5 border-t border-border">{children}</div>}
    </WeddingCard>
  );
}

// ─── Text field helper ───────────────────────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  const shared =
    "w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent transition-all bg-background text-foreground placeholder:text-muted-foreground";
  return (
    <div className="mt-4">
      <label className="block text-xs uppercase tracking-widest mb-1.5 text-muted-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={shared}
        />
      )}
    </div>
  );
}

// ─── Main Admin page ─────────────────────────────────────────────────────────
export default function Admin() {
  const [unlocked, setUnlocked] = useState(() => isAdminSessionUnlocked());
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [settings, setSettingsState] = useState<AdminSettings>(() => getAdminSettings());
  const [content, setContentState] = useState<EditableContent>(() => getContent());
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinMsg, setPinMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (!unlocked) {
    return <AdminPinGate onUnlocked={() => setUnlocked(true)} />;
  }

  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((acc, r) => acc + r.guestCount, 0);

  const updateSettings = (partial: Partial<AdminSettings>) => {
    const next = { ...settings, ...partial };
    setSettingsState(next);
    saveAdminSettings(next);
    window.dispatchEvent(new Event("preset-changed"));
    document.documentElement.dataset.preset = next.stylePreset;
  };

  const updateContent = (partial: Partial<EditableContent>) => {
    const next = { ...content, ...partial };
    setContentState(next);
    saveContent(next);
  };

  const handleChangePin = () => {
    if (newPin.length < 4 || !/^\d{4,8}$/.test(newPin)) {
      setPinMsg({ ok: false, text: "Il PIN deve essere di 4–8 cifre" });
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg({ ok: false, text: "I due PIN non coincidono" });
      return;
    }
    setAdminPIN(newPin);
    setNewPin("");
    setConfirmPin("");
    setPinMsg({ ok: true, text: "PIN aggiornato con successo!" });
    setTimeout(() => setPinMsg(null), 3000);
  };

  const PRESET_LABELS: Record<AdminSettings["stylePreset"], string> = {
    ivory: "Avorio Classico",
    blush: "Rosa Romantico",
    dark: "Serale Elegante",
  };

  const PRESET_COLORS: Record<AdminSettings["stylePreset"], string> = {
    ivory: "#FAF5EE",
    blush: "#FDF0F2",
    dark: "#1C1410",
  };

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Pannello Admin" subtitle="Gestione" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: <Users size={16} />, label: "Risposte", value: rsvps.length },
            { icon: <CheckCircle size={16} />, label: "Presenti", value: attending.length },
            { icon: <Users size={16} />, label: "Ospiti", value: totalGuests },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card border border-border rounded-xl p-3 text-center"
            >
              <div className="flex justify-center mb-1" style={{ color: "hsl(var(--accent))" }}>
                {stat.icon}
              </div>
              <p className="font-serif text-xl" style={{ color: "hsl(var(--foreground))" }}>
                {stat.value}
              </p>
              <p
                className="text-[10px] uppercase tracking-widest"
                style={{ color: "hsl(var(--muted-foreground))" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ─── Style presets ─── */}
        <Section icon={<Palette size={16} />} title="Stile dell'app">
          <p className="text-xs mt-4 mb-3 uppercase tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>
            Scegli il tema visivo
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(["ivory", "blush", "dark"] as const).map((preset) => (
              <button
                key={preset}
                data-testid={`button-preset-${preset}`}
                onClick={() => updateSettings({ stylePreset: preset })}
                className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  settings.stylePreset === preset
                    ? "border-accent"
                    : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full shadow-inner border border-border/60"
                  style={{ background: PRESET_COLORS[preset] }}
                />
                <span
                  className="text-[10px] text-center leading-tight"
                  style={{
                    color:
                      settings.stylePreset === preset
                        ? "hsl(var(--accent))"
                        : "hsl(var(--muted-foreground))",
                    fontWeight: settings.stylePreset === preset ? 600 : 400,
                  }}
                >
                  {PRESET_LABELS[preset]}
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── Visibility ─── */}
        <Section icon={<Eye size={16} />} title="Visibilità sezioni">
          <div className="space-y-4 mt-4">
            {(
              [
                { key: "showCountdown", label: "Conto alla rovescia" },
                { key: "showWelcomeSection", label: "Sezione benvenuto" },
                { key: "showCouplePhoto", label: "Foto coppia (hero)" },
                { key: "showGiftSection", label: "Sezione regalo" },
                { key: "showEntrancePass", label: "Invito digitale" },
              ] as const
            ).map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>
                  {item.label}
                </span>
                <Toggle
                  checked={settings[item.key]}
                  onChange={(v) => updateSettings({ [item.key]: v })}
                  data-testid={`toggle-${item.key}`}
                />
              </div>
            ))}
          </div>
        </Section>

        {/* ─── Content editor ─── */}
        <Section icon={<FileText size={16} />} title="Testi e contenuti">
          <div className="mt-2">
            <p className="text-xs mt-4 mb-1 font-sans font-medium uppercase tracking-widest" style={{ color: "hsl(var(--foreground))" }}>
              Home
            </p>
            <Field label="Nome sposa" value={content.brideName} onChange={(v) => updateContent({ brideName: v })} />
            <Field label="Nome sposo" value={content.groomName} onChange={(v) => updateContent({ groomName: v })} />
            <Field label="Data cerimonia (testo)" value={content.weddingDate} onChange={(v) => updateContent({ weddingDate: v })} />
            <Field label="Data cerimonia (ISO, es. 2025-09-14)" value={content.weddingDateISO} onChange={(v) => updateContent({ weddingDateISO: v })} />
            <Field label="Ora cerimonia" value={content.weddingTime} onChange={(v) => updateContent({ weddingTime: v })} />
            <Field label="Luogo" value={content.weddingLocation} onChange={(v) => updateContent({ weddingLocation: v })} />
            <Field label="Indirizzo" value={content.weddingAddress} onChange={(v) => updateContent({ weddingAddress: v })} />
            <Field label="Hashtag" value={content.hashtag} onChange={(v) => updateContent({ hashtag: v })} />
            <Field label="Titolo benvenuto" value={content.welcomeTitle} onChange={(v) => updateContent({ welcomeTitle: v })} />
            <Field label="Testo benvenuto" value={content.welcomeText} onChange={(v) => updateContent({ welcomeText: v })} multiline />
            <Field label="Bottone RSVP" value={content.ctaRSVP} onChange={(v) => updateContent({ ctaRSVP: v })} />
            <Field label="Bottone programma" value={content.ctaDetails} onChange={(v) => updateContent({ ctaDetails: v })} />
            <Field label="Scadenza RSVP" value={content.rsvpDeadline} onChange={(v) => updateContent({ rsvpDeadline: v })} />

            <p className="text-xs mt-6 mb-1 font-sans font-medium uppercase tracking-widest" style={{ color: "hsl(var(--foreground))" }}>
              Programma
            </p>
            <Field label="Luogo cerimonia" value={content.ceremonyPlace} onChange={(v) => updateContent({ ceremonyPlace: v })} />
            <Field label="Ora cerimonia" value={content.ceremonyTime} onChange={(v) => updateContent({ ceremonyTime: v })} />
            <Field label="Note cerimonia" value={content.ceremonyNote} onChange={(v) => updateContent({ ceremonyNote: v })} />
            <Field label="Luogo ricevimento" value={content.receptionPlace} onChange={(v) => updateContent({ receptionPlace: v })} />
            <Field label="Ora ricevimento" value={content.receptionTime} onChange={(v) => updateContent({ receptionTime: v })} />
            <Field label="Note ricevimento" value={content.receptionNote} onChange={(v) => updateContent({ receptionNote: v })} />

            <p className="text-xs mt-6 mb-1 font-sans font-medium uppercase tracking-widest" style={{ color: "hsl(var(--foreground))" }}>
              Regalo
            </p>
            <Field label="Titolo sezione" value={content.giftTitle} onChange={(v) => updateContent({ giftTitle: v })} />
            <Field label="Testo" value={content.giftText} onChange={(v) => updateContent({ giftText: v })} multiline />
            <Field label="IBAN" value={content.giftIBAN} onChange={(v) => updateContent({ giftIBAN: v })} />
            <Field label="BIC / SWIFT" value={content.giftBIC} onChange={(v) => updateContent({ giftBIC: v })} />
            <Field label="Intestatario" value={content.giftHolder} onChange={(v) => updateContent({ giftHolder: v })} />

            <p className="text-xs mt-6 mb-1 font-sans font-medium uppercase tracking-widest" style={{ color: "hsl(var(--foreground))" }}>
              Invito digitale
            </p>
            <Field label="Titolo pass" value={content.passTitle} onChange={(v) => updateContent({ passTitle: v })} />
            <Field label="Sottotitolo pass" value={content.passSubtitle} onChange={(v) => updateContent({ passSubtitle: v })} />
          </div>
        </Section>

        {/* ─── PIN change ─── */}
        <Section icon={<Key size={16} />} title="Modifica PIN">
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5 text-muted-foreground">
                Nuovo PIN (4–8 cifre)
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={8}
                data-testid="input-new-pin"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="••••"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-1.5 text-muted-foreground">
                Conferma PIN
              </label>
              <input
                type="password"
                inputMode="numeric"
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                maxLength={8}
                data-testid="input-confirm-pin"
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent transition-all bg-background text-foreground placeholder:text-muted-foreground"
                placeholder="••••"
              />
            </div>

            {pinMsg && (
              <p
                className="text-xs"
                style={{ color: pinMsg.ok ? "hsl(var(--accent))" : "hsl(var(--destructive))" }}
              >
                {pinMsg.text}
              </p>
            )}

            <WeddingButton
              variant="outline"
              fullWidth
              onClick={handleChangePin}
              data-testid="button-save-pin"
            >
              Salva nuovo PIN
            </WeddingButton>
          </div>
        </Section>

        {/* ─── RSVP list ─── */}
        <Section icon={<Users size={16} />} title={`Lista RSVP (${rsvps.length})`}>
          <div className="flex items-center justify-between mt-4 mb-3">
            <span className="text-xs text-muted-foreground">
              {attending.length} presenti · {totalGuests} ospiti totali
            </span>
            <button
              onClick={() => setRsvps(getRSVPs())}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-refresh-rsvps"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          {rsvps.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-6">
              Nessuna risposta ancora.
            </p>
          ) : (
            <div className="space-y-2">
              {rsvps.map((r) => (
                <div
                  key={r.id}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border bg-background/50"
                >
                  <div className="mt-0.5 shrink-0">
                    {r.attending ? (
                      <CheckCircle size={15} style={{ color: "hsl(var(--accent))" }} />
                    ) : (
                      <XCircle size={15} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-serif text-sm leading-snug"
                      style={{ color: "hsl(var(--foreground))" }}
                      data-testid={`rsvp-name-${r.id}`}
                    >
                      {r.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.attending
                        ? `Presente · ${r.guestCount} ${r.guestCount === 1 ? "persona" : "persone"}`
                        : "Non presente"}
                    </p>
                    {r.dietaryNotes && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{r.dietaryNotes}</p>
                    )}
                    {r.message && (
                      <p className="text-xs text-muted-foreground italic mt-1">"{r.message}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      deleteRSVP(r.id);
                      setRsvps(getRSVPs());
                    }}
                    data-testid={`button-delete-rsvp-${r.id}`}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {notAttending.length > 0 && (
            <p className="text-center text-xs text-muted-foreground mt-3">
              {notAttending.length}{" "}
              {notAttending.length === 1 ? "persona non potrà" : "persone non potranno"} essere
              presente
            </p>
          )}
        </Section>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              sessionStorage.removeItem("wedding_admin_unlocked");
              setUnlocked(false);
            }}
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Esci dal pannello admin
          </button>
        </div>
      </PageContainer>
    </Layout>
  );
}
