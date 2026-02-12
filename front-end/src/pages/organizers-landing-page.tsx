import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Sparkles, Calendar, Users, Ticket, ArrowRight, LogIn, LogOut } from "lucide-react";

const OrganizersLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const navigate = useNavigate();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
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
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => signinRedirect()} 
                className="interactive gradient"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Log in
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h1 className="text-5xl font-bold gradient-text">
                  Event Management Platform
                </h1>
              </div>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create, manage, and sell event tickets with ease
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Create Events</h3>
                  <p className="text-muted-foreground">
                    Design and publish your events with advanced ticketing options
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Manage Attendees</h3>
                  <p className="text-muted-foreground">
                    Track ticket sales and validate attendees with QR codes
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Ticket className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Sell Tickets</h3>
                  <p className="text-muted-foreground">
                    Multiple ticket types with flexible pricing and availability
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/dashboard/events")}
                className="interactive gradient flex-1"
                size="lg"
              >
                Create an Event
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="interactive flex-1"
                size="lg"
              >
                Browse Events
              </Button>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative">
            <div className="card-3d overflow-hidden rounded-2xl">
              <div className="aspect-square bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Start Organizing Today
                  </h3>
                  <p className="text-muted-foreground">
                    Join thousands of event organizers using our platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
