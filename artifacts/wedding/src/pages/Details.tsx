import { Sun, Star, MapPin, Info } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getContent } from "@/lib/storage";
import { FIXED_WEDDING_DATE_LABEL } from "@/config/event";

export default function Details() {
  const c = getContent();

  const ceremonyMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(c.ceremonyAddress)}`;
  const receptionMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(c.receptionAddress)}`;

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Il Nostro Giorno" subtitle="Dettagli" />
        <p className="text-center text-sm text-muted-foreground -mt-4 mb-10">
          {FIXED_WEDDING_DATE_LABEL}
        </p>

        {/* Cerimonia card */}
        <div className="bg-card border border-border rounded-2xl px-6 py-8 text-center mb-4">
          <Sun size={22} className="mx-auto mb-3" style={{ color: "hsl(var(--accent))" }} />
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Cerimonia
          </p>
          <p className="font-serif text-4xl mb-4" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.ceremonyTime}
          </p>
          <div className="h-px w-10 mx-auto mb-4" style={{ background: "hsl(var(--border))" }} />
          <p className="text-sm text-muted-foreground mb-1">{c.ceremonyPlace}</p>
          <p className="text-xs text-muted-foreground mb-6">{c.ceremonyAddress}</p>
          {c.ceremonyNote && (
            <p className="text-xs italic text-muted-foreground mb-6">{c.ceremonyNote}</p>
          )}
          <a
            href={ceremonyMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <MapPin size={13} style={{ color: "hsl(var(--accent))" }} />
            Apri in Maps
          </a>
        </div>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(var(--accent))" }} />
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
        </div>

        {/* Ricevimento card */}
        <div className="bg-card border border-border rounded-2xl px-6 py-8 text-center mb-6">
          <Star size={20} className="mx-auto mb-3" style={{ color: "hsl(var(--accent))" }} />
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
            Ricevimento
          </p>
          <p className="font-serif text-4xl mb-4" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.receptionTime}
          </p>
          <div className="h-px w-10 mx-auto mb-4" style={{ background: "hsl(var(--border))" }} />
          <p className="text-sm text-muted-foreground mb-1">{c.receptionPlace}</p>
          <p className="text-xs text-muted-foreground mb-6">{c.receptionAddress}</p>
          {c.receptionNote && (
            <p className="text-xs italic text-muted-foreground mb-6">{c.receptionNote}</p>
          )}
          <a
            href={receptionMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <MapPin size={13} style={{ color: "hsl(var(--accent))" }} />
            Apri in Maps
          </a>
        </div>

        {/* Footer note */}
        <div className="flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3.5">
          <Info size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--accent))" }} />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Il ricevimento si svolgerà all'aperto. Si consiglia abbigliamento elegante.
          </p>
        </div>
      </PageContainer>
    </Layout>
  );
}
