import { Link } from "wouter";
import Layout from "@/components/Layout";
import WeddingButton from "@/components/WeddingButton";
import { getContent } from "@/lib/storage";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_CITY,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";
import coupleVenueImg from "@assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png";

export default function Home() {
  const c = getContent();

  return (
    <Layout>
      <div className="home-screen flex flex-col overflow-x-hidden overflow-y-auto">
        <div className="home-photo relative flex-shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${coupleVenueImg})` }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(74,55,40,0.60) 0%, rgba(74,55,40,0.20) 50%, transparent 100%)",
            }}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-5 pt-3 pb-4 max-w-lg mx-auto w-full">
          <div className="text-center flex-shrink-0 flex flex-col items-center gap-[0.1rem]">
            <p
              className="home-kicker text-[12.5px] tracking-wider uppercase"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {`${FIXED_WEDDING_DATE_LABEL} 2026`}
            </p>
            <h1
              className="home-title font-serif text-[2.3125rem] leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {FIXED_BRIDE_NAME} & {FIXED_GROOM_NAME}
            </h1>
            <div
              className="home-meta flex items-center justify-center gap-2"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <span className="text-[12.5px] tracking-wider">{FIXED_WEDDING_CITY}</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-start mt-2.5">
            <div className="home-welcome text-center mb-3">
              <div className="flex items-center justify-center gap-3 mb-1.5">
                <div className="h-px w-[9.375rem] bg-border" />
              </div>
              <h2
                className="home-welcome-title font-serif text-[1.3125rem] mb-1 whitespace-pre-line"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {c.welcomeTitle}
              </h2>
              <p
                className="home-welcome-text font-serif text-muted-foreground text-[15px] leading-[1.35] whitespace-pre-line text-center"
              >
                {c.welcomeText}
              </p>
            </div>

            <div className="home-actions flex flex-col gap-2.5 flex-shrink-0 mt-10">
              <div className="w-[70%] mx-auto">
                <Link href="/rsvp">
                  <WeddingButton fullWidth data-testid="button-cta-rsvp">
                    <span className="whitespace-pre-line text-center">{c.ctaRSVP}</span>
                  </WeddingButton>
                </Link>
              </div>
              <div className="w-[70%] mx-auto">
                <Link href="/details">
                  <WeddingButton variant="outline" fullWidth data-testid="button-cta-details">
                    <span className="whitespace-pre-line text-center">{c.ctaDetails}</span>
                  </WeddingButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
