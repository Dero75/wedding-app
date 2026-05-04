import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Settings } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  adminTopbarActions?: ReactNode;
  adminTopbarLeftActions?: ReactNode;
}

const ADMIN_PIN = "2015";
const ADMIN_SESSION_KEY = "wedding_admin_pin_unlocked";

function hasAdminSession(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

function setAdminSession(): void {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
  } catch {
    // Session persistence is best-effort; navigation can still proceed.
  }
}

export default function Layout({
  children,
  adminTopbarActions,
  adminTopbarLeftActions,
}: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const isAdminRoute = location.startsWith("/admina");
  const isAdminHome = location === "/admina";
  const showAdminHomeButton = isAdminRoute && !isAdminHome;
  const isPublicHome = location === "/home";

  const openAdminAccess = () => {
    if (hasAdminSession()) {
      setLocation("/admina");
      return;
    }
    setPin("");
    setPinError(null);
    setIsPinModalOpen(true);
  };

  const closePinModal = () => {
    setIsPinModalOpen(false);
    setPin("");
    setPinError(null);
  };

  const handlePinSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pin.trim() !== ADMIN_PIN) {
      setPinError("PIN non corretto.");
      return;
    }
    setAdminSession();
    closePinModal();
    setLocation("/admina");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Fixed nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="relative max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          {showAdminHomeButton ? (
            <Link
              href="/admina"
              data-testid="button-admin-home-topbar"
              className="font-sans text-foreground text-base tracking-wider uppercase hover:text-accent transition-colors"
            >
              Home
            </Link>
          ) : isAdminHome ? (
            <div className="-ml-2">{adminTopbarLeftActions}</div>
          ) : (
            <div className="w-[74px] h-8" aria-hidden="true" />
          )}

          {isPublicHome ? (
            <button
              type="button"
              onClick={openAdminAccess}
              data-testid="button-hidden-admin-access"
              className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background text-transparent outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
              aria-label="Accedi ad admin"
            />
          ) : isAdminRoute ? (
            <Link
              href="/home"
              data-testid="button-user-switch-topbar"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card px-4 py-2 font-sans text-[10px] uppercase tracking-wider text-foreground transition-colors hover:bg-background hover:text-foreground/80"
              aria-label="Torna alla sezione user"
            >
              User
            </Link>
          ) : (
            <div className="absolute left-1/2 -translate-x-1/2 w-[74px] h-8" aria-hidden="true" />
          )}

          {isAdminHome ? (
            <div className="flex items-center gap-2 -mr-2">
              {adminTopbarActions}
              <Link
                href="/admina/settings"
                data-testid="button-admin-settings-topbar"
                className="p-2 text-foreground hover:text-foreground/80 transition-colors"
                aria-label="Apri impostazioni admin"
              >
                <Settings size={20} strokeWidth={1.5} />
              </Link>
            </div>
          ) : isAdminRoute ? (
            <div className="w-8 h-8 -mr-2" aria-hidden="true" />
          ) : isPublicHome ? (
            <div className="w-[74px] h-8" aria-hidden="true" />
          ) : (
            <Link
              href="/home"
              className="font-sans text-foreground text-base tracking-wider uppercase hover:text-accent transition-colors"
            >
              Home
            </Link>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="pt-14">{children}</main>

      {isPinModalOpen && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-foreground/30 px-4 py-4 backdrop-blur-sm [padding-bottom:max(1rem,env(safe-area-inset-bottom))] [padding-top:max(1rem,env(safe-area-inset-top))] sm:px-5"
          onClick={closePinModal}
        >
          <form
            onSubmit={handlePinSubmit}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-border bg-card p-5 text-center shadow-xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Accesso admin"
            data-testid="modal-admin-pin"
          >
            <p className="mb-2 font-sans text-[10px] uppercase tracking-wider text-muted-foreground">
              Area riservata
            </p>
            <h3
              className="mb-4 font-serif text-2xl leading-tight"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Accesso admin
            </h3>
            <input
              value={pin}
              onChange={(event) => {
                setPin(event.target.value.replace(/\D/g, "").slice(0, ADMIN_PIN.length));
                setPinError(null);
              }}
              autoFocus
              type="password"
              inputMode="numeric"
              maxLength={4}
              className="mb-2 w-full rounded-xl border border-border bg-white px-4 py-3 text-center font-sans text-lg tracking-wider text-foreground outline-none transition-all focus:border-accent focus:ring-2 focus:ring-ring/40"
              aria-label="PIN admin"
              data-testid="input-admin-pin"
            />
            {pinError && <p className="mb-3 text-xs text-destructive">{pinError}</p>}

            <div className="mt-4 flex gap-2.5">
              <button
                type="button"
                onClick={closePinModal}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:border-muted-foreground/40 hover:text-foreground"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="flex-1 rounded-full border border-primary-border bg-primary px-4 py-2.5 text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-95"
                data-testid="button-submit-admin-pin"
              >
                Entra
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
