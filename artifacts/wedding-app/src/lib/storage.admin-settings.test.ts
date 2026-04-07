import {
  clearLegacyAdminSettingsSnapshot,
  getContent,
  getMyRSVP,
  getRSVPs,
  saveContent,
} from "@/lib/storage";

describe("storage sanitization", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("removes legacy admin settings snapshot", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        randomLegacyKey: "legacy",
        showGiftSection: false,
      }),
    );

    clearLegacyAdminSettingsSnapshot();
    expect(localStorage.getItem("wedding_admin_settings")).toBeNull();
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

    expect(content.weddingTime).toBe("16:00");
    expect(saved).not.toHaveProperty("hashtag");
  });

  it("keeps legacy declined entries from RSVP storage", () => {
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

    expect(rsvps).toHaveLength(2);
    expect(rsvps[0]?.firstName).toBe("Mario");
    expect(rsvps[0]?.lastName).toBe("Rossi");
    expect(rsvps[0]?.attending).toBe(true);
    expect(rsvps[0]?.dietaryCounts).toEqual({ vegetarian: 0, celiac: 1 });
    expect(rsvps[1]?.firstName).toBe("Luigi");
    expect(rsvps[1]?.lastName).toBe("Bianchi");
    expect(rsvps[1]?.attending).toBe(false);
  });

  it("keeps legacy my_rsvp with attending=false and marks it as non participant", () => {
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

    const myRsvp = getMyRSVP();
    expect(myRsvp).not.toBeNull();
    expect(myRsvp?.attending).toBe(false);
  });

  it("normalizes first name and surname with capital initials", () => {
    localStorage.setItem(
      "wedding_rsvps",
      JSON.stringify([
        {
          id: "cap-1",
          firstName: "davide",
          lastName: "de rose",
          attending: true,
          guestCount: 1,
          childrenCount: 0,
          dietaryCounts: { vegetarian: 0, celiac: 0 },
          submittedAt: "2026-04-08T09:00:00.000Z",
        },
      ]),
    );

    const rsvps = getRSVPs();
    expect(rsvps[0]?.firstName).toBe("Davide");
    expect(rsvps[0]?.lastName).toBe("De Rose");
  });

  it("formats IBAN with standard spacing when saving content", () => {
    const current = getContent();
    saveContent({
      ...current,
      giftIBAN: "it60x0542811101000000123456",
    });

    expect(getContent().giftIBAN).toBe("IT60X0542811101000000123456");
  });
});
