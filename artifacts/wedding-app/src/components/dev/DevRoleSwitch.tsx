import { useLocation } from "wouter";

const activeClass = "bg-primary text-primary-foreground shadow-sm";
const inactiveClass = "text-foreground/70 hover:text-foreground";

export default function DevRoleSwitch() {
  const [location, setLocation] = useLocation();
  const isAdminView = location.startsWith("/admin");

  return (
    <div
      className="inline-flex items-center rounded-full border border-border bg-card p-1"
      data-testid="dev-role-switch"
    >
      <button
        type="button"
        aria-pressed={!isAdminView}
        onClick={() => setLocation("/home")}
        className={`min-h-8 px-3 rounded-full text-[10px] tracking-widest uppercase transition-colors ${!isAdminView ? activeClass : inactiveClass}`}
      >
        User
      </button>
      <button
        type="button"
        aria-pressed={isAdminView}
        onClick={() => setLocation("/admin")}
        className={`min-h-8 px-3 rounded-full text-[10px] tracking-widest uppercase transition-colors ${isAdminView ? activeClass : inactiveClass}`}
      >
        Admin
      </button>
    </div>
  );
}
