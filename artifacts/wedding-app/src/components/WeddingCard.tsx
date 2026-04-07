interface WeddingCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function WeddingCard({ children, className = "" }: WeddingCardProps) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
