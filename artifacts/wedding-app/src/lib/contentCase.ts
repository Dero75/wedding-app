import type { EditableContent } from "@/lib/storageTypes";

type ContentTextKey = keyof EditableContent;

const TITLE_CASE_KEYS: ReadonlySet<ContentTextKey> = new Set([
  "welcomeTitle",
  "outfitTitle",
  "giftTitle",
  "passTitle",
  "weddingLocation",
  "ceremonyPlace",
  "receptionPlace",
  "giftHolder",
]);

const SENTENCE_CASE_KEYS: ReadonlySet<ContentTextKey> = new Set([
  "introTagline",
  "heroSubtitle",
  "welcomeText",
  "ctaRSVP",
  "ctaDetails",
  "ceremonyNote",
  "receptionNote",
  "outfitText",
  "detailsGiftTitle",
  "detailsGiftSubtitle",
  "detailsGiftButtonLabel",
  "giftText",
  "passSubtitle",
]);

const ADDRESS_CASE_KEYS: ReadonlySet<ContentTextKey> = new Set([
  "weddingAddress",
  "ceremonyAddress",
  "receptionAddress",
]);

const UPPERCASE_KEYS: ReadonlySet<ContentTextKey> = new Set(["giftIBAN", "giftBIC"]);

const IDENTITY_KEYS: ReadonlySet<ContentTextKey> = new Set(["weddingTime", "ceremonyTime", "receptionTime"]);

const WORD_SEPARATOR = /([ \t\-–—/()]+)/g;
const ONLY_SEPARATOR = /^[ \t\-–—/()]+$/;

function compactSpacingByLine(value: string): string {
  return value
    .split("\n")
    .map((line) => line.trim().replace(/\s+/g, " "))
    .join("\n")
    .trim();
}

function capitalizeWord(value: string): string {
  if (!value) return "";
  const lower = value.toLocaleLowerCase("it-IT");
  return lower.charAt(0).toLocaleUpperCase("it-IT") + lower.slice(1);
}

function toTitleCase(value: string): string {
  return value
    .split("\n")
    .map((line) =>
      line
        .split(WORD_SEPARATOR)
        .map((part) => {
          if (!part || ONLY_SEPARATOR.test(part)) return part;
          return capitalizeWord(part);
        })
        .join(""),
    )
    .join("\n");
}

function toSentenceCase(value: string): string {
  return value
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "";
      const lower = trimmed.toLocaleLowerCase("it-IT");
      return lower.charAt(0).toLocaleUpperCase("it-IT") + lower.slice(1);
    })
    .join("\n");
}

function normalizeAcronyms(value: string): string {
  return value
    .replace(/\brsvp\b/gi, "RSVP")
    .replace(/\biban\b/gi, "IBAN")
    .replace(/\bbic\b/gi, "BIC")
    .replace(/\bswift\b/gi, "SWIFT");
}

export function normalizeAdminContentValue(key: ContentTextKey, value: string): string {
  const compact = compactSpacingByLine(value);
  if (!compact) return "";

  if (UPPERCASE_KEYS.has(key)) {
    return compact.toLocaleUpperCase("it-IT");
  }

  if (IDENTITY_KEYS.has(key)) {
    return compact;
  }

  if (TITLE_CASE_KEYS.has(key) || ADDRESS_CASE_KEYS.has(key)) {
    return normalizeAcronyms(toTitleCase(compact));
  }

  if (SENTENCE_CASE_KEYS.has(key)) {
    return normalizeAcronyms(toSentenceCase(compact));
  }

  return compact;
}
