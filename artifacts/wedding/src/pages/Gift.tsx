import { useState } from "react";
import { Copy, Check, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import WeddingButton from "@/components/WeddingButton";
import { getContent } from "@/lib/storage";

export default function Gift() {
  const [copied, setCopied] = useState(false);
  const c = getContent();

  const copyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(c.giftIBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title={c.giftTitle} subtitle="Regalo" />

        <p className="text-center text-sm text-muted-foreground leading-relaxed mb-10">
          {c.giftText}
        </p>

        {/* Ornament */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div
              className="w-14 h-14 rounded-full border flex items-center justify-center"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              <Heart size={20} style={{ fill: "hsl(var(--accent))", stroke: "none" }} />
            </div>
          </div>
        </div>

        <WeddingCard className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
            Intestatario
          </p>
          <p className="font-serif text-lg mb-5" style={{ color: "hsl(var(--foreground))" }}>
            {c.giftHolder}
          </p>

          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">IBAN</p>
          <div className="flex items-center gap-3 bg-background border border-border rounded-xl px-4 py-3">
            <p
              className="font-mono text-sm flex-1 tracking-wider"
              style={{ color: "hsl(var(--foreground))" }}
              data-testid="text-iban"
            >
              {c.giftIBAN}
            </p>
            <button
              onClick={copyIBAN}
              data-testid="button-copy-iban"
              className="transition-colors"
              style={{ color: copied ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))" }}
              aria-label="Copia IBAN"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {copied && (
            <p
              className="text-xs text-center mt-2 animate-in fade-in duration-300"
              style={{ color: "hsl(var(--accent))" }}
            >
              IBAN copiato!
            </p>
          )}

          <p className="text-xs text-muted-foreground uppercase tracking-widest mt-5 mb-1">
            BIC / SWIFT
          </p>
          <p className="font-mono text-sm" style={{ color: "hsl(var(--foreground))" }}>
            {c.giftBIC}
          </p>
        </WeddingCard>

        <WeddingButton
          onClick={copyIBAN}
          fullWidth
          variant="outline"
          data-testid="button-copy-iban-main"
        >
          {copied ? (
            <>
              <Check size={14} className="mr-2" /> Copiato!
            </>
          ) : (
            <>
              <Copy size={14} className="mr-2" /> Copia IBAN
            </>
          )}
        </WeddingButton>

        <p className="text-center text-xs text-muted-foreground mt-8 italic">
          La vostra presenza è il regalo più prezioso.
        </p>
      </PageContainer>
    </Layout>
  );
}
