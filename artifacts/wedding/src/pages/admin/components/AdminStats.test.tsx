import React from "react";
import { render, screen } from "@testing-library/react";
import AdminStats from "./AdminStats";

describe("AdminStats", () => {
  it("renders updated labels and values", () => {
    render(<AdminStats totalResponses={50} confirmedAdults={96} withDietaryFlagsCount={7} />);

    expect(screen.getByText("Risposte")).toBeInTheDocument();
    expect(screen.getByText("Confermati")).toBeInTheDocument();
    expect(screen.getByText("Con diete")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
});
