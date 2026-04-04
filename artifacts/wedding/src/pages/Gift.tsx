import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { WEDDING } from "@/config/content";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import WeddingButton from "@/components/WeddingButton";

export default function Gift() {
  const [copied, setCopied] = useState(false);

  const copyIBAN = async () => {
    try {
      await navigator.clipboard.writeText(WEDDING.giftIBAN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Un Pensiero per Noi" subtitle="Regalo" />

        <p className="text-center text-sm text-[#8B6F5E] leading-relaxed mb-10">
          {WEDDING.giftText}
        </p>

        {/* Decorative ring */}
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 rounded-full border-2 border-[#C9B99A] flex items-center justify-center">
            <div className="w-14 h-14 rounded-full border border-[#E8D9C5] flex items-center justify-center">
              <span className="text-2xl">💍</span>
            </div>
          </div>
        </div>

        <WeddingCard className="mb-6">
          <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-3">Intestatario</p>
          <p className="font-serif text-[#4A3728] text-lg mb-5">{WEDDING.giftHolder}</p>

          <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-2">IBAN</p>
          <div className="flex items-center gap-3 bg-[#FAF5EE] border border-[#E8D9C5] rounded-xl px-4 py-3">
            <p
              className="font-mono text-[#4A3728] text-sm flex-1 tracking-wider"
              data-testid="text-iban"
            >
              {WEDDING.giftIBAN}
            </p>
            <button
              onClick={copyIBAN}
              data-testid="button-copy-iban"
              className="text-[#C2878A] hover:text-[#4A3728] transition-colors"
              aria-label="Copia IBAN"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>

          {copied && (
            <p className="text-xs text-[#9CAF88] text-center mt-2 animate-in fade-in duration-300">
              IBAN copiato!
            </p>
          )}

          <p className="text-xs text-[#9CAF88] uppercase tracking-widest mt-5 mb-1">BIC / SWIFT</p>
          <p className="font-mono text-[#4A3728] text-sm">{WEDDING.giftBIC}</p>
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

        <p className="text-center text-xs text-[#C9B99A] mt-8 italic">
          La vostra presenza è il regalo più prezioso.
        </p>
      </PageContainer>
    </Layout>
  );
}
