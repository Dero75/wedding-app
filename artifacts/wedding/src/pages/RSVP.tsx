import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
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
      fullName: submitted?.fullName ?? "",
      guestCount: submitted?.guestCount ?? 1,
      childrenCount: submitted?.childrenCount ?? 0,
      dietaryFlags: submitted?.dietaryFlags ?? [],
    },
  });

  useEffect(() => {
    if (!editing || !submitted) return;
    form.reset({
      fullName: submitted.fullName,
      guestCount: submitted.guestCount,
      childrenCount: submitted.childrenCount,
      dietaryFlags: submitted.dietaryFlags,
    });
  }, [editing, submitted, form]);

  const onSubmit = (data: RSVPFormData) => {
    const entry: RSVPEntry = {
      id: submitted?.id ?? generateId(),
      fullName: data.fullName,
      guestCount: data.guestCount,
      childrenCount: data.childrenCount,
      dietaryFlags: data.dietaryFlags,
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
        <SectionTitle title="Conferma la tua presenza" subtitle="RSVP" />

        <p className="text-center text-sm text-muted-foreground mb-8">
          Le adesioni sono sempre aperte.
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
