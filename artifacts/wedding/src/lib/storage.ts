const PREFIX = "wedding_";
const STORAGE_KEYS = {
  content: "content",
  adminSettings: "admin_settings",
  rsvps: "rsvps",
  myRsvp: "my_rsvp",
  devSeedMarker: "dev_seed_marker_v1",
} as const;

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
  const saved = storageGet<Partial<EditableContent>>(STORAGE_KEYS.content, {});
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
  return storageGet<RSVPEntry[]>(STORAGE_KEYS.rsvps, []);
}

export function saveRSVP(entry: RSVPEntry): void {
  const all = getRSVPs();
  const idx = all.findIndex((r) => r.id === entry.id);
  if (idx >= 0) {
    all[idx] = entry;
  } else {
    all.push(entry);
  }
  storageSet(STORAGE_KEYS.rsvps, all);
}

export function deleteRSVP(id: string): void {
  const all = getRSVPs().filter((r) => r.id !== id);
  storageSet(STORAGE_KEYS.rsvps, all);
}

export function getMyRSVP(): RSVPEntry | null {
  return storageGet<RSVPEntry | null>(STORAGE_KEYS.myRsvp, null);
}

export function saveMyRSVP(entry: RSVPEntry): void {
  storageSet(STORAGE_KEYS.myRsvp, entry);
  saveRSVP(entry);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function pickRandom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)]!;
}

function shouldInclude(probability: number): boolean {
  return Math.random() < probability;
}

function randomGuestCount(): number {
  const roll = Math.random();
  if (roll < 0.5) return 1;
  if (roll < 0.75) return 2;
  if (roll < 0.88) return 3;
  if (roll < 0.95) return 4;
  if (roll < 0.98) return 5;
  return 6;
}

function randomSubmittedAtIso(): string {
  const daysAgo = Math.floor(Math.random() * 60);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  const millis = (((daysAgo * 24 + hoursAgo) * 60 + minutesAgo) * 60 + 1) * 1000;
  return new Date(Date.now() - millis).toISOString();
}

function buildTestRsvpEntries(count: number): RSVPEntry[] {
  const firstNames = [
    "Andrea",
    "Giulia",
    "Marco",
    "Sara",
    "Luca",
    "Francesca",
    "Matteo",
    "Chiara",
    "Alessio",
    "Elena",
    "Davide",
    "Martina",
  ] as const;
  const lastNames = [
    "Rossi",
    "Bianchi",
    "Romano",
    "Conti",
    "Ricci",
    "Moretti",
    "Greco",
    "Marini",
    "Gallo",
    "Costa",
    "Ferrari",
    "Colombo",
  ] as const;
  const dietaryNotes = [
    "Vegetariano",
    "Senza lattosio",
    "Celiaco",
    "No crostacei",
    "Allergia frutta secca",
    "Pasto vegano",
    "No maiale",
  ] as const;
  const messages = [
    "Non vediamo l'ora!",
    "Felici di esserci con voi.",
    "Sara una giornata bellissima.",
    "Grazie dell'invito, a presto.",
    "Auguri di cuore agli sposi.",
    "Ci vediamo al ricevimento.",
  ] as const;

  const baseline: RSVPEntry[] = [];

  for (let guestCount = 1; guestCount <= 6; guestCount += 1) {
    baseline.push({
      id: generateId(),
      fullName: `Test Presente Base ${guestCount}`,
      attending: true,
      guestCount,
      dietaryNotes: "",
      message: "",
      submittedAt: randomSubmittedAtIso(),
    });
    baseline.push({
      id: generateId(),
      fullName: `Test Presente Completo ${guestCount}`,
      attending: true,
      guestCount,
      dietaryNotes: pickRandom(dietaryNotes),
      message: pickRandom(messages),
      submittedAt: randomSubmittedAtIso(),
    });
  }

  baseline.push({
    id: generateId(),
    fullName: "Test Non Presente 1",
    attending: false,
    guestCount: 1,
    dietaryNotes: "",
    message: "",
    submittedAt: randomSubmittedAtIso(),
  });
  baseline.push({
    id: generateId(),
    fullName: "Test Non Presente 2",
    attending: false,
    guestCount: 1,
    dietaryNotes: "",
    message: pickRandom(messages),
    submittedAt: randomSubmittedAtIso(),
  });

  const result = baseline.slice(0, count);

  for (let index = result.length; index < count; index += 1) {
    const attending = shouldInclude(0.72);
    const guestCount = attending ? randomGuestCount() : 1;
    const fullName = `${pickRandom(firstNames)} ${pickRandom(lastNames)} ${index + 1}`;

    result.push({
      id: generateId(),
      fullName,
      attending,
      guestCount,
      dietaryNotes: attending && shouldInclude(0.35) ? pickRandom(dietaryNotes) : "",
      message: shouldInclude(0.45) ? pickRandom(messages) : "",
      submittedAt: randomSubmittedAtIso(),
    });
  }

  return result;
}

export function ensureDevTestRsvps(seedCount = 50): number {
  const marker = storageGet<boolean>(STORAGE_KEYS.devSeedMarker, false);
  if (marker) return 0;

  const existing = getRSVPs();
  if (existing.length >= seedCount) {
    storageSet(STORAGE_KEYS.devSeedMarker, true);
    return 0;
  }

  const toGenerate = seedCount - existing.length;
  const generated = buildTestRsvpEntries(toGenerate);
  const merged = [...existing, ...generated];

  storageSet(STORAGE_KEYS.rsvps, merged);
  storageSet(STORAGE_KEYS.devSeedMarker, true);

  if (!getMyRSVP()) {
    const fallbackMine = merged.find((entry) => entry.attending) ?? merged[0] ?? null;
    if (fallbackMine) {
      storageSet(STORAGE_KEYS.myRsvp, fallbackMine);
    }
  }

  return generated.length;
}

export function clearAllLocalWeddingRecordsForSupabaseMigration(): void {
  storageRemove(STORAGE_KEYS.rsvps);
  storageRemove(STORAGE_KEYS.myRsvp);
  storageRemove(STORAGE_KEYS.content);
  storageRemove(STORAGE_KEYS.adminSettings);
  storageRemove(STORAGE_KEYS.devSeedMarker);
}
