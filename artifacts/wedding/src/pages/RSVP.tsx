import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { FIXED_WEDDING_DATE_LABEL } from "@/config/event";
import { generateId, getMyRSVP, saveMyRSVP, type RSVPEntry } from "@/lib/storage";
import RsvpConfirmationView from "@/pages/rsvp/components/RsvpConfirmationView";
import RsvpForm from "@/pages/rsvp/components/RsvpForm";
import { rsvpSchema, type RSVPFormData } from "@/pages/rsvp/schema";

export default function RSVP() {
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(null);
  const [editing, setEditing] = useState(false);

  const saved = getMyRSVP();

  useEffect(() => {
    if (saved && !editing) {
      setSubmitted(saved);
    }
  }, [editing, saved]);

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      fullName: saved?.fullName ?? "",
      attending: saved ? (saved.attending ? "yes" : "no") : undefined,
      guestCount: saved?.guestCount ?? 1,
      dietaryNotes: saved?.dietaryNotes ?? "",
      message: saved?.message ?? "",
    },
  });

  const onSubmit = (data: RSVPFormData) => {
    const entry: RSVPEntry = {
      id: saved?.id ?? generateId(),
      fullName: data.fullName,
      attending: data.attending === "yes",
      guestCount: data.guestCount,
      dietaryNotes: data.dietaryNotes ?? "",
      message: data.message ?? "",
      submittedAt: new Date().toISOString(),
    };

    saveMyRSVP(entry);
    setSubmitted(entry);
    setEditing(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showForm = !submitted || editing;

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Conferma la tua presenza" subtitle="RSVP" />

        <p className="text-center text-sm text-muted-foreground mb-8">
          Rispondi entro il{" "}
          <strong style={{ color: "hsl(var(--foreground))" }}>{FIXED_WEDDING_DATE_LABEL}</strong>
        </p>

        {!showForm && submitted && (
          <RsvpConfirmationView submitted={submitted} onEdit={() => setEditing(true)} />
        )}

        {showForm && (
          <RsvpForm
            form={form}
            editing={editing}
            onCancelEdit={() => setEditing(false)}
            onSubmit={onSubmit}
          />
        )}
      </PageContainer>
    </Layout>
  );
}
