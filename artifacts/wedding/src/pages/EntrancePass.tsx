import { Link } from "wouter";
import { Heart, QrCode } from "lucide-react";
import { WEDDING } from "@/config/content";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import { getMyRSVP } from "@/lib/storage";

export default function EntrancePass() {
  const rsvp = getMyRSVP();

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Il Tuo Invito" subtitle="Ingresso" />

        {!rsvp || !rsvp.attending ? (
          <div className="text-center py-10">
            <p className="text-[#8B6F5E] mb-6">
              {rsvp
                ? "Non hai confermato la tua presenza. L'invito digitale è disponibile solo per gli ospiti che parteciperanno."
                : "Prima di accedere al tuo invito, conferma la tua presenza tramite il modulo RSVP."}
            </p>
            <Link href="/rsvp">
              <WeddingButton data-testid="button-go-rsvp">Conferma la presenza</WeddingButton>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-center text-sm text-[#8B6F5E] mb-8">
              {WEDDING.passSubtitle}
            </p>

            {/* Pass Card */}
            <div
              className="relative overflow-hidden rounded-3xl shadow-xl border border-[#D8C9B5] mb-8"
              data-testid="card-entrance-pass"
              style={{
                background: "linear-gradient(135deg, #4A3728 0%, #6B4C3B 50%, #4A3728 100%)",
              }}
            >
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#C9B99A]/10" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#C9B99A]/10" />

              <div className="relative z-10 px-7 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs text-[#C9B99A]/80 uppercase tracking-[0.25em]">Invito Digitale</p>
                  <Heart size={16} fill="#C2878A" stroke="none" />
                </div>

                {/* Names */}
                <div className="text-center mb-6">
                  <p className="text-[#C9B99A]/70 text-xs uppercase tracking-widest mb-2">
                    al matrimonio di
                  </p>
                  <h2 className="font-serif text-3xl text-[#FAF5EE] leading-tight">
                    {WEDDING.bride} & {WEDDING.groom}
                  </h2>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-[#C9B99A]/30" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9B99A]/60" />
                  <div className="h-px flex-1 bg-[#C9B99A]/30" />
                </div>

                {/* Guest info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-[#C9B99A]/60 text-xs uppercase tracking-widest mb-1">Ospite</p>
                    <p className="text-[#FAF5EE] font-serif text-lg leading-snug">{rsvp.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#C9B99A]/60 text-xs uppercase tracking-widest mb-1">Ospiti</p>
                    <p className="text-[#FAF5EE] font-serif text-lg">{rsvp.guestCount}</p>
                  </div>
                </div>

                {/* Event details */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-5 py-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[#C9B99A]/60 text-xs uppercase tracking-widest mb-1">Data</p>
                      <p className="text-[#FAF5EE] text-sm">{WEDDING.date}</p>
                    </div>
                    <div>
                      <p className="text-[#C9B99A]/60 text-xs uppercase tracking-widest mb-1">Ore</p>
                      <p className="text-[#FAF5EE] text-sm">{WEDDING.time}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[#C9B99A]/60 text-xs uppercase tracking-widest mb-1">Luogo</p>
                      <p className="text-[#FAF5EE] text-sm">{WEDDING.location}</p>
                      <p className="text-[#C9B99A]/70 text-xs">{WEDDING.locationAddress}</p>
                    </div>
                  </div>
                </div>

                {/* QR placeholder */}
                <div className="flex flex-col items-center">
                  <div className="bg-white/10 rounded-xl p-3 mb-2">
                    <QrCode size={48} className="text-[#C9B99A]/70" />
                  </div>
                  <p className="text-[#C9B99A]/50 text-xs tracking-widest">Mostra all'ingresso</p>
                </div>
              </div>
            </div>

            <Link href="/rsvp">
              <WeddingButton variant="ghost" fullWidth data-testid="button-update-pass-rsvp">
                Modifica le tue informazioni
              </WeddingButton>
            </Link>
          </>
        )}
      </PageContainer>
    </Layout>
  );
}
