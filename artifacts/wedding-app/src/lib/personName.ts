const ITALIAN_LOCALE = "it-IT";
const NAME_SEGMENT_SEPARATOR = /([-'’])/g;

function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function capitalizeSegment(value: string): string {
  if (!value) return "";
  return value.charAt(0).toLocaleUpperCase(ITALIAN_LOCALE) + value.slice(1).toLocaleLowerCase(ITALIAN_LOCALE);
}

function capitalizeToken(token: string): string {
  return token
    .split(NAME_SEGMENT_SEPARATOR)
    .map((part) => {
      if (!part) return "";
      if (part === "-" || part === "'" || part === "’") return part;
      return capitalizeSegment(part);
    })
    .join("");
}

export function normalizePersonName(value: string): string {
  const compact = normalizeWhitespace(value);
  if (!compact) return "";
  return compact.split(" ").map(capitalizeToken).join(" ");
}
