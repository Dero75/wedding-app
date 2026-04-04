import { useState } from "react";
import { Trash2, Users, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import WeddingButton from "@/components/WeddingButton";
import {
  getRSVPs,
  deleteRSVP,
  getAdminSettings,
  saveAdminSettings,
  AdminSettings,
  RSVPEntry,
} from "@/lib/storage";

export default function Admin() {
  const [rsvps, setRsvps] = useState<RSVPEntry[]>(() => getRSVPs());
  const [settings, setSettingsState] = useState<AdminSettings>(() => getAdminSettings());

  const attending = rsvps.filter((r) => r.attending);
  const notAttending = rsvps.filter((r) => !r.attending);
  const totalGuests = attending.reduce((acc, r) => acc + r.guestCount, 0);

  const handleDelete = (id: string) => {
    deleteRSVP(id);
    setRsvps(getRSVPs());
  };

  const updateSettings = (partial: Partial<AdminSettings>) => {
    const next = { ...settings, ...partial };
    setSettingsState(next);
    saveAdminSettings(next);
  };

  const refreshRsvps = () => setRsvps(getRSVPs());

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Pannello Admin" subtitle="Gestione" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Users size={18} />, label: "Risposte", value: rsvps.length },
            { icon: <CheckCircle size={18} />, label: "Presenti", value: attending.length },
            { icon: <Users size={18} />, label: "Ospiti tot.", value: totalGuests },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/70 border border-[#E8D9C5] rounded-xl p-3 text-center">
              <div className="text-[#C2878A] flex justify-center mb-1">{stat.icon}</div>
              <p className="font-serif text-xl text-[#4A3728]" data-testid={`stat-${stat.label.toLowerCase().replace(" ", "-")}`}>{stat.value}</p>
              <p className="text-[10px] text-[#9CAF88] uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Style preset */}
        <WeddingCard className="mb-6">
          <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-3">Stile</p>
          <div className="grid grid-cols-3 gap-2">
            {(["ivory", "blush", "dark"] as const).map((preset) => (
              <button
                key={preset}
                data-testid={`button-preset-${preset}`}
                onClick={() => updateSettings({ stylePreset: preset })}
                className={`py-2 rounded-xl border text-sm capitalize transition-all ${
                  settings.stylePreset === preset
                    ? "border-[#C2878A] bg-[#C2878A]/10 text-[#4A3728] font-medium"
                    : "border-[#D8C9B5] text-[#8B6F5E] hover:border-[#C9B99A]"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </WeddingCard>

        {/* Visibility toggles */}
        <WeddingCard className="mb-6">
          <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-3">Visibilità sezioni</p>
          <div className="space-y-3">
            {([
              { key: "showCouplePhoto", label: "Foto coppia" },
              { key: "showGiftSection", label: "Sezione regalo" },
              { key: "showEntrancePass", label: "Invito digitale" },
            ] as const).map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-sm text-[#4A3728]">{item.label}</span>
                <button
                  data-testid={`toggle-${item.key}`}
                  onClick={() => updateSettings({ [item.key]: !settings[item.key] })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    settings[item.key] ? "bg-[#9CAF88]" : "bg-[#D8C9B5]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                      settings[item.key] ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </WeddingCard>

        {/* RSVP list */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-serif text-[#4A3728] text-lg">Lista RSVP</h3>
          <button onClick={refreshRsvps} className="text-[#9CAF88] hover:text-[#8B6F5E] transition-colors" data-testid="button-refresh-rsvps">
            <RefreshCw size={16} />
          </button>
        </div>

        {rsvps.length === 0 ? (
          <p className="text-center text-sm text-[#9CAF88] py-8">Nessuna risposta ancora.</p>
        ) : (
          <div className="space-y-3">
            {rsvps.map((r) => (
              <WeddingCard key={r.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  {r.attending ? (
                    <CheckCircle size={16} className="text-[#9CAF88]" />
                  ) : (
                    <XCircle size={16} className="text-[#C2878A]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-[#4A3728] text-sm" data-testid={`rsvp-name-${r.id}`}>{r.fullName}</p>
                  <p className="text-xs text-[#8B6F5E]">
                    {r.attending ? `Presente · ${r.guestCount} ospiti` : "Non presente"}
                  </p>
                  {r.dietaryNotes && (
                    <p className="text-xs text-[#9CAF88] mt-0.5">{r.dietaryNotes}</p>
                  )}
                  {r.message && (
                    <p className="text-xs text-[#8B6F5E] italic mt-1">"{r.message}"</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(r.id)}
                  data-testid={`button-delete-rsvp-${r.id}`}
                  className="text-[#C9B99A] hover:text-red-400 transition-colors shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </WeddingCard>
            ))}
          </div>
        )}

        {notAttending.length > 0 && (
          <p className="text-center text-xs text-[#9CAF88] mt-4">
            {notAttending.length} {notAttending.length === 1 ? "persona non potrà" : "persone non potranno"} essere presente
          </p>
        )}
      </PageContainer>
    </Layout>
  );
}
