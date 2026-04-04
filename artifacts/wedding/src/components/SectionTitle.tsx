interface SectionTitleProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

export default function SectionTitle({ title, subtitle, center = true }: SectionTitleProps) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {subtitle && (
        <p className="text-xs uppercase tracking-[0.25em] text-[#9CAF88] mb-2">{subtitle}</p>
      )}
      <h2 className="font-serif text-2xl text-[#4A3728] leading-snug">{title}</h2>
      <div className={`mt-3 h-px bg-gradient-to-r from-transparent via-[#C9B99A] to-transparent w-32 ${center ? "mx-auto" : ""}`} />
    </div>
  );
}
