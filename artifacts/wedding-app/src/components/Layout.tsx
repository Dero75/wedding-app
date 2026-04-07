import { Link, useLocation } from "wouter";
import { Settings } from "lucide-react";
import DevRoleSwitch from "@/components/dev/DevRoleSwitch";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");
  const isAdminHome = location === "/admin";

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Fixed nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="relative max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
          {isAdminRoute ? (
            <Link
              href="/admin"
              data-testid="button-admin-home-topbar"
              className="font-sans text-foreground text-base tracking-wider uppercase hover:text-accent transition-colors"
            >
              Home
            </Link>
          ) : (
            <div className="w-[74px] h-8" aria-hidden="true" />
          )}

          <div className="absolute left-1/2 -translate-x-1/2">
            <DevRoleSwitch />
          </div>

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
    </div>
  );
}
