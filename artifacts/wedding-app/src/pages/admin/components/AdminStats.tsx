interface AdminStatsProps {
  adultsCount: number;
  under18Count: number;
  notConfirmedCount: number;
  vegetarianCount: number;
  celiacCount: number;
}

export default function AdminStats({
  adultsCount,
  under18Count,
  notConfirmedCount,
  vegetarianCount,
  celiacCount,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-5 gap-2 mb-6">
      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {adultsCount}
        </p>
        <p
          className="text-[9px] uppercase tracking-wide"
          style={{ color: "#6f8f4a" }}
        >
          Adulti
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {under18Count}
        </p>
        <p
          className="text-[9px] uppercase tracking-wide"
          style={{ color: "#6f8f4a" }}
        >
          Under
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {vegetarianCount}
        </p>
        <p
          className="text-[9px] uppercase tracking-wide"
          style={{ color: "#6f8f4a" }}
        >
          Veg
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {celiacCount}
        </p>
        <p
          className="text-[9px] uppercase tracking-wide"
          style={{ color: "#6f8f4a" }}
        >
          Celiaci
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {notConfirmedCount}
        </p>
        <p
          className="text-[9px] uppercase tracking-wide"
          style={{ color: "#a35b5b" }}
        >
          Assenti
        </p>
      </div>
    </div>
  );
}
