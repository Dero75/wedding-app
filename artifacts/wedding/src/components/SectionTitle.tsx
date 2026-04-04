interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ title, subtitle, center = true }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {subtitle && (
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="font-serif text-2xl sm:text-3xl text-foreground leading-snug">{title}</h2>
      <div
        className={`mt-3 h-px w-28 ${center ? "mx-auto" : ""}`}
        style={{ background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)" }}
      />
    </div>
  );
}
