interface AdminStatsProps {
  adultsCount: number;
  under18Count: number;
}

export default function AdminStats({ adultsCount, under18Count }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-xl" style={{ color: "#6f8f4a" }}>
          {adultsCount}
        </p>
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: "#6f8f4a" }}
        >
          Adulti
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-xl" style={{ color: "#6f8f4a" }}>
          {under18Count}
        </p>
        <p
          className="text-[10px] uppercase tracking-wider"
          style={{ color: "#6f8f4a" }}
        >
          Under 18
        </p>
      </div>
    </div>
  );
}
