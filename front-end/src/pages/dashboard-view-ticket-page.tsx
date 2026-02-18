import { TicketDetails, TicketStatus } from "@/domain/domain";
import { Button } from "@/components/ui/button";
import { getTicket, getTicketQr } from "@/lib/api";
import { format } from "date-fns";
import { ArrowLeft, Calendar, DollarSign, MapPin, Tag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router";
import { useNavigation } from "@/hooks/use-navigation";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();
  const { goBackSmart } = useNavigation();

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        const ticketData = await getTicket(accessToken, id);
        // Convert date strings to Date objects safely
        const processedTicket = {
          ...ticketData,
          eventStart: ticketData.eventStart ? new Date(ticketData.eventStart) : new Date(),
          eventEnd: ticketData.eventEnd ? new Date(ticketData.eventEnd) : new Date(),
        };
        setTicket(processedTicket);
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case TicketStatus.CANCELLED:
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatDate = (date: Date) => {
    try {
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Date not available";
      }
      return format(date, "Pp");
    } catch {
      return "Date not available";
    }
  };

  if (!ticket) {
    return <p>Loading..</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goBackSmart}
                className="interactive absolute left-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Ticket Details</h1>
            </div>
            <p className="text-muted-foreground">Your event ticket information</p>
          </div>

          {/* Main Card */}
          <div className="card-3d overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
              {/* Status Badge */}
              <div className="flex justify-center mb-8">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(ticket.status)}`}>
                  {ticket?.status}
                </span>
              </div>

              {/* Event Info */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-3">{ticket.eventName}</h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{ticket.eventVenue}</span>
                </div>
              </div>

              {/* Date Info */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
                <Calendar className="w-5 h-5" />
                <div className="text-center">
                  <p className="font-medium text-foreground">
                    {formatDate(ticket.eventStart)} - {formatDate(ticket.eventEnd)}
                  </p>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex justify-center mb-8">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-lg">
                  <div className="w-40 h-40 flex items-center justify-center">
                    {/* Loading State */}
                    {isQrLoading && (
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-sm text-muted-foreground">Loading QR...</p>
                      </div>
                    )}
                    
                    {/* Error State */}
                    {error && (
                      <div className="text-destructive text-sm text-center p-3">
                        <div className="text-2xl mb-2">⚠️</div>
                        <p>{error}</p>
                      </div>
                    )}
                    
                    {/* QR Code Display */}
                    {qrCodeUrl && !isQrLoading && !error && (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for event"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center mb-8">
                <p className="text-muted-foreground text-sm">
                  Present this QR code at the venue for entry
                </p>
              </div>

              {/* Ticket Details */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-foreground">Ticket Type</h4>
                    <p className="text-muted-foreground">{ticket.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <h4 className="font-medium text-foreground">Price</h4>
                    <p className="text-2xl font-bold text-foreground">${ticket.price}</p>
                  </div>
                </div>
              </div>

              {/* Ticket ID */}
              <div className="text-center">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Ticket ID</h4>
                <p className="text-foreground font-mono text-lg bg-muted/50 px-4 py-2 rounded-lg inline-block">
                  {ticket.id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
