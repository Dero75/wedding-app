import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { WEDDING } from "@/config/content";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    const t2 = setTimeout(() => handleLeave(), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleLeave = () => {
    setLeaving(true);
    setTimeout(() => setLocation("/home"), 700);
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-[#4A3728] cursor-pointer transition-opacity duration-700 ${leaving ? "opacity-0" : "opacity-100"}`}
      onClick={handleLeave}
      data-testid="screen-intro"
    >
      {/* Background texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#6B4C3B_0%,_#3D2B1F_70%)] opacity-80" />
      
      {/* Decorative top */}
      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        {/* Small ornament */}
        <div className="flex items-center gap-3 text-[#C9B99A]/60">
          <div className="h-px w-12 bg-[#C9B99A]/60" />
          <span className="text-xs tracking-[0.3em] uppercase">14 Settembre 2025</span>
          <div className="h-px w-12 bg-[#C9B99A]/60" />
        </div>

        {/* Names */}
        <div className="text-center">
          <p className="font-serif text-[#F0E6D3]/80 text-sm tracking-[0.3em] uppercase mb-2">
            il matrimonio di
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-[#FAF5EE] leading-tight">
            {WEDDING.bride}
          </h1>
          <p className="font-serif text-[#C9B99A] text-2xl my-2">&</p>
          <h1 className="font-serif text-5xl sm:text-6xl text-[#FAF5EE] leading-tight">
            {WEDDING.groom}
          </h1>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 text-[#C9B99A]/60 mt-2">
          <div className="h-px w-12 bg-[#C9B99A]/60" />
          <span className="text-xs tracking-[0.3em] uppercase">Bologna</span>
          <div className="h-px w-12 bg-[#C9B99A]/60" />
        </div>
      </div>

      {/* Tap hint */}
      <div
        className={`absolute bottom-12 text-[#C9B99A]/50 text-xs tracking-[0.2em] uppercase transition-all duration-1000 delay-500 ${visible ? "opacity-100" : "opacity-0"}`}
      >
        tocca per entrare
      </div>
    </div>
  );
}
