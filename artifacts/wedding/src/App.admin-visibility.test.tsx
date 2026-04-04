import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

describe("runtime sections are always active", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("always shows gift and pass links in nav", () => {
    localStorage.setItem(
      "wedding_admin_settings",
      JSON.stringify({
        showGiftSection: false,
        showEntrancePass: false,
      }),
    );

    window.history.pushState({}, "", "/home");

    render(<App />);

    fireEvent.click(screen.getByTestId("button-menu-toggle"));

    expect(screen.getByTestId("link-nav-regalo")).toBeInTheDocument();
    expect(screen.getByTestId("link-nav-invito")).toBeInTheDocument();
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
    window.history.pushState({}, "", "/admin/settings");
    render(<App />);

    expect(screen.getAllByText("Ora cerimonia").length).toBeGreaterThan(0);
    expect(screen.queryByText("Stile dell'app")).not.toBeInTheDocument();
    expect(screen.queryByText("Visibilità sezioni")).not.toBeInTheDocument();
    expect(screen.queryByText("Testi e contenuti")).not.toBeInTheDocument();
  });

  it("hides hamburger menu on admin routes", () => {
    window.history.pushState({}, "", "/admin/settings");
    render(<App />);

    expect(screen.queryByTestId("button-menu-toggle")).not.toBeInTheDocument();
  });
});
