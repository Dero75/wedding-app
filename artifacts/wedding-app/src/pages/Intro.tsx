import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_CITY,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";

const INTRO_ENTER_DELAY_MS = 4500;
const INTRO_WHITE_FADE_DURATION_MS = 900;
const INTRO_WHITE_FADE_HOLD_MS = 250;
const INTRO_WHITE_FADE_START_MS =
  INTRO_ENTER_DELAY_MS - (INTRO_WHITE_FADE_DURATION_MS + INTRO_WHITE_FADE_HOLD_MS);
const INTRO_HOME_TRANSITION_KEY = "wedding_intro_home_white_fade";
export const INTRO_COMPLETED_SESSION_KEY = "wedding_intro_completed";
const START_MUSIC_EVENT = "wedding:start-music";

export default function Intro() {
  const [, setLocation] = useLocation();
  const [visible, setVisible] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isFadingToWhite, setIsFadingToWhite] = useState(false);
  const navigationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whiteFadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 100);
    return () => {
      clearTimeout(t1);
      if (navigationTimerRef.current) {
        clearTimeout(navigationTimerRef.current);
      }
      if (whiteFadeTimerRef.current) {
        clearTimeout(whiteFadeTimerRef.current);
      }
    };
  }, []);

  const handleEnter = () => {
    if (isEntering) return;
    window.dispatchEvent(new Event(START_MUSIC_EVENT));

    setIsEntering(true);
    whiteFadeTimerRef.current = setTimeout(() => {
      setIsFadingToWhite(true);
    }, INTRO_WHITE_FADE_START_MS);
    navigationTimerRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem(INTRO_HOME_TRANSITION_KEY, "1");
        sessionStorage.setItem(INTRO_COMPLETED_SESSION_KEY, "1");
      } catch {
        // ignore
      }
      setLocation("/home");
    }, INTRO_ENTER_DELAY_MS);
  };

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-700 opacity-100"
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
        className={`absolute inset-0 pointer-events-none intro-white-overlay ${isFadingToWhite ? "intro-white-overlay--active" : ""}`}
      />

      <div
        className={`relative z-10 flex flex-col items-center gap-6 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        } ${isEntering ? "intro-content-entering" : ""}`}
      >
        <img
          src={`${import.meta.env.BASE_URL}assets/intro-title-deborah-davide-v1.png`}
          width="960"
          height="744"
          alt={`${FIXED_WEDDING_DATE_LABEL}. ${FIXED_BRIDE_NAME} & ${FIXED_GROOM_NAME}. ${FIXED_WEDDING_CITY}.`}
          className="block h-auto w-[min(20rem,calc(100vw-2rem))] select-none"
          draggable={false}
          decoding="async"
          fetchPriority="high"
          data-testid="intro-title-image"
        />
      </div>

      <div
        className={`intro-enter-anchor absolute left-1/2 -translate-x-1/2 z-20 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-col items-center">
          <button
            type="button"
            data-testid="button-enter-intro"
            onClick={handleEnter}
            disabled={isEntering}
            className={`intro-enter-button inline-flex items-center justify-center px-7 py-2.5 rounded-full border text-[11px] tracking-[0.22em] uppercase transition-colors ${
              isEntering ? "intro-enter-button--vanish" : ""
            }`}
            style={{
              borderColor: "rgba(201,185,154,0.6)",
              background: "rgba(248,245,238,0.12)",
              color: "hsl(38 50% 97%)",
            }}
          >
            Entra
          </button>
          <p
            className={`intro-audio-hint mt-2 ${isEntering ? "intro-audio-hint--fade" : ""}`}
            aria-hidden="true"
          >
            Audio on
          </p>
        </div>
      </div>
    </div>
  );
}
