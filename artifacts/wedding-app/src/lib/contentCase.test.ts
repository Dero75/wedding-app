import { describe, expect, it } from "vitest";
import { normalizeAdminContentValue } from "@/lib/contentCase";

describe("normalizeAdminContentValue", () => {
  it("normalizes sentence fields using canonical casing", () => {
    expect(normalizeAdminContentValue("ctaRSVP", "  CONFERMA LA TUA presenza ")).toBe(
      "Conferma la tua presenza",
    );
    expect(normalizeAdminContentValue("outfitText", "VI IMMAGINIAMO\nMAGARI IN LINO")).toBe(
      "Vi immaginiamo\nMagari in lino",
    );
  });

  it("normalizes title/address fields and keeps acronyms uppercase", () => {
    expect(normalizeAdminContentValue("outfitTitle", "outfit CONSIGLIATO")).toBe("Outfit Consigliato");
    expect(normalizeAdminContentValue("ceremonyAddress", "via santo stefano 16, 40125 bologna")).toBe(
      "Via Santo Stefano 16, 40125 Bologna",
    );
    expect(normalizeAdminContentValue("detailsGiftButtonLabel", "contributo iban")).toBe(
      "Contributo IBAN",
    );
  });

  it("keeps identity keys unchanged except compact spaces", () => {
    expect(normalizeAdminContentValue("ceremonyTime", " 18:30 ")).toBe("18:30");
  });
});

