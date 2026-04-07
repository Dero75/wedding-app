import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import Layout from "@/components/Layout";
import PageContainer from "@/components/PageContainer";
import SectionTitle from "@/components/SectionTitle";
import { createDefaultDietaryCounts } from "@/config/rsvp";
import { generateId, getMyRSVP, saveMyRSVP, type RSVPEntry } from "@/lib/storage";
import { normalizePersonName } from "@/lib/personName";
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
  const [submitted, setSubmitted] = useState<RSVPEntry | null>(() => getMyRSVP());
  const [editing, setEditing] = useState(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<RSVPFormData | null>(null);
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isDownloadingInvite, setIsDownloadingInvite] = useState(false);

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      firstName: submitted?.firstName ?? "",
      lastName: submitted?.lastName ?? "",
      guestCount: submitted?.attending === false ? 1 : (submitted?.guestCount ?? 1),
      childrenCount: submitted?.childrenCount ?? 0,
      dietaryCounts: submitted?.dietaryCounts ?? createDefaultDietaryCounts(),
    },
  });

  useEffect(() => {
    if (!editing || !submitted) return;
    form.reset({
      firstName: submitted.firstName,
      lastName: submitted.lastName,
      guestCount: submitted.attending === false ? 1 : submitted.guestCount,
      childrenCount: submitted.childrenCount,
      dietaryCounts: submitted.dietaryCounts,
    });
  }, [editing, submitted, form]);

  const confirmAttendanceSubmit = (data: RSVPFormData) => {
    const entry: RSVPEntry = {
      id: submitted?.id ?? generateId(),
      firstName: data.firstName,
      lastName: data.lastName,
      attending: true,
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

  const onSubmit = (data: RSVPFormData) => {
    setPendingConfirmation(data);
    setShowSubmitConfirmModal(true);
  };

  const onDecline = async (rawFirstName: string, rawLastName: string) => {
    const firstName = normalizePersonName(rawFirstName);
    const lastName = normalizePersonName(rawLastName);
    const hasNames = await form.trigger(["firstName", "lastName"]);
    if (!hasNames || !firstName || !lastName) return;

    const entry: RSVPEntry = {
      id: submitted?.id ?? generateId(),
      firstName,
      lastName,
      attending: false,
      guestCount: 1,
      childrenCount: 0,
      dietaryCounts: createDefaultDietaryCounts(),
      submittedAt: new Date().toISOString(),
    };

    saveMyRSVP(entry);
    setSubmitted(entry);
    setEditing(false);
    setShowInviteModal(false);
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

      // Intro-like background
      ctx.fillStyle = "#3D2B1F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const radial = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        120,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.58,
      );
      radial.addColorStop(0, "rgba(107,76,59,0.82)");
      radial.addColorStop(1, "rgba(61,43,31,0)");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      const centerX = canvas.width / 2;
      const dateY = 520;
      const cityY = 1260;

      // Date row
      ctx.strokeStyle = "rgba(201,185,154,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 360, dateY - 12);
      ctx.lineTo(centerX - 170, dateY - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + 170, dateY - 12);
      ctx.lineTo(centerX + 360, dateY - 12);
      ctx.stroke();

      ctx.fillStyle = "rgba(201,185,154,0.6)";
      ctx.font = '500 38px "Jost", sans-serif';
      ctx.fillText(FIXED_WEDDING_DATE_LABEL.toUpperCase(), centerX, dateY);

      // Names block
      ctx.fillStyle = "#F8EFE3";
      ctx.font = '500 96px "Cormorant Garamond", serif';
      ctx.fillText(FIXED_BRIDE_NAME, centerX, 760);
      ctx.font = '500 56px "Cormorant Garamond", serif';
      ctx.fillStyle = "rgba(201,185,154,0.85)";
      ctx.fillText("&", centerX, 870);
      ctx.font = '500 96px "Cormorant Garamond", serif';
      ctx.fillStyle = "#F8EFE3";
      ctx.fillText(FIXED_GROOM_NAME, centerX, 980);

      // City row
      ctx.strokeStyle = "rgba(201,185,154,0.6)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(centerX - 300, cityY - 12);
      ctx.lineTo(centerX - 110, cityY - 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + 110, cityY - 12);
      ctx.lineTo(centerX + 300, cityY - 12);
      ctx.stroke();

      ctx.fillStyle = "rgba(201,185,154,0.6)";
      ctx.font = '500 38px "Jost", sans-serif';
      ctx.fillText(FIXED_WEDDING_CITY.toUpperCase(), centerX, cityY);

      ctx.fillStyle = "rgba(201,185,154,0.65)";
      ctx.font = '400 30px "Jost", sans-serif';
      ctx.fillText("Invito da presentare a Palazzo Isolani.", centerX, 1740);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });
      if (!blob) return;

      const fileName = "invito-palazzo-isolani";
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
        <SectionTitle
          title={
            showForm
              ? "Conferma la tua presenza"
              : submitted?.attending === false
                ? "Risposta registrata"
                : "Presenza Confermata!"
          }
          titleClassName={showForm ? "text-[#6f8f4a]" : ""}
        />

        {!showForm && submitted && (
          <RsvpConfirmationView submitted={submitted} onEdit={() => setEditing(true)} />
        )}

        {showForm && (
          <RsvpForm
            form={form}
            editing={editing}
            onCancelEdit={() => setEditing(false)}
            onSubmit={onSubmit}
            onDecline={onDecline}
          />
        )}

        {showInviteModal && submitted?.attending && (
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
              <h3 className="font-serif text-3xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Grazie!
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Invito da presentare a Palazzo Isolani.
              </p>

              <button
                type="button"
                onClick={handleDownloadInvite}
                disabled={isDownloadingInvite}
                className="w-full inline-flex items-center justify-center rounded-full border border-primary-border bg-primary px-5 py-3 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity disabled:opacity-70"
              >
                <Download size={14} className="mr-2" />
                {isDownloadingInvite ? "Preparazione invito..." : "SCARICA INVITO"}
              </button>
            </div>
          </div>
        )}

        {showSubmitConfirmModal && pendingConfirmation && (
          <div
            className="fixed inset-0 z-[75] bg-foreground/30 backdrop-blur-sm px-5 flex items-center justify-center"
            onClick={() => {
              setShowSubmitConfirmModal(false);
              setPendingConfirmation(null);
            }}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl text-center"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Conferma invio presenza"
              data-testid="modal-submit-confirm-rsvp"
            >
              <h3 className="font-serif text-3xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
                Confermi la presenza?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                Procediamo a registrare la tua conferma.
              </p>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-border bg-white px-4 py-3 text-xs uppercase tracking-wider text-foreground hover:opacity-95 transition-opacity"
                  onClick={() => {
                    setShowSubmitConfirmModal(false);
                    setPendingConfirmation(null);
                  }}
                >
                  Annulla
                </button>
                <button
                  type="button"
                  data-testid="button-confirm-submit-rsvp"
                  className="flex-1 inline-flex items-center justify-center rounded-full border border-primary-border bg-primary px-4 py-3 text-xs uppercase tracking-wider text-primary-foreground hover:opacity-95 transition-opacity"
                  onClick={() => {
                    confirmAttendanceSubmit(pendingConfirmation);
                    setShowSubmitConfirmModal(false);
                    setPendingConfirmation(null);
                  }}
                >
                  Conferma
                </button>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </Layout>
  );
}
