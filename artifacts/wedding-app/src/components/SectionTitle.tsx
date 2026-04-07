interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
  titleClassName?: string;
}

export default function SectionTitle({
  title,
  subtitle,
  center = true,
  titleClassName = "",
}: SectionTitleProps) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {subtitle && (
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 whitespace-pre-line">
          {subtitle}
        </p>
      )}
      <h2
        className={`font-serif text-2xl sm:text-3xl text-foreground leading-snug whitespace-pre-line ${titleClassName}`}
      >
        {title}
      </h2>
      <div
        className={`mt-3 h-px w-28 ${center ? "mx-auto" : ""}`}
        style={{
          background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)",
        }}
      />
    </div>
  );
}
