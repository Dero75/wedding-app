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
import { toast } from "@/hooks/use-toast";

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
    if (data.guestCount < 1) {
      form.setError("guestCount", {
        type: "manual",
        message: "Inserisci almeno 1 adulto",
      });
      return;
    }
    const totalGuests = data.guestCount + data.childrenCount;
    const totalDietary = data.dietaryCounts.vegetarian + data.dietaryCounts.celiac;
    if (totalDietary > totalGuests) {
      form.setError("dietaryCounts", {
        type: "manual",
        message: "Vegetariani + Celiaci non puo superare il totale invitati",
      });
      return;
    }

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
    setShowInviteModal(false);
    if (!submitted) return;
    setIsDownloadingInvite(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 2340;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Intro-identical background
      ctx.fillStyle = "#3D2B1F";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const radial = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.height * 0.7,
      );
      radial.addColorStop(0, "#6B4C3B");
      radial.addColorStop(1, "#3D2B1F");
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.textAlign = "center";
      const centerX = canvas.width / 2;
      const dateY = Math.round(canvas.height * 0.355);
      const brideY = Math.round(canvas.height * 0.455);
      const andY = Math.round(canvas.height * 0.52);
      const groomY = Math.round(canvas.height * 0.615);
      const cityY = Math.round(canvas.height * 0.69);
      const footerY = Math.round(canvas.height * 0.93);
      const rowLineWidth = 132;
      const rowGap = 34;

      // Date row
      ctx.strokeStyle = "rgba(201,185,154,0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - rowGap - rowLineWidth, dateY - 11);
      ctx.lineTo(centerX - rowGap, dateY - 11);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + rowGap, dateY - 11);
      ctx.lineTo(centerX + rowGap + rowLineWidth, dateY - 11);
      ctx.stroke();

      ctx.fillStyle = "rgba(201,185,154,0.6)";
      ctx.font = '500 34px "Jost", sans-serif';
      ctx.fillText(FIXED_WEDDING_DATE_LABEL.toUpperCase(), centerX, dateY);

      // Names block
      ctx.fillStyle = "#F8EFE3";
      ctx.font = '500 126px "Cormorant Garamond", serif';
      ctx.fillText(FIXED_BRIDE_NAME, centerX, brideY);
      ctx.font = '500 62px "Cormorant Garamond", serif';
      ctx.fillStyle = "rgba(201,185,154,0.85)";
      ctx.fillText("&", centerX, andY);
      ctx.font = '500 126px "Cormorant Garamond", serif';
      ctx.fillStyle = "#F8EFE3";
      ctx.fillText(FIXED_GROOM_NAME, centerX, groomY);

      // City row
      ctx.strokeStyle = "rgba(201,185,154,0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(centerX - rowGap - rowLineWidth, cityY - 11);
      ctx.lineTo(centerX - rowGap, cityY - 11);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(centerX + rowGap, cityY - 11);
      ctx.lineTo(centerX + rowGap + rowLineWidth, cityY - 11);
      ctx.stroke();

      ctx.fillStyle = "rgba(201,185,154,0.6)";
      ctx.font = '500 34px "Jost", sans-serif';
      ctx.fillText(FIXED_WEDDING_CITY.toUpperCase(), centerX, cityY);

      ctx.fillStyle = "rgba(201,185,154,0.65)";
      ctx.font = '400 28px "Jost", sans-serif';
      ctx.fillText("Invito da presentare a Palazzo Isolani.", centerX, footerY);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/png", 1);
      });
      if (!blob) return;

      const fileName = "invito-palazzo-isolani";

      const inviteFile = new File([blob], `${fileName}.png`, { type: "image/png" });
      const supportsFileShare =
        typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare({ files: [inviteFile] }));

      if (supportsFileShare) {
        try {
          await navigator.share({
            files: [inviteFile],
            title: "Invito Palazzo Isolani",
            text: "Invito da presentare a Palazzo Isolani.",
          });
          toast({
            title: "Invito pronto",
            description: "Azione completata. Puoi trovarlo nella galleria foto se hai scelto Salva immagine.",
          });
          return;
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Invito scaricato",
        description: "Download completato sul dispositivo.",
      });
    } finally {
      setIsDownloadingInvite(false);
    }
  };

  const showForm = !submitted || editing;

  return (
    <Layout>
      <PageContainer>
        {!showForm && (
          <SectionTitle
            title={submitted?.attending === false ? "Risposta registrata" : "Presenza Confermata!"}
          />
        )}

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
