import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, Settings, X } from "lucide-react";
import DevRoleSwitch from "@/components/dev/DevRoleSwitch";

const NAV_ITEMS = [
  { label: "Home", href: "/home" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Programma", href: "/details" },
  { label: "Regalo", href: "/gift" },
  { label: "Invito", href: "/pass" },
] as const;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const showCenteredDevRoleSwitch = location === "/home" || location.startsWith("/admin");
  const isAdminRoute = location.startsWith("/admin");
  const isAdminHome = location === "/admin";
  const isHomeRoute = location === "/home";

  useEffect(() => {
    if (isAdminRoute) {
      setOpen(false);
    }
  }, [isAdminRoute]);

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Fixed nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="relative max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          {isAdminRoute ? (
            <Link
              href="/admin"
              data-testid="button-admin-home-topbar"
              className="font-sans text-foreground text-[11px] tracking-wider uppercase px-2.5 py-1.5 rounded-full border border-border hover:text-accent transition-colors"
            >
              Home
            </Link>
          ) : isHomeRoute ? (
            <div className="w-[74px] h-8" aria-hidden="true" />
          ) : (
            <Link
              href="/home"
              className="font-sans text-foreground text-base tracking-wider uppercase"
            >
              Home
            </Link>
          )}

          {showCenteredDevRoleSwitch && (
            <div className="absolute left-1/2 -translate-x-1/2">
              <DevRoleSwitch />
            </div>
          )}

          {isAdminHome ? (
            <Link
              href="/admin/settings"
              data-testid="button-admin-settings-topbar"
              className="p-2 -mr-2 text-foreground hover:text-accent transition-colors"
              aria-label="Apri impostazioni admin"
            >
              <Settings size={20} />
            </Link>
          ) : isAdminRoute ? (
            <div className="w-8 h-8 -mr-2" aria-hidden="true" />
          ) : (
            <button
              data-testid="button-menu-toggle"
              onClick={() => setOpen(!open)}
              className="p-2 -mr-2 text-foreground hover:text-accent transition-colors"
              aria-label={open ? "Chiudi menu" : "Apri menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed top-0 right-0 h-full z-50 w-72 bg-background shadow-2xl border-l border-border flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 h-14 border-b border-border">
          <span className="font-sans text-foreground text-sm tracking-wider uppercase">
            Menu
          </span>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col flex-1 px-6 pt-6 pb-8 gap-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className={`py-3.5 text-base font-sans tracking-wider border-b border-border/50 transition-colors ${
                location === item.href ? "text-accent" : "text-foreground hover:text-accent"
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-auto pt-6">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider uppercase"
            >
              Pannello Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="pt-14">{children}</main>
    </div>
  );
}
