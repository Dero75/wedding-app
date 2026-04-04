import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { WEDDING } from "@/config/content";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Programma", href: "/details" },
  { label: "Regalo", href: "/gift" },
  { label: "Invito", href: "/pass" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-[#FAF5EE] font-serif">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAF5EE]/90 backdrop-blur-sm border-b border-[#E8D9C5]">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-serif text-[#4A3728] text-lg tracking-widest uppercase">
            D & D
          </Link>
          <button
            data-testid="button-menu-toggle"
            onClick={() => setOpen(!open)}
            className="p-2 text-[#4A3728] hover:text-[#C2878A] transition-colors"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-[#FAF5EE] shadow-2xl flex flex-col pt-20 px-8 gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs text-[#9CAF88] uppercase tracking-widest mb-4">
              {WEDDING.date}
            </p>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className={`py-3 text-lg font-serif tracking-wide border-b border-[#E8D9C5] transition-colors ${
                  location === item.href
                    ? "text-[#C2878A]"
                    : "text-[#4A3728] hover:text-[#C2878A]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="mt-auto mb-8 text-sm text-[#9CAF88] hover:text-[#8B6F5E] transition-colors"
            >
              Admin
            </Link>
          </nav>
        </div>
      )}

      {/* Content */}
      <main className="pt-14">{children}</main>
    </div>
  );
}
