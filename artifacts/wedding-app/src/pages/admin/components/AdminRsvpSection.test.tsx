import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import AdminRsvpSection from "@/pages/admin/components/AdminRsvpSection";
import type { RSVPEntry } from "@/lib/storage";

const sampleRsvp: RSVPEntry = {
  id: "rsvp-1",
  firstName: "Davide",
  lastName: "De Rose",
  attending: true,
  guestCount: 2,
  childrenCount: 1,
  dietaryCounts: { vegetarian: 0, celiac: 1 },
  submittedAt: "2026-04-08T08:00:00.000Z",
};

describe("AdminRsvpSection", () => {
  it("deletes an invitee only after double confirmation", async () => {
    const onDeleteRsvp = vi.fn(async () => {});
    const onUpdateRsvp = vi.fn(async () => {});

    render(
      <AdminRsvpSection
        rsvps={[sampleRsvp]}
        onDeleteRsvp={onDeleteRsvp}
        onUpdateRsvp={onUpdateRsvp}
      />,
    );

    fireEvent.click(screen.getByTestId("button-delete-rsvp-rsvp-1"));
    expect(screen.getByTestId("modal-delete-rsvp-step-1")).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("button-delete-rsvp-continue"));
    expect(screen.getByTestId("modal-delete-rsvp-step-2")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-delete-rsvp-confirm"));
    });

    await waitFor(() => {
      expect(onDeleteRsvp).toHaveBeenCalledTimes(1);
    });
    expect(onDeleteRsvp).toHaveBeenCalledWith("rsvp-1");
  });

  it("opens edit modal from card click and saves updated RSVP data", async () => {
    const onDeleteRsvp = vi.fn(async () => {});
    const onUpdateRsvp = vi.fn(async () => {});

    render(
      <AdminRsvpSection
        rsvps={[sampleRsvp]}
        onDeleteRsvp={onDeleteRsvp}
        onUpdateRsvp={onUpdateRsvp}
      />,
    );

    fireEvent.click(screen.getByTestId("card-rsvp-rsvp-1"));
    expect(screen.getByTestId("modal-edit-rsvp")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("input-edit-rsvp-first-name"), {
      target: { value: "gloria" },
    });
    fireEvent.change(screen.getByTestId("select-edit-rsvp-guest-count"), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByTestId("select-edit-rsvp-dietary-vegetarian"), {
      target: { value: "1" },
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("button-save-edit-rsvp"));
    });

    await waitFor(() => {
      expect(onUpdateRsvp).toHaveBeenCalledTimes(1);
    });
    expect(onUpdateRsvp).toHaveBeenCalledWith({
      ...sampleRsvp,
      firstName: "Gloria",
      guestCount: 3,
      dietaryCounts: { vegetarian: 1, celiac: 1 },
    });
  });
});
