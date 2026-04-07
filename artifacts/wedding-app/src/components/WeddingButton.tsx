import { ButtonHTMLAttributes } from "react";

interface WeddingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export default function WeddingButton({
  variant = "primary",
  fullWidth = false,
  children,
  className = "",
  ...props
}: WeddingButtonProps) {
  const base =
    "inline-flex items-center justify-center px-6 py-3.5 font-sans text-xs tracking-wider uppercase rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] select-none";

  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-md hover:shadow-lg",
    outline:
      "border border-border text-foreground bg-card hover:bg-muted hover:border-muted-foreground/40",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
