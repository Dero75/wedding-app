import { Link } from "wouter";
import { Lock } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingButton from "@/components/WeddingButton";
import { getMyRSVP, getContent } from "@/lib/storage";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_CITY,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";

export default function EntrancePass() {
  const rsvp = getMyRSVP();
  const hasConfirmedAttendance = rsvp?.attending === true;
  const c = getContent();

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title={c.passTitle} subtitle="Ingresso" />

        {!hasConfirmedAttendance && (
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
              Conferma la tua presenza
            </h3>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-xs mx-auto">
              Accedi al tuo invito digitale dopo aver confermato la presenza tramite il modulo RSVP.
            </p>

            <Link href="/rsvp">
              <WeddingButton data-testid="button-go-rsvp">Conferma la presenza</WeddingButton>
            </Link>

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
                  {FIXED_BRIDE_NAME} & {FIXED_GROOM_NAME}
                </p>
              </div>
            </div>
          </div>
        )}

        {hasConfirmedAttendance && rsvp && (
          <>
            <div
              className="relative overflow-hidden rounded-3xl shadow-2xl mb-8 min-h-[27rem] flex items-center justify-center"
              data-testid="card-entrance-pass"
              style={{
                background: `var(--p-intro-bg, #3D2B1F)`,
              }}
            >
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background:
                    "radial-gradient(ellipse at center, var(--p-intro-radial, #6B4C3B) 0%, var(--p-intro-bg, #3D2B1F) 70%)",
                }}
              />

              <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6 py-10">
                <div className="flex items-center gap-3" style={{ color: "rgba(201,185,154,0.6)" }}>
                  <div className="h-px w-12 bg-current" />
                  <span className="text-xs tracking-wider uppercase">{FIXED_WEDDING_DATE_LABEL}</span>
                  <div className="h-px w-12 bg-current" />
                </div>

                <div className="text-center">
                  <h2
                    className="font-serif text-5xl sm:text-6xl leading-tight"
                    style={{ color: "hsl(38 50% 97%)" }}
                  >
                    {FIXED_BRIDE_NAME}
                  </h2>
                  <p className="font-serif text-2xl my-2" style={{ color: "rgba(201,185,154,0.8)" }}>
                    &
                  </p>
                  <h2
                    className="font-serif text-5xl sm:text-6xl leading-tight"
                    style={{ color: "hsl(38 50% 97%)" }}
                  >
                    {FIXED_GROOM_NAME}
                  </h2>
                </div>

                <div className="flex items-center gap-3" style={{ color: "rgba(201,185,154,0.6)" }}>
                  <div className="h-px w-12 bg-current" />
                  <span className="text-xs tracking-wider uppercase">{FIXED_WEDDING_CITY}</span>
                  <div className="h-px w-12 bg-current" />
                </div>
              </div>

              <p
                className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] tracking-wider uppercase text-center px-6"
                style={{ color: "rgba(201,185,154,0.75)" }}
              >
                Invito da mostrare all&apos;ingresso di Palazzo Isolani
              </p>
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
