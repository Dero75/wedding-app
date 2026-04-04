import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { getContent } from "@/lib/storage";
import { FIXED_WEDDING_CITY, FIXED_WEDDING_DATE_LABEL } from "@/config/event";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const c = getContent();

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => handleLeave(), 3800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleLeave = () => {
    setLeaving(true);
    setTimeout(() => setLocation("/home"), 700);
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-700 ${leaving ? "opacity-0" : "opacity-100"}`}
      onClick={handleLeave}
      data-testid="screen-intro"
      style={{
        background: `var(--p-intro-bg, #3D2B1F)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `radial-gradient(ellipse at center, var(--p-intro-radial, #6B4C3B) 0%, var(--p-intro-bg, #3D2B1F) 70%)`,
        }}
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Date row */}
        <div className="flex items-center gap-3" style={{ color: "rgba(201,185,154,0.6)" }}>
          <div className="h-px w-12 bg-current" />
          <span className="text-xs tracking-[0.3em] uppercase">{FIXED_WEDDING_DATE_LABEL}</span>
          <div className="h-px w-12 bg-current" />
        </div>

        {/* Names */}
        <div className="text-center">
          <p
            className="font-serif text-sm tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(240,230,211,0.75)" }}
          >
            {c.introTagline}
          </p>
          <h1
            className="font-serif text-5xl sm:text-6xl leading-tight"
            style={{ color: "hsl(38 50% 97%)" }}
          >
            {c.brideName}
          </h1>
          <p className="font-serif text-2xl my-2" style={{ color: "rgba(201,185,154,0.8)" }}>
            &
          </p>
          <h1
            className="font-serif text-5xl sm:text-6xl leading-tight"
            style={{ color: "hsl(38 50% 97%)" }}
          >
            {c.groomName}
          </h1>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-3" style={{ color: "rgba(201,185,154,0.6)" }}>
          <div className="h-px w-12 bg-current" />
          <span className="text-xs tracking-[0.3em] uppercase">{FIXED_WEDDING_CITY}</span>
          <div className="h-px w-12 bg-current" />
        </div>
      </div>

      <div
        className={`absolute bottom-12 text-xs tracking-[0.2em] uppercase transition-all duration-1000 delay-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        style={{ color: "rgba(201,185,154,0.45)" }}
      >
        tocca per entrare
      </div>
    </div>
  );
}
