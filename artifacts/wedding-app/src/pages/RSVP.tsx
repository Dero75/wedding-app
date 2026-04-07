import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { createDefaultDietaryCounts } from "@/config/rsvp";
import { generateId, getMyRSVP, saveMyRSVP, type RSVPEntry } from "@/lib/storage";
import RsvpConfirmationView from "@/pages/rsvp/components/RsvpConfirmationView";
import RsvpForm from "@/pages/rsvp/components/RsvpForm";
import { rsvpSchema, type RSVPFormData } from "@/pages/rsvp/schema";

export default function RSVP() {
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(() => getMyRSVP());
  const [editing, setEditing] = useState(false);

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      firstName: submitted?.firstName ?? "",
      lastName: submitted?.lastName ?? "",
      guestCount: submitted?.guestCount ?? 1,
      childrenCount: submitted?.childrenCount ?? 0,
      dietaryCounts: submitted?.dietaryCounts ?? createDefaultDietaryCounts(),
    },
  });

  useEffect(() => {
    if (!editing || !submitted) return;
    form.reset({
      firstName: submitted.firstName,
      lastName: submitted.lastName,
      guestCount: submitted.guestCount,
      childrenCount: submitted.childrenCount,
      dietaryCounts: submitted.dietaryCounts,
    });
  }, [editing, submitted, form]);

  const onSubmit = (data: RSVPFormData) => {
    const entry: RSVPEntry = {
      id: submitted?.id ?? generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      guestCount: data.guestCount,
      childrenCount: data.childrenCount,
      dietaryCounts: data.dietaryCounts,
      submittedAt: new Date().toISOString(),
    };

    saveMyRSVP(entry);
    setSubmitted(entry);
    setEditing(false);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // jsdom does not implement smooth scrolling
    }
  };

  const showForm = !submitted || editing;

  return (
    <Layout>
      <PageContainer>
        <SectionTitle title="Conferma la tua presenza" />

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
