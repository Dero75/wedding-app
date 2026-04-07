import { describe, expect, it } from "vitest";
import { normalizePersonName } from "@/lib/personName";

describe("normalizePersonName", () => {
  it("capitalizes composed names with spaces", () => {
    expect(normalizePersonName("davide de rose")).toBe("Davide De Rose");
    expect(normalizePersonName("annamaria francavilla")).toBe("Annamaria Francavilla");
    expect(normalizePersonName("diego de rose casale")).toBe("Diego De Rose Casale");
  });

  it("normalizes apostrophes and hyphens", () => {
    expect(normalizePersonName("d'avila")).toBe("D'Avila");
    expect(normalizePersonName("maria-luisa de-rose")).toBe("Maria-Luisa De-Rose");
  });

  it("compacts duplicated whitespace", () => {
    expect(normalizePersonName("  davide   de   rose  ")).toBe("Davide De Rose");
  });
});
