interface RsvpInputFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

export default function RsvpInputField({ label, error, hint, children }: RsvpInputFieldProps) {
  return (
    <div>
      <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      {error && (
        <p
          className="text-xs mt-1 animate-in slide-in-from-top-1 duration-200"
          style={{ color: "hsl(var(--destructive))" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
