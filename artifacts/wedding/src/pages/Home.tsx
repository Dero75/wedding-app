import { Link } from "wouter";
import { Calendar, MapPin, Heart } from "lucide-react";
import { WEDDING } from "@/config/content";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import WeddingButton from "@/components/WeddingButton";
import { useCountdown } from "@/lib/hooks";
import coupleVenueImg from "@assets/Evento_serale_elegante_nel_cortile_storico_1775302758542.png";

export default function Home() {
  const countdown = useCountdown(WEDDING.dateISO + "T16:00:00");

  return (
    <Layout>
      {/* Hero */}
      <div className="relative min-h-[60vh] flex items-end justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${coupleVenueImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A3728]/80 via-[#4A3728]/30 to-transparent" />
        <div className="relative z-10 text-center pb-12 px-5">
          <p className="text-xs text-[#C9B99A] tracking-[0.3em] uppercase mb-3">
            il matrimonio di
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#FAF5EE] leading-tight">
            {WEDDING.bride} & {WEDDING.groom}
          </h1>
          <div className="flex items-center justify-center gap-3 mt-4 text-[#F0E6D3]/80">
            <Calendar size={14} />
            <span className="text-sm tracking-wider">{WEDDING.date}</span>
            <span className="text-[#C9B99A]">·</span>
            <MapPin size={14} />
            <span className="text-sm tracking-wider">Bologna</span>
          </div>
        </div>
      </div>

      <PageContainer>
        {/* Welcome */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-[#C9B99A]" />
            <Heart size={14} fill="#C2878A" stroke="none" />
            <div className="h-px w-12 bg-[#C9B99A]" />
          </div>
          <h2 className="font-serif text-xl text-[#4A3728] mb-4">{WEDDING.welcomeTitle}</h2>
          <p className="text-[#8B6F5E] leading-relaxed text-sm">{WEDDING.welcomeText}</p>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-4 gap-2 mb-10">
          {[
            { label: "Giorni", value: countdown.days },
            { label: "Ore", value: countdown.hours },
            { label: "Min", value: countdown.minutes },
            { label: "Sec", value: countdown.seconds },
          ].map((unit) => (
            <div
              key={unit.label}
              className="bg-white/70 border border-[#E8D9C5] rounded-xl py-3 text-center shadow-sm"
            >
              <p className="font-serif text-2xl text-[#4A3728]" data-testid={`countdown-${unit.label.toLowerCase()}`}>
                {String(unit.value).padStart(2, "0")}
              </p>
              <p className="text-[10px] text-[#9CAF88] uppercase tracking-widest mt-1">
                {unit.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3">
          <Link href="/rsvp">
            <WeddingButton fullWidth data-testid="button-cta-rsvp">
              Conferma la tua presenza
            </WeddingButton>
          </Link>
          <Link href="/details">
            <WeddingButton variant="outline" fullWidth data-testid="button-cta-details">
              Il programma
            </WeddingButton>
          </Link>
        </div>

        {/* Location card */}
        <div className="mt-10 bg-[#F0E6D3]/50 border border-[#E8D9C5] rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-[#C2878A] mt-0.5 shrink-0" />
            <div>
              <p className="font-serif text-[#4A3728] font-medium">{WEDDING.location}</p>
              <p className="text-sm text-[#8B6F5E] mt-0.5">{WEDDING.locationAddress}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-[#C9B99A] tracking-widest mt-8">{WEDDING.hashtag}</p>
      </PageContainer>
    </Layout>
  );
}
