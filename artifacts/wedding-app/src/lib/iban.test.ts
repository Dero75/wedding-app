import { describe, expect, it } from "vitest";
import { formatIban, formatIbanForDisplay } from "@/lib/iban";

describe("formatIban", () => {
  it("formats iban in compact uppercase format without spaces", () => {
    expect(formatIban("it60x0542811101000000123456")).toBe("IT60X0542811101000000123456");
  });

  it("removes non alphanumeric characters", () => {
    expect(formatIban("IT60-X054 2811.1010/0000:0123,456")).toBe("IT60X0542811101000000123456");
  });

  it("formats iban for readable mobile display without changing copy value", () => {
    expect(formatIbanForDisplay("it05s03015032000000005118226")).toBe(
      "IT05 S030 1503 2000 0000 0511 8226",
    );
  });
});
