import { Clock, MapPin } from "lucide-react";
import { WEDDING } from "@/config/content";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import entranceImg from "@assets/Ingresso_elegante_con_ospiti_al_tramonto_1775302758542.png";
import receptionImg from "@assets/Ricevimento_serale_sotto_il_portico_1775302758542.png";

const PROGRAM = [
  { time: "15:30", label: "Accoglienza degli ospiti", desc: "Vi aspettiamo all'ingresso della villa" },
  { time: "16:00", label: "Cerimonia", desc: "Cappella della Villa Borgonuovo" },
  { time: "17:30", label: "Aperitivo", desc: "Nel giardino all'italiana" },
  { time: "18:30", label: "Ricevimento", desc: "Sotto il portico storico" },
  { time: "20:00", label: "Cena", desc: "Servita nel cortile interno" },
  { time: "23:00", label: "Ballo e festeggiamenti", desc: "Fino a tarda notte" },
];

export default function Details() {
  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Il Programma" subtitle="Tutto il giorno" />

        {/* Timeline */}
        <div className="relative mb-12">
          <div className="absolute left-[2.25rem] top-0 bottom-0 w-px bg-[#E8D9C5]" />
          <div className="space-y-6">
            {PROGRAM.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-18 shrink-0 text-right">
                  <span className="inline-block bg-[#FAF5EE] border border-[#D8C9B5] rounded-lg px-2 py-1 text-xs text-[#8B6F5E] font-mono tracking-wider">
                    {item.time}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute -left-[1.6rem] top-2 w-3 h-3 rounded-full border-2 border-[#C2878A] bg-[#FAF5EE]" />
                  <div className="pl-4">
                    <p className="font-serif text-[#4A3728] text-base leading-snug">{item.label}</p>
                    <p className="text-sm text-[#8B6F5E] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ceremony card */}
        <WeddingCard className="mb-5">
          <div className="relative h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
            <img src={entranceImg} alt="Ingresso cerimonia" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-3 left-4 text-white font-serif text-lg">{WEDDING.ceremony.title}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#8B6F5E]">
              <Clock size={14} className="text-[#C2878A]" />
              <span>{WEDDING.ceremony.time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#8B6F5E]">
              <MapPin size={14} className="text-[#C2878A] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#4A3728] font-medium">{WEDDING.ceremony.place}</p>
                <p className="text-xs">{WEDDING.ceremony.address}</p>
              </div>
            </div>
            <p className="text-xs text-[#9CAF88] italic mt-2">{WEDDING.ceremony.note}</p>
          </div>
        </WeddingCard>

        {/* Reception card */}
        <WeddingCard>
          <div className="relative h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
            <img src={receptionImg} alt="Ricevimento serale" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <p className="absolute bottom-3 left-4 text-white font-serif text-lg">{WEDDING.reception.title}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#8B6F5E]">
              <Clock size={14} className="text-[#C2878A]" />
              <span>{WEDDING.reception.time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-[#8B6F5E]">
              <MapPin size={14} className="text-[#C2878A] mt-0.5 shrink-0" />
              <div>
                <p className="text-[#4A3728] font-medium">{WEDDING.reception.place}</p>
                <p className="text-xs">{WEDDING.reception.address}</p>
              </div>
            </div>
            <p className="text-xs text-[#9CAF88] italic mt-2">{WEDDING.reception.note}</p>
          </div>
        </WeddingCard>
      </PageContainer>
    </Layout>
  );
}
