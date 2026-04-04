import { DIETARY_FLAG_VALUES, type DietaryFlag } from "@/config/rsvp";

const PREFIX = "wedding_";
const STORAGE_KEYS = {
  content: "content",
  adminSettings: "admin_settings",
  rsvps: "rsvps",
  myRsvp: "my_rsvp",
} as const;

function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function storageRemove(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // ignore
  }
}

// ─── EDITABLE CONTENT ───────────────────────────────────────────────────────

export interface EditableContent {
  // Intro
  introTagline: string;
  // Home hero
  heroSubtitle: string;
  brideName: string;
  groomName: string;
  weddingTime: string;
  weddingLocation: string;
  weddingAddress: string;
  // Home body
  welcomeTitle: string;
  welcomeText: string;
  ctaRSVP: string;
  ctaDetails: string;
  // Details
  ceremonyPlace: string;
  ceremonyTime: string;
  ceremonyAddress: string;
  ceremonyNote: string;
  receptionPlace: string;
  receptionTime: string;
  receptionAddress: string;
  receptionNote: string;
  // Gift
  giftTitle: string;
  giftText: string;
  giftIBAN: string;
  giftBIC: string;
  giftHolder: string;
  // Pass
  passTitle: string;
  passSubtitle: string;
}

const DEFAULT_CONTENT: EditableContent = {
  introTagline: "il matrimonio di",
  heroSubtitle: "il matrimonio di",
  brideName: "Deborah",
  groomName: "Davide",
  weddingTime: "16:00",
  weddingLocation: "Villa Borgonuovo",
  weddingAddress: "Via Borgonuovo 12, 40125 Bologna",
  welcomeTitle: "Siete i benvenuti",
  welcomeText:
    "Con immensa gioia vi invitiamo a celebrare con noi il giorno più bello della nostra vita. La vostra presenza renderà questo momento ancora più indimenticabile.",
  ctaRSVP: "Conferma la tua presenza",
  ctaDetails: "Il programma",
  ceremonyPlace: "Villa Borgonuovo — Cappella",
  ceremonyTime: "16:00",
  ceremonyAddress: "Via Borgonuovo 12, 40125 Bologna",
  ceremonyNote: "Vi chiediamo di arrivare 15 minuti prima della cerimonia.",
  receptionPlace: "Villa Borgonuovo — Cortile interno",
  receptionTime: "18:30",
  receptionAddress: "Via Borgonuovo 12, 40125 Bologna",
  receptionNote: "Ci uniamo nel cortile per il ricevimento all'aperto.",
  giftTitle: "Un pensiero per noi",
  giftText:
    "La vostra presenza è il regalo più bello che potessimo ricevere. Per chi volesse farci un pensiero, vi lasciamo i nostri riferimenti bancari.",
  giftIBAN: "IT60 X054 2811 1010 0000 0123 456",
  giftBIC: "BLOPIT22",
  giftHolder: "Davide Rossi",
  passTitle: "Il vostro invito",
  passSubtitle: "Lasciate questo pass all'ingresso della villa",
};

export function getContent(): EditableContent {
  const savedRaw = storageGet<Record<string, unknown>>(STORAGE_KEYS.content, {});
  const saved: Partial<EditableContent> = {};

  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof EditableContent)[]) {
    const value = savedRaw[key];
    if (typeof value === "string") {
      saved[key] = value;
    }
  }

  // Cleanup legacy/dead fields from older snapshots (e.g. deprecated `hashtag`).
  if (Object.keys(savedRaw).length !== Object.keys(saved).length) {
    storageSet(STORAGE_KEYS.content, saved);
  }

  return { ...DEFAULT_CONTENT, ...saved };
}

export function saveContent(content: EditableContent): void {
  storageSet(STORAGE_KEYS.content, content);
}

// ─── ADMIN SETTINGS ─────────────────────────────────────────────────────────

export interface AdminSettings {
  stylePreset: "ivory" | "dark";
  showCouplePhoto: boolean;
  showWelcomeSection: boolean;
  showGiftSection: boolean;
  showEntrancePass: boolean;
}

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  stylePreset: "ivory",
  showCouplePhoto: true,
  showWelcomeSection: true,
  showGiftSection: true,
  showEntrancePass: true,
};

function sanitizeStylePreset(value: unknown): AdminSettings["stylePreset"] {
  if (value === "dark") return "dark";
  return "ivory";
}

export function getAdminSettings(): AdminSettings {
  const saved = storageGet<Partial<AdminSettings>>(STORAGE_KEYS.adminSettings, {});
  return {
    ...DEFAULT_ADMIN_SETTINGS,
    ...saved,
    stylePreset: sanitizeStylePreset(saved.stylePreset),
  };
}

export function saveAdminSettings(settings: AdminSettings): void {
  storageSet(STORAGE_KEYS.adminSettings, settings);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("admin-settings-changed"));
  }
}

// ─── RSVP ───────────────────────────────────────────────────────────────────

export interface RSVPEntry {
  id: string;
  fullName: string;
  guestCount: number;
  childrenCount: number;
  dietaryFlags: DietaryFlag[];
  submittedAt: string;
}

function uniqueDietaryFlags(values: DietaryFlag[]): DietaryFlag[] {
  return Array.from(new Set(values));
}

function inferLegacyDietaryFlags(dietaryNotes: unknown): DietaryFlag[] {
  if (typeof dietaryNotes !== "string") return [];
  const text = dietaryNotes.toLowerCase();
  const flags: DietaryFlag[] = [];

  if (text.includes("vegano")) flags.push("vegan");
  if (text.includes("vegetar")) flags.push("vegetarian");
  if (text.includes("celiac") || text.includes("senza glutine") || text.includes("glutine")) {
    flags.push("celiac");
  }

  return uniqueDietaryFlags(flags);
}

function sanitizeDietaryFlags(value: unknown, legacyDietaryNotes?: unknown): DietaryFlag[] {
  if (!Array.isArray(value)) {
    return inferLegacyDietaryFlags(legacyDietaryNotes);
  }

  const allowed = new Set<DietaryFlag>(DIETARY_FLAG_VALUES);
  const sanitized = value
    .filter((flag): flag is DietaryFlag => typeof flag === "string" && allowed.has(flag as DietaryFlag))
    .slice(0, DIETARY_FLAG_VALUES.length);

  return uniqueDietaryFlags(sanitized);
}

export function getRSVPs(): RSVPEntry[] {
  const raw = storageGet<unknown[]>(STORAGE_KEYS.rsvps, []);
  let hasLegacyMutation = false;

  const sanitized: RSVPEntry[] = raw
    .map((value) => {
      if (!value || typeof value !== "object") return null;
      const item = value as Record<string, unknown>;

      // Legacy model had explicit declines (`attending: false`), now removed.
      if (item.attending === false) {
        hasLegacyMutation = true;
        return null;
      }

      const fullName = typeof item.fullName === "string" ? item.fullName.trim() : "";
      if (!fullName) {
        hasLegacyMutation = true;
        return null;
      }

      const guestCountRaw = item.guestCount;
      const guestCount =
        typeof guestCountRaw === "number" && Number.isFinite(guestCountRaw)
          ? Math.max(1, Math.floor(guestCountRaw))
          : 1;
      if (guestCount !== guestCountRaw) {
        hasLegacyMutation = true;
      }

      const childrenCountRaw = item.childrenCount;
      const childrenCount =
        typeof childrenCountRaw === "number" && Number.isFinite(childrenCountRaw)
          ? Math.max(0, Math.floor(childrenCountRaw))
          : 0;
      if (childrenCount !== childrenCountRaw) {
        hasLegacyMutation = true;
      }

      const dietaryFlags = sanitizeDietaryFlags(item.dietaryFlags, item.dietaryNotes);
      if (
        !Array.isArray(item.dietaryFlags) ||
        JSON.stringify(item.dietaryFlags) !== JSON.stringify(dietaryFlags)
      ) {
        hasLegacyMutation = true;
      }

      if (typeof item.dietaryNotes === "string" || typeof item.message === "string") {
        hasLegacyMutation = true;
      }

      return {
        id: typeof item.id === "string" ? item.id : generateId(),
        fullName,
        guestCount,
        childrenCount,
        dietaryFlags,
        submittedAt: typeof item.submittedAt === "string" ? item.submittedAt : new Date().toISOString(),
      };
    })
    .filter((entry): entry is RSVPEntry => entry !== null);

  if (sanitized.length !== raw.length || hasLegacyMutation) {
    storageSet(STORAGE_KEYS.rsvps, sanitized);
  }

  return sanitized;
}

function saveRSVP(entry: RSVPEntry): void {
  const all = getRSVPs();
  const idx = all.findIndex((r) => r.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  storageSet(STORAGE_KEYS.rsvps, all);
}

export function getMyRSVP(): RSVPEntry | null {
  const raw = storageGet<unknown>(STORAGE_KEYS.myRsvp, null);
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  if (item.attending === false) {
    storageRemove(STORAGE_KEYS.myRsvp);
    return null;
  }

  const fullName = typeof item.fullName === "string" ? item.fullName.trim() : "";
  if (!fullName) return null;

  const guestCountRaw = item.guestCount;
  const guestCount =
    typeof guestCountRaw === "number" && Number.isFinite(guestCountRaw)
      ? Math.max(1, Math.floor(guestCountRaw))
      : 1;

  const childrenCountRaw = item.childrenCount;
  const childrenCount =
    typeof childrenCountRaw === "number" && Number.isFinite(childrenCountRaw)
      ? Math.max(0, Math.floor(childrenCountRaw))
      : 0;

  const dietaryFlags = sanitizeDietaryFlags(item.dietaryFlags, item.dietaryNotes);

  const sanitized: RSVPEntry = {
    id: typeof item.id === "string" ? item.id : generateId(),
    fullName,
    guestCount,
    childrenCount,
    dietaryFlags,
    submittedAt: typeof item.submittedAt === "string" ? item.submittedAt : new Date().toISOString(),
  };

  storageSet(STORAGE_KEYS.myRsvp, sanitized);
  return sanitized;
}

export function saveMyRSVP(entry: RSVPEntry): void {
  storageSet(STORAGE_KEYS.myRsvp, entry);
  saveRSVP(entry);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function clearAllLocalWeddingRecordsForSupabaseMigration(): void {
  storageRemove(STORAGE_KEYS.rsvps);
  storageRemove(STORAGE_KEYS.myRsvp);
  storageRemove(STORAGE_KEYS.content);
  storageRemove(STORAGE_KEYS.adminSettings);
}
