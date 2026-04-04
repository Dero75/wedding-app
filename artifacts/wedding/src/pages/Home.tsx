import { Link } from "wouter";
import { Calendar, MapPin, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import WeddingButton from "@/components/WeddingButton";
import { getContent, getAdminSettings } from "@/lib/storage";
import coupleVenueImg from "@assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png";

export default function Home() {
  const c = getContent();
  const s = getAdminSettings();

  return (
    <Layout>
      {/*
        Full available viewport, split between photo and content.
        Nav bar is 3.5rem (56px) — so usable height = 100vh - 3.5rem.
        Hero takes 42%, content takes the remaining 58%.
        Both sections are overflow-hidden so nothing scrolls past the fold.
      */}
      <div
        className="flex flex-col overflow-hidden"
        style={{ height: "calc(100vh - 3.5rem)" }}
      >
        {/* ─── Hero photo (42% of usable height) ─── */}
        <div className="relative flex-shrink-0 flex items-end justify-center overflow-hidden"
          style={{ height: "42%" }}>
          {s.showCouplePhoto ? (
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${coupleVenueImg})` }}
            />
          ) : (
            <div className="absolute inset-0 bg-primary/90" />
          )}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, var(--p-hero-from, rgba(74,55,40,0.88)) 0%, var(--p-hero-mid, rgba(74,55,40,0.30)) 60%, transparent 100%)`,
            }}
          />
          <div className="relative z-10 text-center pb-5 px-5 w-full max-w-lg">
            <p
              className="text-[10px] tracking-[0.28em] uppercase mb-1.5"
              style={{ color: "hsl(var(--card) / 0.75)" }}
            >
              {c.heroSubtitle}
            </p>
            <h1
              className="font-serif text-[2rem] leading-tight"
              style={{ color: "hsl(var(--card))" }}
            >
              {c.brideName} & {c.groomName}
            </h1>
            <div
              className="flex items-center justify-center gap-2 mt-2"
              style={{ color: "hsl(var(--card) / 0.70)" }}
            >
              <Calendar size={11} />
              <span className="text-xs tracking-wider">{c.weddingDate}</span>
              <span className="opacity-50">·</span>
              <MapPin size={11} />
              <span className="text-xs tracking-wider">Bologna</span>
            </div>
          </div>
        </div>

        {/* ─── Content (58% of usable height) ─── */}
        <div className="flex-1 flex flex-col justify-between px-5 py-5 max-w-lg mx-auto w-full overflow-hidden">
          {/* Welcome */}
          {s.showWelcomeSection && (
            <div className="text-center mb-3">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-px w-10 bg-border" />
                <Heart size={10} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
                <div className="h-px w-10 bg-border" />
              </div>
              <h2
                className="font-serif text-xl mb-1.5"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {c.welcomeTitle}
              </h2>
              <p className="text-muted-foreground text-xs leading-relaxed">{c.welcomeText}</p>
            </div>
          )}

          {/* CTAs — always at the bottom of the content area */}
          <div className="flex flex-col gap-2.5">
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
    </Layout>
  );
}
