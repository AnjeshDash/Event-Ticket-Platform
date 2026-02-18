import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigation } from "@/hooks/use-navigation";
import { Sparkles, Calendar, Users, Ticket, ArrowRight, LogIn, LogOut, ArrowLeft, Info, User, QrCode } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const OrganizersLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const { goBackSmart, goToDashboard, navigate } = useNavigation();

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
                  onClick={() => goToDashboard("events")}
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
              <div className="text-center">
                <Button 
                  onClick={() => signinRedirect()} 
                  className="interactive gradient"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Button>
                
                {/* User Manual Button */}
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="interactive">
                        <Info className="w-4 h-4 mr-2" />
                        User Manual
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                          <Info className="w-6 h-6 text-primary" />
                          Demo Login Credentials & User Guide
                        </DialogTitle>
                        <DialogDescription>
                          Use these credentials to explore different user roles and functionalities
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-6">
                        {/* Organizer Role */}
                        <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                          <div className="flex items-center gap-3 mb-3">
                            <Users className="w-5 h-5 text-primary" />
                            <h4 className="font-semibold text-primary">Organizer</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="font-medium">Username:</span> organizer
                            </div>
                            <div>
                              <span className="font-medium">Password:</span> password
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>What you can do:</strong> Create events, manage ticket types, publish events, and track sales
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Go to Dashboard → Create Event → Fill details → Publish
                          </div>
                        </div>

                        {/* Attendee Role */}
                        <div className="bg-accent/5 rounded-lg p-4 border border-accent/20">
                          <div className="flex items-center gap-3 mb-3">
                            <User className="w-5 h-5 text-accent" />
                            <h4 className="font-semibold text-accent">Attendee</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="font-medium">Username:</span> attendee
                            </div>
                            <div>
                              <span className="font-medium">Password:</span> password
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>What you can do:</strong> Browse events, purchase tickets, view purchased tickets
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Click on event → Purchase ticket → Use fake card details → View tickets in Dashboard → Get QR code
                          </div>
                        </div>

                        {/* Staff Role */}
                        <div className="bg-secondary/5 rounded-lg p-4 border border-secondary/20">
                          <div className="flex items-center gap-3 mb-3">
                            <QrCode className="w-5 h-5 text-secondary" />
                            <h4 className="font-semibold text-secondary">Staff</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-3">
                            <div>
                              <span className="font-medium">Username:</span> staff
                            </div>
                            <div>
                              <span className="font-medium">Password:</span> password
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>What you can do:</strong> Validate tickets using QR code scanning
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            Open website on another device → Login as staff → Dashboard → Validate QR → Scan attendee's ticket
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goBackSmart}
                  className="interactive"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
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
