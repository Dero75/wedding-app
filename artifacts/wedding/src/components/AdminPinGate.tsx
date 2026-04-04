import { useState, useRef, useEffect } from "react";
import { Lock, Heart } from "lucide-react";
import { getAdminPIN, setAdminSessionUnlocked } from "@/lib/storage";
import WeddingButton from "@/components/WeddingButton";

interface AdminPinGateProps {
  onUnlocked: () => void;
}

export default function AdminPinGate({ onUnlocked }: AdminPinGateProps) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleDigit = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    setError(false);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (next.every((d) => d !== "")) {
      const pin = next.join("");
      if (pin === getAdminPIN()) {
        setAdminSessionUnlocked(true);
        onUnlocked();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          setShake(false);
          inputRefs[0].current?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "hsl(var(--background))" }}
    >
      <div className="w-full max-w-xs text-center">
        <div className="flex justify-center mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
            style={{ background: "hsl(var(--primary))" }}
          >
            <Lock size={24} style={{ color: "hsl(var(--primary-foreground))" }} />
          </div>
        </div>

        <p className="text-xs tracking-[0.25em] uppercase mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>
          Accesso riservato
        </p>
        <h1 className="font-serif text-2xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Pannello Admin
        </h1>
        <p className="text-sm mb-10" style={{ color: "hsl(var(--muted-foreground))" }}>
          Inserisci il tuo PIN per continuare
        </p>

        {/* PIN inputs */}
        <div
          className={`flex justify-center gap-4 mb-4 transition-all duration-150 ${shake ? "animate-bounce" : ""}`}
        >
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="password"
              inputMode="numeric"
              maxLength={1}
              value={d}
              data-testid={`input-pin-${i}`}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={`w-14 h-14 text-center text-2xl font-serif rounded-2xl border-2 outline-none transition-all ${
                error
                  ? "border-destructive bg-destructive/10"
                  : d
                  ? "border-accent bg-accent/10"
                  : "border-border bg-card"
              }`}
              style={{
                color: "hsl(var(--foreground))",
                fontFamily: "var(--app-font-serif)",
              }}
            />
          ))}
        </div>

        {error && (
          <p
            className="text-xs mb-6 animate-in fade-in"
            style={{ color: "hsl(var(--destructive))" }}
          >
            PIN non corretto. Riprova.
          </p>
        )}

        {!error && <div className="mb-6 h-5" />}

        <div className="flex items-center justify-center gap-2 mt-2">
          <Heart size={10} style={{ color: "hsl(var(--accent))", fill: "hsl(var(--accent))" }} />
          <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>
            D & D 2025
          </span>
          <Heart size={10} style={{ color: "hsl(var(--accent))", fill: "hsl(var(--accent))" }} />
        </div>
      </div>
    </div>
  );
}
