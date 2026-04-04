import { Sun, Star, MapPin } from "lucide-react";
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
        <div className="bg-card border border-border rounded-2xl px-5 py-6 text-center mb-3.5">
          <Sun size={18} className="mx-auto mb-2.5" style={{ color: "hsl(var(--accent))" }} />
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2.5">
            Cerimonia
          </p>
          <p className="font-serif text-3xl mb-3.5" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.ceremonyTime}
          </p>
          <div className="h-px w-9 mx-auto mb-3.5" style={{ background: "hsl(var(--border))" }} />
          <p className="text-[0.95rem] text-muted-foreground mb-1">{c.ceremonyPlace}</p>
          <p className="text-[11px] text-muted-foreground mb-5">{c.ceremonyAddress}</p>
          {c.ceremonyNote && (
            <p className="text-[11px] italic text-muted-foreground mb-5 whitespace-pre-line text-center">
              {c.ceremonyNote}
            </p>
          )}
          <a
            href={ceremonyMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <MapPin size={12} style={{ color: "hsl(var(--accent))" }} />
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
        <div className="bg-card border border-border rounded-2xl px-5 py-6 text-center mb-6">
          <Star size={16} className="mx-auto mb-2.5" style={{ color: "hsl(var(--accent))" }} />
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-2.5">
            Ricevimento
          </p>
          <p className="font-serif text-3xl mb-3.5" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.receptionTime}
          </p>
          <div className="h-px w-9 mx-auto mb-3.5" style={{ background: "hsl(var(--border))" }} />
          <p className="text-[0.95rem] text-muted-foreground mb-1">{c.receptionPlace}</p>
          <p className="text-[11px] text-muted-foreground mb-5">{c.receptionAddress}</p>
          {c.receptionNote && (
            <p className="text-[11px] italic text-muted-foreground mb-5 whitespace-pre-line text-center">
              {c.receptionNote}
            </p>
          )}
          <a
            href={receptionMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-2 text-[11px] text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-all"
          >
            <MapPin size={12} style={{ color: "hsl(var(--accent))" }} />
            Apri in Maps
          </a>
        </div>

      </PageContainer>
    </Layout>
  );
}
