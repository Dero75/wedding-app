import React from "react";
import { render, screen } from "@testing-library/react";
import AdminStats from "./AdminStats";

describe("AdminStats", () => {
  it("renders the two summary boxes for adults and under 18", () => {
    render(<AdminStats adultsCount={96} under18Count={14} />);

    expect(screen.getByText("Adulti")).toBeInTheDocument();
    expect(screen.getByText("Under 18")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.queryByText("Risposte")).not.toBeInTheDocument();
    expect(screen.queryByText("Con diete")).not.toBeInTheDocument();
  });
});
