import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App routing", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders intro screen on root route", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByTestId("screen-intro")).toBeInTheDocument();
  });

  it("renders home on root route after intro was completed in the same session", () => {
    window.history.pushState({}, "", "/");
    sessionStorage.setItem("wedding_intro_completed", "1");

    render(<App />);

    expect(screen.queryByTestId("screen-intro")).not.toBeInTheDocument();
    expect(screen.getByTestId("button-cta-details")).toBeInTheDocument();
  });
});
