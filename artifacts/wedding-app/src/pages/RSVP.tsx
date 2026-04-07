import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Ticket, X } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { createDefaultDietaryCounts } from "@/config/rsvp";
import { generateId, getMyRSVP, saveMyRSVP, type RSVPEntry } from "@/lib/storage";
import {
  FIXED_BRIDE_NAME,
  FIXED_GROOM_NAME,
  FIXED_WEDDING_CITY,
  FIXED_WEDDING_DATE_LABEL,
} from "@/config/event";
import RsvpConfirmationView from "@/pages/rsvp/components/RsvpConfirmationView";
import RsvpForm from "@/pages/rsvp/components/RsvpForm";
import { rsvpSchema, type RSVPFormData } from "@/pages/rsvp/schema";

export default function RSVP() {
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(() => getMyRSVP());
  const [editing, setEditing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isDownloadingInvite, setIsDownloadingInvite] = useState(false);

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
    setShowInviteModal(true);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      // jsdom does not implement smooth scrolling
    }
  };

  const handleDownloadInvite = async () => {
    if (!submitted) return;
    setIsDownloadingInvite(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#4A3728");
      gradient.addColorStop(1, "#6B4C3B");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "rgba(201,185,154,0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

      ctx.fillStyle = "rgba(201,185,154,0.72)";
      ctx.font = '500 40px "Jost", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("INVITO DIGITALE", canvas.width / 2, 180);

      ctx.fillStyle = "#F8EFE3";
      ctx.font = '500 96px "Cormorant Garamond", serif';
      ctx.fillText(FIXED_BRIDE_NAME, canvas.width / 2, 420);
      ctx.font = '500 56px "Cormorant Garamond", serif';
      ctx.fillStyle = "rgba(201,185,154,0.85)";
      ctx.fillText("&", canvas.width / 2, 510);
      ctx.font = '500 96px "Cormorant Garamond", serif';
      ctx.fillStyle = "#F8EFE3";
      ctx.fillText(FIXED_GROOM_NAME, canvas.width / 2, 620);

      const fullName = `${submitted.firstName} ${submitted.lastName}`.trim();
      ctx.fillStyle = "rgba(201,185,154,0.72)";
      ctx.font = '500 32px "Jost", sans-serif';
      ctx.fillText("OSPITE", canvas.width / 2, 830);
      ctx.fillStyle = "#F8EFE3";
      ctx.font = '500 58px "Cormorant Garamond", serif';
      ctx.fillText(fullName, canvas.width / 2, 910);

      ctx.fillStyle = "rgba(201,185,154,0.82)";
      ctx.font = '500 34px "Jost", sans-serif';
      ctx.fillText(`${FIXED_WEDDING_DATE_LABEL} 2026`, canvas.width / 2, 1120);
      ctx.fillText(FIXED_WEDDING_CITY, canvas.width / 2, 1180);

      ctx.fillStyle = "rgba(201,185,154,0.65)";
      ctx.font = '400 28px "Jost", sans-serif';
      ctx.fillText("Mostra questo invito all'ingresso del ricevimento", canvas.width / 2, 1700);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });
      if (!blob) return;

      const fileName = `invito-${submitted.firstName}-${submitted.lastName}`.replace(/\s+/g, "-").toLowerCase();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloadingInvite(false);
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

        {showInviteModal && submitted && (
          <div
            className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm px-5 flex items-center justify-center"
            onClick={() => setShowInviteModal(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl text-center"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Scarica invito digitale"
            >
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="p-1.5 rounded-full text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Chiudi finestra"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 className="font-serif text-3xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Invito pronto
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Scarica l&apos;invito e salvalo nella galleria del telefono: ti servirà per l&apos;ingresso al
                ricevimento.
              </p>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownloadInvite}
                  disabled={isDownloadingInvite}
                  className="w-full inline-flex items-center justify-center rounded-full border border-primary-border bg-primary px-5 py-3 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity disabled:opacity-70"
                >
                  <Download size={14} className="mr-2" />
                  {isDownloadingInvite ? "Preparazione invito..." : "Scarica invito"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setLocation("/pass");
                  }}
                  className="w-full inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-xs uppercase tracking-wider text-foreground hover:text-accent transition-colors"
                >
                  <Ticket size={14} className="mr-2" />
                  Apri pass digitale
                </button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
