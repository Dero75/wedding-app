import {
  DIETARY_FLAG_VALUES,
  createDefaultDietaryCounts,
  type DietaryCounts,
  type DietaryFlag,
} from "@/config/rsvp";
import { normalizePersonName } from "@/lib/personName";
import type { RSVPEntry } from "@/lib/storageTypes";

function uniqueDietaryFlags(values: DietaryFlag[]): DietaryFlag[] {
  return Array.from(new Set(values));
}

function inferLegacyDietaryFlags(dietaryNotes: unknown): DietaryFlag[] {
  if (typeof dietaryNotes !== "string") return [];
  const text = dietaryNotes.toLowerCase();
  const flags: DietaryFlag[] = [];

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

function splitLegacyFullName(fullName: string): { firstName: string; lastName: string } | null {
  const parts = normalizePersonName(fullName)
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length < 2) return null;

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function sanitizeNameFields(item: Record<string, unknown>): {
  firstName: string;
  lastName: string;
  mutated: boolean;
} | null {
  const firstName = normalizePersonName(typeof item.firstName === "string" ? item.firstName : "");
  const lastName = normalizePersonName(typeof item.lastName === "string" ? item.lastName : "");

  if (firstName && lastName) {
    const rawFirstName = typeof item.firstName === "string" ? item.firstName.trim() : "";
    const rawLastName = typeof item.lastName === "string" ? item.lastName.trim() : "";
    return {
      firstName,
      lastName,
      mutated:
        typeof item.fullName === "string" || rawFirstName !== firstName || rawLastName !== lastName,
    };
  }

  const fullName = typeof item.fullName === "string" ? item.fullName.trim() : "";
  if (!fullName) return null;

  const split = splitLegacyFullName(fullName);
  if (!split) return null;

  return { ...split, mutated: true };
}

function createDietaryCountsFromFlags(flags: DietaryFlag[]): DietaryCounts {
  const counts = createDefaultDietaryCounts();
  for (const flag of flags) {
    counts[flag] = 1;
  }
  return counts;
}

function sanitizeDietaryCounts(
  value: unknown,
  legacyFlags: unknown,
  legacyDietaryNotes: unknown,
): DietaryCounts {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return createDietaryCountsFromFlags(sanitizeDietaryFlags(legacyFlags, legacyDietaryNotes));
  }

  const counts = createDefaultDietaryCounts();
  const source = value as Record<string, unknown>;
  for (const flag of DIETARY_FLAG_VALUES) {
    const raw = source[flag];
    counts[flag] =
      typeof raw === "number" && Number.isFinite(raw) ? Math.max(0, Math.min(10, Math.floor(raw))) : 0;
  }
  return counts;
}

function hasExactDietaryCountsSnapshot(value: unknown, counts: DietaryCounts): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const source = value as Record<string, unknown>;
  return DIETARY_FLAG_VALUES.every((flag) => source[flag] === counts[flag]);
}

export function sanitizeRsvpEntry(
  value: unknown,
  generateId: () => string,
): { entry: RSVPEntry | null; mutated: boolean } {
  if (!value || typeof value !== "object") return { entry: null, mutated: false };
  const item = value as Record<string, unknown>;

  const names = sanitizeNameFields(item);
  if (!names) {
    return { entry: null, mutated: true };
  }

  const attendingRaw = item.attending;
  const attending = typeof attendingRaw === "boolean" ? attendingRaw : true;

  const guestCountRaw = item.guestCount;
  const guestCount =
    typeof guestCountRaw === "number" && Number.isFinite(guestCountRaw)
      ? Math.max(attending ? 1 : 0, Math.floor(guestCountRaw))
      : attending
        ? 1
        : 0;

  const childrenCountRaw = item.childrenCount;
  const childrenCount =
    typeof childrenCountRaw === "number" && Number.isFinite(childrenCountRaw)
      ? Math.max(0, Math.floor(childrenCountRaw))
      : 0;

  const dietaryCounts = sanitizeDietaryCounts(item.dietaryCounts, item.dietaryFlags, item.dietaryNotes);

  const mutated =
    names.mutated ||
    attending !== attendingRaw ||
    guestCount !== guestCountRaw ||
    childrenCount !== childrenCountRaw ||
    !hasExactDietaryCountsSnapshot(item.dietaryCounts, dietaryCounts) ||
    Array.isArray(item.dietaryFlags) ||
    typeof item.dietaryNotes === "string" ||
    typeof item.message === "string" ||
    typeof item.fullName === "string";

  return {
    entry: {
      id: typeof item.id === "string" ? item.id : generateId(),
      firstName: names.firstName,
      lastName: names.lastName,
      attending,
      guestCount,
      childrenCount,
      dietaryCounts,
      submittedAt: typeof item.submittedAt === "string" ? item.submittedAt : new Date().toISOString(),
    },
    mutated,
  };
}
