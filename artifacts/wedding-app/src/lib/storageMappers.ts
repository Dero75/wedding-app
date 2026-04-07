import { formatIban } from "@/lib/iban";
import { sanitizeRsvpEntry } from "@/lib/storageRsvpSanitizer";
import type { DbContentRow, DbRsvpRow, EditableContent, RSVPEntry } from "@/lib/storageTypes";
import { DEFAULT_CONTENT } from "@/lib/storageTypes";

export function mapDbContentRow(row: DbContentRow): EditableContent {
  if (!row) return DEFAULT_CONTENT;
  const source = row as Record<string, unknown>;
  const mapped: Partial<Record<keyof EditableContent, unknown>> = {
    introTagline: source.intro_tagline,
    heroSubtitle: source.hero_subtitle,
    weddingTime: source.wedding_time,
    weddingLocation: source.wedding_location,
    weddingAddress: source.wedding_address,
    welcomeTitle: source.welcome_title,
    welcomeText: source.welcome_text,
    ctaRSVP: source.cta_rsvp,
    ctaDetails: source.cta_details,
    ceremonyPlace: source.ceremony_place,
    ceremonyTime: source.ceremony_time,
    ceremonyAddress: source.ceremony_address,
    ceremonyNote: source.ceremony_note,
    receptionPlace: source.reception_place,
    receptionTime: source.reception_time,
    receptionAddress: source.reception_address,
    receptionNote: source.reception_note,
    detailsGiftTitle: source.details_gift_title,
    detailsGiftSubtitle: source.details_gift_subtitle,
    detailsGiftButtonLabel: source.details_gift_button_label,
    giftTitle: source.gift_title,
    giftText: source.gift_text,
    giftIBAN: source.gift_iban,
    giftBIC: source.gift_bic,
    giftHolder: source.gift_holder,
    passTitle: source.pass_title,
    passSubtitle: source.pass_subtitle,
  };

  const safe: Partial<EditableContent> = {};
  for (const key of Object.keys(DEFAULT_CONTENT) as (keyof EditableContent)[]) {
    const value = mapped[key];
    if (typeof value === "string") safe[key] = value;
  }
  const normalized = { ...DEFAULT_CONTENT, ...safe };
  return {
    ...normalized,
    giftIBAN: formatIban(normalized.giftIBAN),
  };
}

export function toDbContentRow(content: EditableContent): Record<string, unknown> {
  return {
    id: 1,
    intro_tagline: content.introTagline,
    hero_subtitle: content.heroSubtitle,
    wedding_time: content.weddingTime,
    wedding_location: content.weddingLocation,
    wedding_address: content.weddingAddress,
    welcome_title: content.welcomeTitle,
    welcome_text: content.welcomeText,
    cta_rsvp: content.ctaRSVP,
    cta_details: content.ctaDetails,
    ceremony_place: content.ceremonyPlace,
    ceremony_time: content.ceremonyTime,
    ceremony_address: content.ceremonyAddress,
    ceremony_note: content.ceremonyNote,
    reception_place: content.receptionPlace,
    reception_time: content.receptionTime,
    reception_address: content.receptionAddress,
    reception_note: content.receptionNote,
    details_gift_title: content.detailsGiftTitle,
    details_gift_subtitle: content.detailsGiftSubtitle,
    details_gift_button_label: content.detailsGiftButtonLabel,
    gift_title: content.giftTitle,
    gift_text: content.giftText,
    gift_iban: content.giftIBAN,
    gift_bic: content.giftBIC,
    gift_holder: content.giftHolder,
    pass_title: content.passTitle,
    pass_subtitle: content.passSubtitle,
  };
}

export function mapDbRsvpRows(rows: DbRsvpRow[], generateId: () => string): RSVPEntry[] {
  return rows
    .map((row) => {
      if (!row) return null;
      const source = row as Record<string, unknown>;
      return sanitizeRsvpEntry(
        {
          id: source.id,
          firstName: source.first_name,
          lastName: source.last_name,
          attending: source.attending,
          guestCount: source.guest_count,
          childrenCount: source.children_count,
          dietaryCounts: source.dietary_counts,
          submittedAt: source.submitted_at,
        },
        generateId,
      ).entry;
    })
    .filter((entry): entry is RSVPEntry => entry !== null);
}

export function toDbRsvpRow(entry: RSVPEntry): Record<string, unknown> {
  return {
    id: entry.id,
    first_name: entry.firstName,
    last_name: entry.lastName,
    attending: entry.attending,
    guest_count: entry.guestCount,
    children_count: entry.childrenCount,
    dietary_counts: entry.dietaryCounts,
    submitted_at: entry.submittedAt,
  };
}
