import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DevRoleSwitch from "@/components/dev/DevRoleSwitch";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_CITY,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => handleLeave(), 4500);
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
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
        <DevRoleSwitch />
      </div>

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
          <span className="text-xs tracking-wider uppercase">{FIXED_WEDDING_DATE_LABEL}</span>
          <div className="h-px w-12 bg-current" />
        </div>

        {/* Names */}
        <div className="text-center">
          <h1
            className="font-serif text-5xl sm:text-6xl leading-tight"
            style={{ color: "hsl(38 50% 97%)" }}
          >
            {FIXED_BRIDE_NAME}
          </h1>
          <p className="font-serif text-2xl my-2" style={{ color: "rgba(201,185,154,0.8)" }}>
            &
          </p>
          <h1
            className="font-serif text-5xl sm:text-6xl leading-tight"
            style={{ color: "hsl(38 50% 97%)" }}
          >
            {FIXED_GROOM_NAME}
          </h1>
        </div>

        {/* Location row */}
        <div className="flex items-center gap-3" style={{ color: "rgba(201,185,154,0.6)" }}>
          <div className="h-px w-12 bg-current" />
          <span className="text-xs tracking-wider uppercase">{FIXED_WEDDING_CITY}</span>
          <div className="h-px w-12 bg-current" />
        </div>
      </div>
    </div>
  );
}
