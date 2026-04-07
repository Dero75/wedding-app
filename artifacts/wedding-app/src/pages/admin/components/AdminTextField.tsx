interface AdminTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

const sharedInputClass =
  "w-full border border-border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/40 focus:border-accent transition-all bg-white text-foreground placeholder:text-muted-foreground";

export default function AdminTextField({
  label,
  value,
  onChange,
  multiline = false,
}: AdminTextFieldProps) {
  return (
    <div className="mt-4">
      <label className="block text-xs uppercase tracking-wider mb-1.5 text-muted-foreground">
        {label}
      </label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`${sharedInputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={sharedInputClass}
        />
      )}
    </div>
  );
}
