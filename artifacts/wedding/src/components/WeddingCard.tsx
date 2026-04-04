interface WeddingCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function WeddingCard({ children, className = "" }: WeddingCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm border border-[#E8D9C5] rounded-2xl p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
