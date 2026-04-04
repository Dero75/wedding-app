import {
  DEFAULT_ADMIN_SETTINGS,
  getAdminSettings,
  getContent,
  getMyRSVP,
  getRSVPs,
  saveAdminSettings,
} from "@/lib/storage";

describe("admin settings persistence", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("persists admin settings and reads them back", () => {
    const next = {
      ...DEFAULT_ADMIN_SETTINGS,
      stylePreset: "dark" as const,
      showCouplePhoto: false,
      showWelcomeSection: false,
      showGiftSection: false,
      showEntrancePass: false,
    };

    saveAdminSettings(next);

    expect(getAdminSettings()).toEqual(next);
  });

  it("sanitizes legacy blush preset to ivory", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        ...DEFAULT_ADMIN_SETTINGS,
        stylePreset: "blush",
      }),
    );

    expect(getAdminSettings().stylePreset).toBe("ivory");
  });

  it("removes deprecated content fields from localStorage snapshot", () => {
    localStorage.setItem(
      "wedding_content",
      JSON.stringify({
        brideName: "Deborah",
        hashtag: "#legacy",
      }),
    );

    const content = getContent();
    const saved = JSON.parse(localStorage.getItem("wedding_content") ?? "{}") as Record<
      string,
      unknown
    >;

    expect(content.brideName).toBe("Deborah");
    expect(saved).not.toHaveProperty("hashtag");
  });

  it("drops legacy declined entries from RSVP storage", () => {
    localStorage.setItem(
      "wedding_rsvps",
      JSON.stringify([
        {
          id: "ok-1",
          fullName: "Mario Rossi",
          attending: true,
          guestCount: 2,
          dietaryNotes: "Celiaco",
          message: "Messaggio legacy",
          submittedAt: "2026-04-04T10:00:00.000Z",
        },
        {
          id: "no-1",
          fullName: "Luigi Bianchi",
          attending: false,
          guestCount: 1,
          dietaryNotes: "",
          message: "",
          submittedAt: "2026-04-04T11:00:00.000Z",
        },
      ]),
    );

    const rsvps = getRSVPs();

    expect(rsvps).toHaveLength(1);
    expect(rsvps[0]?.fullName).toBe("Mario Rossi");
    expect((rsvps[0] as Record<string, unknown>).attending).toBeUndefined();
    expect(rsvps[0]?.dietaryFlags).toEqual(["celiac"]);
  });

  it("clears legacy my_rsvp with attending=false", () => {
    localStorage.setItem(
      "wedding_my_rsvp",
      JSON.stringify({
        id: "legacy-no",
        fullName: "Giulia Verdi",
        attending: false,
        guestCount: 1,
        dietaryNotes: "",
        message: "",
        submittedAt: "2026-04-04T10:00:00.000Z",
      }),
    );

    expect(getMyRSVP()).toBeNull();
    expect(localStorage.getItem("wedding_my_rsvp")).toBeNull();
  });
});
