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
    "inline-flex items-center justify-center px-6 py-3 font-sans text-sm tracking-widest uppercase rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C2878A] active:scale-95";

  const variants = {
    primary: "bg-[#4A3728] text-[#FAF5EE] hover:bg-[#3D2B1F] shadow-md hover:shadow-lg",
    outline:
      "border border-[#C9B99A] text-[#4A3728] hover:bg-[#F0E6D3] hover:border-[#8B6F5E]",
    ghost: "text-[#8B6F5E] hover:text-[#4A3728] hover:bg-[#F0E6D3]",
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
