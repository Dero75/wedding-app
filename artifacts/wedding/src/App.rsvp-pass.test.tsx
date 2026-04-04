import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

describe("RSVP confirm-only flow and pass gating", () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window, "scrollTo", {
      value: vi.fn(),
      writable: true,
    });
  });

  it("submits and edits RSVP without decline choice", async () => {
    window.history.pushState({}, "", "/rsvp");
    render(<App />);

    expect(screen.queryByTestId("radio-attending-yes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("radio-attending-no")).not.toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-full-name"), {
      target: { value: "Mario Rossi" },
    });
    fireEvent.change(screen.getByTestId("select-guest-count"), {
      target: { value: "2" },
    });
    fireEvent.click(screen.getByTestId("toggle-dietary-celiac"));
    fireEvent.click(screen.getByTestId("button-submit-rsvp"));

    expect(await screen.findByText("Grazie, Mario Rossi!")).toBeInTheDocument();
    expect(screen.getByText("Conferma")).toBeInTheDocument();
    expect(screen.getByText("Registrata ✓")).toBeInTheDocument();
    expect(screen.getByText("Celiaco")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-edit-rsvp"));
    expect(screen.getByTestId("input-full-name")).toBeInTheDocument();
  });

  it("shows pass only when a confirmation exists", () => {
    window.history.pushState({}, "", "/pass");
    const { unmount } = render(<App />);

    expect(screen.queryByTestId("card-entrance-pass")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-go-rsvp")).toBeInTheDocument();

    unmount();

    localStorage.setItem(
      "wedding_my_rsvp",
      JSON.stringify({
        id: "ok-1",
        fullName: "Giulia Verdi",
        guestCount: 2,
        dietaryFlags: ["vegetarian"],
        submittedAt: new Date().toISOString(),
      }),
    );
    localStorage.setItem(
      "wedding_rsvps",
      JSON.stringify([
        {
          id: "ok-1",
          fullName: "Giulia Verdi",
          guestCount: 2,
          dietaryFlags: ["vegetarian"],
          submittedAt: new Date().toISOString(),
        },
      ]),
    );

    window.history.pushState({}, "", "/pass");
    render(<App />);

    expect(screen.getByTestId("card-entrance-pass")).toBeInTheDocument();
    expect(screen.queryByTestId("button-go-rsvp")).not.toBeInTheDocument();
  });
});
