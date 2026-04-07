import { describe, expect, it } from "vitest";
import { formatIban } from "@/lib/iban";

describe("formatIban", () => {
  it("formats iban in compact uppercase format without spaces", () => {
    expect(formatIban("it60x0542811101000000123456")).toBe("IT60X0542811101000000123456");
  });

  it("removes non alphanumeric characters", () => {
    expect(formatIban("IT60-X054 2811.1010/0000:0123,456")).toBe("IT60X0542811101000000123456");
  });
});
