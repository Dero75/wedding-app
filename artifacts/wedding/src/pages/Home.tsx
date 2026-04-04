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
      {/* Hero — full viewport height so CTAs are visible without scroll */}
      <div className="relative min-h-[calc(100vh-3.5rem)] flex flex-col justify-end overflow-hidden">
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
            background: `linear-gradient(to top, var(--p-hero-from, rgba(74,55,40,0.92)) 0%, var(--p-hero-mid, rgba(74,55,40,0.35)) 55%, transparent 100%)`,
          }}
        />

        {/* Content overlay */}
        <div className="relative z-10 px-5 pb-10 max-w-lg mx-auto w-full">
          {/* Names */}
          <div className="text-center mb-6">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "hsl(var(--card) / 0.70)" }}
            >
              {c.heroSubtitle}
            </p>
            <h1
              className="font-serif text-4xl sm:text-5xl leading-tight"
              style={{ color: "hsl(var(--card))" }}
            >
              {c.brideName} & {c.groomName}
            </h1>
            <div
              className="flex items-center justify-center gap-3 mt-3"
              style={{ color: "hsl(var(--card) / 0.65)" }}
            >
              <Calendar size={13} />
              <span className="text-sm tracking-wider">{c.weddingDate}</span>
              <span className="opacity-50">·</span>
              <MapPin size={13} />
              <span className="text-sm tracking-wider">Bologna</span>
            </div>
          </div>

          {/* Welcome text */}
          {s.showWelcomeSection && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-10 bg-white/25" />
                <Heart size={11} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
                <div className="h-px w-10 bg-white/25" />
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "hsl(var(--card) / 0.75)" }}
              >
                {c.welcomeText}
              </p>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link href="/rsvp">
              <WeddingButton fullWidth data-testid="button-cta-rsvp">
                {c.ctaRSVP}
              </WeddingButton>
            </Link>
            <Link href="/details">
              <WeddingButton
                variant="outline"
                fullWidth
                data-testid="button-cta-details"
                className="!border-white/30 !text-white hover:!bg-white/10"
              >
                {c.ctaDetails}
              </WeddingButton>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
