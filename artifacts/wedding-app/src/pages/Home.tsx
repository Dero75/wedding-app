import { useEffect, useState } from "react";
import { Frown } from "lucide-react";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import WeddingButton from "@/components/WeddingButton";
import { getContent } from "@/lib/storage";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";

const coupleVenueImg = "/assets/home-hero-dd.jpg";
const coupleVenueImgSmall = "/assets/home-hero-dd-900.jpg";

const INTRO_HOME_TRANSITION_KEY = "wedding_intro_home_white_fade";
const HOME_WHITE_REVEAL_DURATION_MS = 1120;
const shouldStartWhiteReveal = () => {
  try {
    return sessionStorage.getItem(INTRO_HOME_TRANSITION_KEY) === "1";
  } catch {
    return false;
  }
};

export default function Home() {
  const c = getContent();
  const [showWhiteReveal, setShowWhiteReveal] = useState(shouldStartWhiteReveal);

  useEffect(() => {
    if (!showWhiteReveal) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;
    try {
      sessionStorage.removeItem(INTRO_HOME_TRANSITION_KEY);
    } catch {
      // ignore
    }
    timer = setTimeout(() => setShowWhiteReveal(false), HOME_WHITE_REVEAL_DURATION_MS);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showWhiteReveal]);

  return (
    <Layout>
      {showWhiteReveal && (
        <div
          className="fixed inset-0 z-[60] pointer-events-none home-white-reveal-overlay"
          aria-hidden="true"
        />
      )}
      <div
        className={`home-screen flex flex-col overflow-x-hidden overflow-y-auto ${showWhiteReveal ? "home-content-reveal" : ""}`}
      >
        <div className="home-photo relative flex-shrink-0 overflow-hidden">
          <img
            src={coupleVenueImg}
            srcSet={`${coupleVenueImgSmall} 747w, ${coupleVenueImg} 1452w`}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(74,55,40,0.60) 0%, rgba(74,55,40,0.20) 50%, transparent 100%)",
            }}
          />
        </div>

        <div className="flex-1 min-h-0 flex flex-col px-5 pt-3 pb-4 max-w-lg mx-auto w-full">
          <div className="text-center flex-shrink-0 flex flex-col items-center gap-[0.1rem]">
            <p
              className="home-kicker text-[11.5px] tracking-wider uppercase"
              style={{ color: "hsl(var(--muted-foreground))" }}
            >
              {FIXED_WEDDING_DATE_LABEL}
            </p>
            <h1
              className="home-title font-serif text-[2.3125rem] leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              {FIXED_BRIDE_NAME} & {FIXED_GROOM_NAME}
            </h1>
          </div>

          <div className="flex-1 min-h-0 flex flex-col justify-start mt-2.5">
            <div className="home-welcome text-center mb-3">
              <div
                className="mx-auto h-px w-44 mt-2 mb-2 translate-y-1.5"
                style={{
                  background: "linear-gradient(to right, transparent, hsl(var(--border)), transparent)",
                }}
              />
              <div className="translate-y-3">
                <h2
                  className="home-welcome-title font-serif text-[1.3125rem] mb-1 whitespace-pre-line"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {c.welcomeTitle}
                </h2>
                <p
                  className="home-welcome-text font-serif text-[15.5px] leading-relaxed whitespace-pre-line text-center"
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {c.welcomeText}
                </p>
              </div>
            </div>

            <div className="home-actions flex flex-col gap-2.5 flex-shrink-0 mt-10">
              <div className="w-[70%] mx-auto">
                <Link href="/details">
                  <WeddingButton variant="outline" fullWidth data-testid="button-cta-details">
                    <span className="whitespace-pre-line text-center">{c.ctaDetails}</span>
                  </WeddingButton>
                </Link>
              </div>
              <div className="w-[70%] mx-auto">
                <Link href="/rsvp">
                  <WeddingButton fullWidth data-testid="button-cta-rsvp">
                    <span className="whitespace-pre-line text-center">{c.ctaRSVP}</span>
                  </WeddingButton>
                </Link>
              </div>
              <div className="w-[70%] mx-auto">
                <Link href="/rsvp?decline=1">
                  <button
                    type="button"
                    data-testid="button-home-decline-rsvp"
                    className="w-full inline-flex items-center justify-center rounded-full border border-border bg-[#f3ede3] px-5 py-3 text-xs uppercase tracking-wider text-foreground hover:opacity-95 transition-opacity"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <span>Non potrò partecipare</span>
                      <Frown size={13} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
