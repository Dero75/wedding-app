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

    render(<AdminRsvpSection rsvps={[sampleRsvp]} onDeleteRsvp={onDeleteRsvp} />);

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
});
