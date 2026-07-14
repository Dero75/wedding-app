import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const createStoredRsvp = (id: string, firstName: string, submittedAt: string) => ({
  id,
  firstName,
  lastName: "Test",
  attending: true,
  guestCount: 1,
  childrenCount: 0,
  dietaryCounts: { vegetarian: 0, celiac: 0 },
  submittedAt,
});

describe("runtime sections are always active", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("keeps user topbar minimal without dropdown menu and hides redundant home label", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        showGiftSection: false,
        showEntrancePass: false,
      }),
    );

    window.history.pushState({}, "", "/home");

    render(<App />);

    expect(screen.queryByTestId("button-menu-toggle")).not.toBeInTheDocument();
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-hidden-admin-access")).toHaveAttribute(
      "aria-label",
      "Accedi ad admin",
    );
  });

  it("opens admin from hidden home switch only after valid PIN and keeps session unlocked", async () => {
    window.history.pushState({}, "", "/home");
    render(<App />);

    fireEvent.click(screen.getByTestId("button-hidden-admin-access"));
    expect(screen.getByTestId("modal-admin-pin")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-admin-pin"), {
      target: { value: "0000" },
    });
    fireEvent.click(screen.getByTestId("button-submit-admin-pin"));
    expect(screen.getByText("PIN non corretto.")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-admin-pin"), {
      target: { value: "2015" },
    });
    fireEvent.click(screen.getByTestId("button-submit-admin-pin"));

    await waitFor(() => {
      expect(screen.getByText("Gestione Invitati")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("button-user-switch-topbar"));
    await waitFor(() => {
      expect(screen.getByTestId("button-hidden-admin-access")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("button-hidden-admin-access"));
    expect(screen.queryByTestId("modal-admin-pin")).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Gestione Invitati")).toBeInTheDocument();
    });
  });

  it("uses the native PIN input without rendering a custom keypad", async () => {
    window.history.pushState({}, "", "/home");
    render(<App />);

    fireEvent.click(screen.getByTestId("button-hidden-admin-access"));

    expect(screen.queryByLabelText("Tastierino PIN")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-pin-digit-2")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-admin-pin"), {
      target: { value: "2015" },
    });

    expect(screen.getByTestId("input-admin-pin")).toHaveValue("2015");
    fireEvent.click(screen.getByTestId("button-submit-admin-pin"));

    await waitFor(() => {
      expect(screen.getByText("Gestione Invitati")).toBeInTheDocument();
    });
  });

  it("keeps /gift route available even with legacy disabled flags in storage", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        showGiftSection: false,
      }),
    );
    window.history.pushState({}, "", "/gift");

    render(<App />);

    expect(screen.getByText("Un pensiero per noi")).toBeInTheDocument();
  });

  it("keeps /pass route available even with legacy disabled flags in storage", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        showEntrancePass: false,
      }),
    );
    window.history.pushState({}, "", "/pass");

    render(<App />);

    expect(screen.getByText("Conferma la tua presenza")).toBeInTheDocument();
  });

  it("does not render visibility section block in admin settings", () => {
    window.history.pushState({}, "", "/admina/settings");
    render(<App />);

    expect(screen.getAllByText("Ora cerimonia").length).toBeGreaterThan(0);
    expect(screen.queryByText("Stile dell'app")).not.toBeInTheDocument();
    expect(screen.queryByText("Visibilità sezioni")).not.toBeInTheDocument();
    expect(screen.queryByText("Testi e contenuti")).not.toBeInTheDocument();
  });

  it("hides hamburger menu on admin routes", () => {
    window.history.pushState({}, "", "/admina/settings");
    render(<App />);

    expect(screen.queryByTestId("button-menu-toggle")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-admin-home-topbar")).toBeInTheDocument();
    expect(screen.getByTestId("button-user-switch-topbar")).toHaveAttribute("href", "/home");
    expect(screen.queryByText("Torna alla gestione")).not.toBeInTheDocument();
  });

  it("does not flag pre-existing RSVPs as new on first admin access", () => {
    // Prima apertura su questo dispositivo: le conferme già presenti NON devono
    // comparire come nuove (nessun badge fantasma).
    localStorage.setItem(
      "wedding_rsvps",
      JSON.stringify([
        createStoredRsvp("rsvp-1", "Anna", "2026-04-08T08:00:00.000Z"),
        createStoredRsvp("rsvp-2", "Luca", "2026-04-08T09:00:00.000Z"),
      ]),
    );
    window.history.pushState({}, "", "/admina");

    render(<App />);

    expect(screen.queryByTestId("badge-admin-notifications-count")).not.toBeInTheDocument();
  });

  it("flags only RSVPs newer than the last-seen mark and clears on click", () => {
    // Dispositivo che ha già visto tutto fino a una certa data.
    localStorage.setItem(
      "wedding_admin_rsvp_last_seen_at",
      "2026-04-08T09:30:00.000Z",
    );
    localStorage.setItem(
      "wedding_rsvps",
      JSON.stringify([
        createStoredRsvp("rsvp-1", "Anna", "2026-04-08T08:00:00.000Z"), // vista
        createStoredRsvp("rsvp-2", "Luca", "2026-04-08T09:00:00.000Z"), // vista
        createStoredRsvp("rsvp-3", "Marta", "2026-04-08T10:00:00.000Z"), // nuova
      ]),
    );
    window.history.pushState({}, "", "/admina");

    render(<App />);

    expect(screen.getByTestId("badge-admin-notifications-count")).toHaveTextContent("1");
    fireEvent.click(screen.getByTestId("button-admin-notifications-topbar"));
    expect(screen.queryByTestId("badge-admin-notifications-count")).not.toBeInTheDocument();
  });
});
