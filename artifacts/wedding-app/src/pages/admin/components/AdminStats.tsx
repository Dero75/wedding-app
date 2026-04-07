import { CheckCircle } from "lucide-react";

interface AdminStatsProps {
  confirmedAdults: number;
}

export default function AdminStats({ confirmedAdults }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className="col-start-2 bg-card border border-border rounded-xl p-3 text-center">
        <div className="flex justify-center mb-1" style={{ color: "hsl(var(--accent))" }}>
          <CheckCircle size={16} />
        </div>
        <p className="font-sans text-xl" style={{ color: "hsl(var(--foreground))" }}>
          {confirmedAdults}
        </p>
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: "hsl(var(--muted-foreground))" }}
        >
          Confermati
        </p>
      </div>
    </div>
  );
}
