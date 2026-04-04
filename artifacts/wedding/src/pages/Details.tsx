import { Clock, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import WeddingCard from "@/components/WeddingCard";
import { getContent } from "@/lib/storage";
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
  const c = getContent();

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Il Programma" subtitle="Tutto il giorno" />

        {/* Timeline */}
        <div className="relative mb-12">
          <div className="absolute left-[4.25rem] top-0 bottom-0 w-px bg-border" />
          <div className="space-y-7">
            {PROGRAM.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-16 shrink-0 text-right">
                  <span
                    className="inline-block bg-card border border-border rounded-lg px-2 py-1 text-xs font-mono tracking-wider text-muted-foreground"
                  >
                    {item.time}
                  </span>
                </div>
                <div className="relative flex-1">
                  <div
                    className="absolute -left-[1.4rem] top-2.5 w-2.5 h-2.5 rounded-full border-2 bg-background"
                    style={{ borderColor: "hsl(var(--accent))" }}
                  />
                  <div className="pl-4">
                    <p className="font-serif text-base leading-snug" style={{ color: "hsl(var(--foreground))" }}>
                      {item.label}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-3 left-4 text-white font-serif text-lg">Cerimonia</p>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} style={{ color: "hsl(var(--accent))" }} />
              <span>{c.ceremonyTime}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--accent))" }} />
              <div>
                <p className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{c.ceremonyPlace}</p>
                <p className="text-xs text-muted-foreground">{c.ceremonyAddress}</p>
              </div>
            </div>
            <p className="text-xs italic text-muted-foreground mt-1">{c.ceremonyNote}</p>
          </div>
        </WeddingCard>

        {/* Reception card */}
        <WeddingCard>
          <div className="relative h-36 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
            <img src={receptionImg} alt="Ricevimento serale" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <p className="absolute bottom-3 left-4 text-white font-serif text-lg">Ricevimento</p>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={14} style={{ color: "hsl(var(--accent))" }} />
              <span>{c.receptionTime}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: "hsl(var(--accent))" }} />
              <div>
                <p className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{c.receptionPlace}</p>
                <p className="text-xs text-muted-foreground">{c.receptionAddress}</p>
              </div>
            </div>
            <p className="text-xs italic text-muted-foreground mt-1">{c.receptionNote}</p>
          </div>
        </WeddingCard>
      </PageContainer>
    </Layout>
  );
}
