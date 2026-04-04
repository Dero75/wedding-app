import { Link } from "wouter";
import { Heart, Lock, Star } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import { getMyRSVP, getContent } from "@/lib/storage";
import { FIXED_WEDDING_DATE_LABEL } from "@/config/event";

export default function EntrancePass() {
  const rsvp = getMyRSVP();
  const c = getContent();

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title={c.passTitle} subtitle="Ingresso" />

        {/* ─── Locked / not-attending state ─── */}
        {(!rsvp || !rsvp.attending) && (
          <div className="text-center py-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--muted))",
              }}
            >
              <Lock size={28} className="text-muted-foreground" />
            </div>

            <h3 className="font-serif text-xl mb-3" style={{ color: "hsl(var(--foreground))" }}>
              {rsvp ? "Invito non disponibile" : "Conferma la tua presenza"}
            </h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs mx-auto">
              {rsvp
                ? "Hai indicato che non potrai partecipare. L'invito digitale è disponibile soltanto per gli ospiti confermati."
                : "Accedi al tuo invito digitale dopo aver confermato la presenza tramite il modulo RSVP."}
            </p>

            <Link href="/rsvp">
              <WeddingButton data-testid="button-go-rsvp">
                {rsvp ? "Modifica risposta" : "Conferma la presenza"}
              </WeddingButton>
            </Link>

            {/* Decorative locked card preview */}
            <div
              className="relative mt-10 rounded-3xl overflow-hidden opacity-30 pointer-events-none"
              aria-hidden="true"
            >
              <div
                className="h-48 flex items-center justify-center rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, var(--p-pass-bg-from, #4A3728) 0%, var(--p-pass-bg-to, #6B4C3B) 100%)`,
                }}
              >
                <p className="font-serif text-2xl" style={{ color: "rgba(240,220,180,0.6)" }}>
                  {c.brideName} & {c.groomName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ─── Active pass ─── */}
        {rsvp && rsvp.attending && (
          <>
            <p className="text-center text-sm text-muted-foreground mb-8">{c.passSubtitle}</p>

            {/* Pass card */}
            <div
              className="relative overflow-hidden rounded-3xl shadow-2xl mb-8"
              data-testid="card-entrance-pass"
              style={{
                background: `linear-gradient(135deg, var(--p-pass-bg-from, #4A3728) 0%, var(--p-pass-bg-to, #6B4C3B) 100%)`,
              }}
            >
              {/* Decorative bubbles */}
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 bg-white" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full opacity-10 bg-white" />
              <div className="absolute top-1/2 right-4 w-24 h-24 rounded-full opacity-5 bg-white" />

              <div className="relative z-10 px-7 py-8">
                {/* Header row */}
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-1.5">
                    <Star size={10} style={{ fill: "rgba(201,185,154,0.5)", stroke: "none" }} />
                    <p
                      className="text-[10px] uppercase tracking-[0.28em]"
                      style={{ color: "rgba(201,185,154,0.75)" }}
                    >
                      Invito Digitale
                    </p>
                    <Star size={10} style={{ fill: "rgba(201,185,154,0.5)", stroke: "none" }} />
                  </div>
                  <Heart size={14} style={{ fill: "#C2878A", stroke: "none" }} />
                </div>

                {/* Couple */}
                <div className="text-center mb-7">
                  <p
                    className="text-xs uppercase tracking-[0.22em] mb-2"
                    style={{ color: "rgba(201,185,154,0.65)" }}
                  >
                    al matrimonio di
                  </p>
                  <h2
                    className="font-serif text-3xl leading-snug"
                    style={{ color: "hsl(38 60% 95%)" }}
                  >
                    {c.brideName}
                  </h2>
                  <p className="font-serif text-lg my-1" style={{ color: "rgba(201,185,154,0.7)" }}>
                    &
                  </p>
                  <h2
                    className="font-serif text-3xl leading-snug"
                    style={{ color: "hsl(38 60% 95%)" }}
                  >
                    {c.groomName}
                  </h2>
                </div>

                {/* Ornament */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="h-px flex-1" style={{ background: "rgba(201,185,154,0.25)" }} />
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="rounded-full"
                        style={{
                          width: i === 1 ? 6 : 4,
                          height: i === 1 ? 6 : 4,
                          background: i === 1 ? "rgba(201,185,154,0.7)" : "rgba(201,185,154,0.35)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="h-px flex-1" style={{ background: "rgba(201,185,154,0.25)" }} />
                </div>

                {/* Guest block */}
                <div
                  className="rounded-2xl px-5 py-4 mb-7"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] mb-1"
                    style={{ color: "rgba(201,185,154,0.55)" }}
                  >
                    Ospite
                  </p>
                  <p
                    className="font-serif text-xl leading-snug"
                    style={{ color: "hsl(38 60% 95%)" }}
                  >
                    {rsvp.fullName}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(201,185,154,0.55)" }}>
                    {rsvp.guestCount} {rsvp.guestCount === 1 ? "persona" : "persone"}
                  </p>
                </div>

                {/* Event details grid */}
                <div
                  className="grid grid-cols-2 gap-4 rounded-2xl px-5 py-4 mb-7"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "rgba(201,185,154,0.55)" }}
                    >
                      Data
                    </p>
                    <p className="text-sm" style={{ color: "hsl(38 60% 95%)" }}>
                      {FIXED_WEDDING_DATE_LABEL}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "rgba(201,185,154,0.55)" }}
                    >
                      Ore
                    </p>
                    <p className="text-sm" style={{ color: "hsl(38 60% 95%)" }}>
                      {c.weddingTime}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: "rgba(201,185,154,0.55)" }}
                    >
                      Luogo
                    </p>
                    <p className="text-sm" style={{ color: "hsl(38 60% 95%)" }}>
                      {c.weddingLocation}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(201,185,154,0.55)" }}>
                      {c.weddingAddress}
                    </p>
                  </div>
                </div>

                {/* QR placeholder */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className="rounded-2xl p-3.5 mb-2"
                    style={{ background: "rgba(255,255,255,0.10)" }}
                  >
                    <div className="w-12 h-12 grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-sm"
                          style={{
                            background: [0, 2, 4, 6, 8].includes(i)
                              ? "rgba(201,185,154,0.65)"
                              : "rgba(201,185,154,0.15)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(201,185,154,0.40)" }}
                  >
                    Mostra all'ingresso
                  </p>
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
