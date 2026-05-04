import { useEffect, useState } from "react";
import { MapPin, Copy, Check, X } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { getContent } from "@/lib/storage";
import { FIXED_WEDDING_DATE_LABEL } from "@/config/event";

export default function Details() {
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false);
  const [ibanCopied, setIbanCopied] = useState(false);
  const c = getContent();

  const receptionMapsUrl = `https://maps.google.com/?q=${encodeURIComponent(c.receptionAddress)}`;

  useEffect(() => {
    if (!isGiftModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsGiftModalOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGiftModalOpen]);

  const copyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(c.giftIBAN);
      setIbanCopied(true);
      setTimeout(() => setIbanCopied(false), 2200);
    } catch {
      // no-op
    }
  };

  return (
    <Layout>
      <PageContainer>
        <div className="[&_h2]:text-[2.4rem] sm:[&_h2]:text-[2.7rem]">
          <SectionTitle title="Deborah & Davide" />
        </div>
        <p className="text-center text-sm text-muted-foreground -mt-4 mb-10">
          {FIXED_WEDDING_DATE_LABEL}
        </p>

        {/* Cerimonia card */}
        <div className="bg-card border border-border rounded-2xl px-5 py-6 text-center mb-4">
          <p
            className="font-serif text-[16px] uppercase tracking-wider mb-2.5"
            style={{ color: "hsl(var(--accent))" }}
          >
            Cerimonia
          </p>
          <p className="font-serif text-3xl mb-3.5" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.ceremonyTime}
          </p>
          <div className="h-px w-9 mx-auto mb-3.5" style={{ background: "hsl(var(--border))" }} />
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-1 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.ceremonyPlace}
          </p>
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-5 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.ceremonyAddress}
          </p>
          {c.ceremonyNote && (
            <p className="text-[11px] text-muted-foreground mb-5 whitespace-pre-line text-center">
              {c.ceremonyNote}
            </p>
          )}
        </div>

        {/* Divider ornament */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(var(--accent))" }} />
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
        </div>

        {/* Ricevimento card */}
        <div className="bg-card border border-border rounded-2xl px-5 py-6 text-center mb-4">
          <p
            className="font-serif text-[16px] uppercase tracking-wider mb-2.5"
            style={{ color: "hsl(var(--accent))" }}
          >
            Ricevimento
          </p>
          <p className="font-serif text-3xl mb-3.5" style={{ color: "hsl(var(--foreground))" }}>
            ore {c.receptionTime}
          </p>
          <div className="h-px w-9 mx-auto mb-3.5" style={{ background: "hsl(var(--border))" }} />
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-1 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.receptionPlace}
          </p>
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-5 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.receptionAddress}
          </p>
          {c.receptionNote && (
            <p className="text-[11px] text-muted-foreground mb-5 whitespace-pre-line text-center">
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
            Apri mappa
          </a>
        </div>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(var(--accent))" }} />
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
        </div>

        <div className="bg-card border border-border rounded-2xl px-5 py-6 text-center mb-4">
          <p
            className="font-serif text-[16px] uppercase tracking-wider mb-3"
            style={{ color: "hsl(var(--accent))" }}
          >
            {c.outfitTitle}
          </p>

          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className="h-6 w-6 rounded-sm border border-border"
              style={{ background: "#f0dfc9" }}
              aria-label="Palette outfit 1"
            />
            <span
              className="h-6 w-6 rounded-sm border border-border"
              style={{ background: "#c49470" }}
              aria-label="Palette outfit 2"
            />
            <span
              className="h-6 w-6 rounded-sm border border-border"
              style={{ background: "#a5583a" }}
              aria-label="Palette outfit 3"
            />
            <span
              className="h-6 w-6 rounded-sm border border-border"
              style={{ background: "#96aa86" }}
              aria-label="Palette outfit 4"
            />
          </div>

          <p
            className="font-serif text-[15.5px] leading-relaxed whitespace-pre-line max-w-[21rem] mx-auto"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.outfitText}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
          <div className="w-1.5 h-1.5 rotate-45" style={{ background: "hsl(var(--accent))" }} />
          <div className="h-px w-16" style={{ background: "hsl(var(--border))" }} />
        </div>

        <div
          className="bg-card border border-border rounded-2xl px-5 py-6 text-center cursor-pointer"
          onClick={() => setIsGiftModalOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setIsGiftModalOpen(true);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Apri dettagli regalo"
        >
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-3 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.detailsGiftTitle}
          </p>
          <p
            className="font-serif text-[15.5px] leading-relaxed mb-3 whitespace-pre-line"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {c.detailsGiftSubtitle}
          </p>
          <button
            type="button"
            onClick={() => setIsGiftModalOpen(true)}
            className="inline-flex items-center gap-2 border border-border rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wider text-foreground hover:text-accent hover:border-muted-foreground/40 transition-all"
          >
            <span className="whitespace-pre-line text-center">{c.detailsGiftButtonLabel}</span>
          </button>
        </div>

        {isGiftModalOpen && (
          <div
            className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm px-5 flex items-center justify-center"
            onClick={() => setIsGiftModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Dettagli contributo IBAN"
            >
              <div className="flex items-start justify-end mb-2">
                <button
                  type="button"
                  onClick={() => setIsGiftModalOpen(false)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Chiudi finestra"
                >
                  <X size={16} />
                </button>
              </div>

              <h3
                className="font-serif text-[1.85rem] leading-tight text-center mb-5"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {c.giftTitle}
              </h3>

              <div className="space-y-4 text-center">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    Intestatario conto
                  </p>
                  <p className="font-sans text-base whitespace-pre-line" style={{ color: "hsl(var(--foreground))" }}>
                    {c.giftHolder}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    IBAN
                  </p>
                  <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5">
                    <p
                      className="font-sans text-sm tracking-wider flex-1 whitespace-pre-line"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {c.giftIBAN}
                    </p>
                    <button
                      type="button"
                      onClick={copyIBAN}
                      className="inline-flex items-center justify-center rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/40 transition-colors"
                    >
                      {ibanCopied ? (
                        <>
                          <Check size={13} className="mr-1" /> Copiato
                        </>
                      ) : (
                        <>
                          <Copy size={13} className="mr-1" /> Copia
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
