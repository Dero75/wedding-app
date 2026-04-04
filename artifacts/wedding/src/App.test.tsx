import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App routing", () => {
  it("renders intro screen on root route", () => {
    window.history.pushState({}, "", "/");

    render(<App />);

    expect(screen.getByTestId("screen-intro")).toBeInTheDocument();
  });
});
