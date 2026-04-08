import { Edit3 } from "lucide-react";
import WeddingButton from "@/components/WeddingButton";
import type { RSVPEntry } from "@/lib/storage";

interface RsvpConfirmationViewProps {
  submitted: RSVPEntry;
  onEdit: () => void;
}

export default function RsvpConfirmationView({ submitted, onEdit }: RsvpConfirmationViewProps) {
  const fullName = `${submitted.firstName} ${submitted.lastName}`.trim();
  const totalGuests = submitted.guestCount + submitted.childrenCount;
  const isAttending = submitted.attending !== false;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-6">
        <h3 className="font-serif text-xl mb-2" style={{ color: "hsl(var(--foreground))" }}>
          Grazie, {fullName}!
        </h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          {isAttending
            ? `Con gioia confermiamo la registrazione per ${totalGuests} ${
                totalGuests === 1 ? "persona" : "persone"
              } (totale adulti+minorenni).`
            : `Abbiamo registrato la tua non partecipazione, ${fullName}.`}
        </p>

        <WeddingButton variant="outline" onClick={onEdit} data-testid="button-edit-rsvp">
          <Edit3 size={13} className="mr-2" />
          Modifica risposta
        </WeddingButton>
      </div>
    </div>
  );
}
