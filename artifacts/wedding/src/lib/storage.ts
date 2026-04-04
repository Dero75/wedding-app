const PREFIX = "wedding_";

export function storageGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function storageRemove(key: string): void {
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
  hashtag: string;
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

export const DEFAULT_CONTENT: EditableContent = {
  introTagline: "il matrimonio di",
  heroSubtitle: "il matrimonio di",
  brideName: "Deborah",
  groomName: "Davide",
  weddingTime: "16:00",
  weddingLocation: "Villa Borgonuovo",
  weddingAddress: "Via Borgonuovo 12, 40125 Bologna",
  hashtag: "#DeboraheDavide2025",
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
  const saved = storageGet<Partial<EditableContent>>("content", {});
  return { ...DEFAULT_CONTENT, ...saved };
}

export function saveContent(content: EditableContent): void {
  storageSet("content", content);
}

// ─── ADMIN SETTINGS ─────────────────────────────────────────────────────────

export interface AdminSettings {
  stylePreset: "ivory" | "blush" | "dark";
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

export function getAdminSettings(): AdminSettings {
  const saved = storageGet<Partial<AdminSettings>>("admin_settings", {});
  return { ...DEFAULT_ADMIN_SETTINGS, ...saved };
}

export function saveAdminSettings(settings: AdminSettings): void {
  storageSet("admin_settings", settings);
}

// ─── RSVP ───────────────────────────────────────────────────────────────────

export interface RSVPEntry {
  id: string;
  fullName: string;
  attending: boolean;
  guestCount: number;
  dietaryNotes: string;
  message: string;
  submittedAt: string;
}

export function getRSVPs(): RSVPEntry[] {
  return storageGet<RSVPEntry[]>("rsvps", []);
}

export function saveRSVP(entry: RSVPEntry): void {
  const all = getRSVPs();
  const idx = all.findIndex((r) => r.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  storageSet("rsvps", all);
}

export function deleteRSVP(id: string): void {
  const all = getRSVPs().filter((r) => r.id !== id);
  storageSet("rsvps", all);
}

export function getMyRSVP(): RSVPEntry | null {
  return storageGet<RSVPEntry | null>("my_rsvp", null);
}

export function saveMyRSVP(entry: RSVPEntry): void {
  storageSet("my_rsvp", entry);
  saveRSVP(entry);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
