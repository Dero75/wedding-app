import { CheckCircle, Users } from "lucide-react";

interface AdminStatsProps {
  totalResponses: number;
  confirmedAdults: number;
  withDietaryFlagsCount: number;
}

export default function AdminStats({
  totalResponses,
  confirmedAdults,
  withDietaryFlagsCount,
}: AdminStatsProps) {
  const stats = [
    { icon: <Users size={16} />, label: "Risposte", value: totalResponses },
    { icon: <CheckCircle size={16} />, label: "Confermati", value: confirmedAdults },
    { icon: <Users size={16} />, label: "Con diete", value: withDietaryFlagsCount },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="flex justify-center mb-1" style={{ color: "hsl(var(--accent))" }}>
            {stat.icon}
          </div>
          <p className="font-serif text-xl" style={{ color: "hsl(var(--foreground))" }}>
            {stat.value}
          </p>
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "hsl(var(--muted-foreground))" }}
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
