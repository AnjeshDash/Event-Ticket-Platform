import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, MapPin, Sparkles, Calendar, DollarSign, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useNavigate, useParams } from "react-router";

const PublishedEventsPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      }
    };
    doUseEffect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive" className="max-w-2xl mx-auto card-3d">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Bar */}
      <div className="glass border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-end">
            {isAuthenticated ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/dashboard/events")}
                  variant="outline"
                  className="interactive"
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => signoutRedirect()}
                  variant="ghost"
                  className="interactive"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signinRedirect()} 
                className="interactive gradient"
              >
                Log in
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Event Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* Event Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">{publishedEvent?.name}</h1>
            </div>
            
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{publishedEvent?.venue}</span>
            </div>
          </div>

          {/* Event Image */}
          <div className="relative">
            <div className="card-3d overflow-hidden rounded-xl">
              <RandomEventImage />
            </div>
          </div>
        </div>

        {/* Ticket Types Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Available Tickets</h2>
            <p className="text-muted-foreground">Choose your ticket type to purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ticket Types List */}
            <div className="space-y-4">
              {publishedEvent?.ticketTypes?.map((ticketType) => (
                <Card
                  key={ticketType.id}
                  className={`card-3d cursor-pointer transition-all duration-200 ${
                    selectedTicketType?.id === ticketType.id 
                      ? 'ring-2 ring-primary ring-offset-2' 
                      : 'hover:scale-105'
                  }`}
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Ticket className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">{ticketType.name}</h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-foreground">
                          ${ticketType.price}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {ticketType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Ticket Details */}
            <div className="card-3d p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {selectedTicketType?.name}
                </h3>
                <div className="text-4xl font-bold gradient-text mb-4">
                  ${selectedTicketType?.price}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-5 h-5" />
                  <span>Event Date</span>
                </div>
                <p className="text-foreground font-medium">
                  {publishedEvent?.start && new Date(publishedEvent.start).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5" />
                  <span>Venue</span>
                </div>
                <p className="text-foreground font-medium">
                  {publishedEvent?.venue}
                </p>
              </div>

              {selectedTicketType && (
                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                  className="block"
                >
                  <Button className="interactive gradient w-full" size="lg">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Purchase Ticket
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
