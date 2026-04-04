import { Link } from "wouter";
import { Calendar, MapPin, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import WeddingButton from "@/components/WeddingButton";
import { getContent, getAdminSettings } from "@/lib/storage";
import coupleVenueImg from "@assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png";

export default function Home() {
  const c = getContent();
  const s = getAdminSettings();

  return (
    <Layout>
      {/* Hero — same 60vh as before */}
      <div className="relative min-h-[60vh] flex items-end justify-center overflow-hidden">
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
            background: `linear-gradient(to top, var(--p-hero-from, rgba(74,55,40,0.85)) 0%, var(--p-hero-mid, rgba(74,55,40,0.30)) 50%, transparent 100%)`,
          }}
        />
        <div className="relative z-10 text-center pb-12 px-5">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "hsl(var(--card) / 0.75)" }}
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
            className="flex items-center justify-center gap-3 mt-4"
            style={{ color: "hsl(var(--card) / 0.75)" }}
          >
            <Calendar size={14} />
            <span className="text-sm tracking-wider">{c.weddingDate}</span>
            <span className="opacity-60">·</span>
            <MapPin size={14} />
            <span className="text-sm tracking-wider">Bologna</span>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Welcome section */}
        {s.showWelcomeSection && (
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-12 bg-border" />
              <Heart size={12} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
              <div className="h-px w-12 bg-border" />
            </div>
            <h2 className="font-serif text-xl mb-4" style={{ color: "hsl(var(--foreground))" }}>
              {c.welcomeTitle}
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{c.welcomeText}</p>
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
            <WeddingButton variant="outline" fullWidth data-testid="button-cta-details">
              {c.ctaDetails}
            </WeddingButton>
          </Link>
        </div>
      </PageContainer>
    </Layout>
  );
}
