import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import { DEFAULT_ADMIN_SETTINGS, saveAdminSettings } from "@/lib/storage";

describe("admin visibility toggles affect runtime", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("hides gift and pass links in nav when disabled", () => {
    saveAdminSettings({
      ...DEFAULT_ADMIN_SETTINGS,
      showGiftSection: false,
      showEntrancePass: false,
    });
    window.history.pushState({}, "", "/home");

    render(<App />);

    fireEvent.click(screen.getByTestId("button-menu-toggle"));

    expect(screen.queryByTestId("link-nav-regalo")).not.toBeInTheDocument();
    expect(screen.queryByTestId("link-nav-invito")).not.toBeInTheDocument();
  });

  it("blocks direct /gift when gift visibility is disabled", () => {
    saveAdminSettings({
      ...DEFAULT_ADMIN_SETTINGS,
      showGiftSection: false,
    });
    window.history.pushState({}, "", "/gift");

    render(<App />);

    expect(screen.getByText("Pagina non trovata")).toBeInTheDocument();
  });

  it("blocks direct /pass when pass visibility is disabled", () => {
    saveAdminSettings({
      ...DEFAULT_ADMIN_SETTINGS,
      showEntrancePass: false,
    });
    window.history.pushState({}, "", "/pass");

    render(<App />);

    expect(screen.getByText("Pagina non trovata")).toBeInTheDocument();
  });
});

