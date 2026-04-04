import React from "react";
import { render, screen } from "@testing-library/react";
import AdminStats from "./AdminStats";

describe("AdminStats", () => {
  it("renders only the centered confirmed stat", () => {
    render(<AdminStats confirmedAdults={96} />);

    expect(screen.getByText("Confermati")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.queryByText("Risposte")).not.toBeInTheDocument();
    expect(screen.queryByText("Con diete")).not.toBeInTheDocument();
  });
});
