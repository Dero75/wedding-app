import { Link } from "wouter";
import { Heart } from "lucide-react";
import Layout from "@/components/Layout";
import WeddingButton from "@/components/WeddingButton";
import { getContent } from "@/lib/storage";
import { FIXED_BRIDE_NAME, FIXED_GROOM_NAME, FIXED_WEDDING_DATE_CITY_LABEL } from "@/config/event";
import coupleVenueImg from "@assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png";

export default function Home() {
  const c = getContent();

  return (
    <Layout>
      <div
        className="home-screen flex flex-col overflow-hidden"
        style={{
          height: "calc(100vh - 3.5rem)",
          minHeight: "calc(100dvh - 3.5rem)",
        }}
      >
        <div
          className="home-photo relative flex-shrink-0 overflow-hidden"
          style={{ height: "33%" }}
        >
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
          <div className="text-center flex-shrink-0">
            <p
              className="home-kicker text-[10px] tracking-[0.26em] uppercase mb-1"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {c.heroSubtitle}
            </p>
            <h1
              className="home-title font-serif text-[1.85rem] leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {FIXED_BRIDE_NAME} & {FIXED_GROOM_NAME}
            </h1>
            <div
              className="home-meta flex items-center justify-center gap-2 mt-1.5"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              <span className="text-[11px] tracking-wider">{FIXED_WEDDING_DATE_CITY_LABEL}</span>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-between mt-2.5">
            <div className="home-welcome text-center mb-2 overflow-hidden">
              <div className="flex items-center justify-center gap-3 mb-1.5">
                <div className="h-px w-10 bg-border" />
                <Heart size={10} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
                <div className="h-px w-10 bg-border" />
              </div>
              <h2
                className="home-welcome-title font-serif text-[1.05rem] mb-1"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {c.welcomeTitle}
              </h2>
              <p
                className="home-welcome-text text-muted-foreground text-[11px] leading-[1.35] overflow-hidden whitespace-pre-line text-center"
                style={{ maxHeight: "5.2rem" }}
              >
                {c.welcomeText}
              </p>
            </div>

            <div className="home-actions flex flex-col gap-2.5 flex-shrink-0">
              <Link href="/rsvp">
                <WeddingButton fullWidth data-testid="button-cta-rsvp">
                  {c.ctaRSVP}
                </WeddingButton>
              </Link>
              <Link href="/details">
                <WeddingButton variant="outline" fullWidth data-testid="button-cta-details">
                  {c.ctaDetails}
                </WeddingButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
