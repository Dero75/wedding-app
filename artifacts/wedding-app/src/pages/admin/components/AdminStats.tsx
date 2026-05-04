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
    <div className="grid grid-cols-5 gap-1.5 mb-6">
      <div className="min-w-0 bg-card border border-border rounded-xl px-1 py-2 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {adultsCount}
        </p>
        <p
          className="text-[8px] uppercase tracking-normal leading-tight"
          style={{ color: "#7f604d" }}
        >
          Adulti
        </p>
      </div>

      <div className="min-w-0 bg-card border border-border rounded-xl px-1 py-2 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {under18Count}
        </p>
        <p
          className="text-[8px] uppercase tracking-normal leading-tight"
          style={{ color: "#7f604d" }}
        >
          Under18
        </p>
      </div>

      <div className="min-w-0 bg-card border border-border rounded-xl px-1 py-2 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {vegetarianCount}
        </p>
        <p
          className="text-[8px] uppercase tracking-normal leading-tight"
          style={{ color: "#6f8f4a" }}
        >
          Veg
        </p>
      </div>

      <div className="min-w-0 bg-card border border-border rounded-xl px-1 py-2 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {celiacCount}
        </p>
        <p
          className="text-[8px] uppercase tracking-normal leading-tight"
          style={{ color: "#d4b483" }}
        >
          Celiaci
        </p>
      </div>

      <div className="min-w-0 bg-card border border-border rounded-xl px-1 py-2 text-center">
        <p className="font-sans text-lg" style={{ color: "#7f604d" }}>
          {notConfirmedCount}
        </p>
        <p
          className="text-[8px] uppercase tracking-normal leading-tight"
          style={{ color: "#a35b5b" }}
        >
          Assenti
        </p>
      </div>
    </div>
  );
}
