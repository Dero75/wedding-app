import React from "react";
import { render, screen } from "@testing-library/react";
import AdminStats from "./AdminStats";

describe("AdminStats", () => {
  it("renders the five summary boxes including dietary totals", () => {
    render(
      <AdminStats
        adultsCount={96}
        under18Count={14}
        notConfirmedCount={3}
        vegetarianCount={5}
        celiacCount={2}
      />,
    );

    expect(screen.getByText("Adulti")).toBeInTheDocument();
    expect(screen.getByText("Minorenni")).toBeInTheDocument();
    expect(screen.getByText("Assenti")).toBeInTheDocument();
    expect(screen.getByText("Vegetariani")).toBeInTheDocument();
    expect(screen.getByText("Celiaci")).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.getByText("14")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.queryByText("Risposte")).not.toBeInTheDocument();
    expect(screen.queryByText("Con diete")).not.toBeInTheDocument();
  });
});
