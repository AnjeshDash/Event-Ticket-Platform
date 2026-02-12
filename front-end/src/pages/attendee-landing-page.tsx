import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, Sparkles, Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";

const AttendeeLandingPage: React.FC = () => {
  const { isAuthenticated, isLoading, signinRedirect, signoutRedirect } =
    useAuth();

  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
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

  const queryPublishedEvents = async () => {
    if (!query || query.trim().length === 0) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setIsSearching(true);
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    queryPublishedEvents();
  };

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
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">EventHub</span>
            </div>
            
            {isAuthenticated ? (
              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="interactive"
                  variant="outline"
                >
                  Dashboard
                </Button>
                <Button
                  className="interactive"
                  onClick={() => signoutRedirect()}
                  variant="ghost"
                >
                  Log out
                </Button>
              </div>
            ) : (
              <Button className="interactive gradient" onClick={() => signinRedirect()}>
                Log in
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 fade-in">
              <Sparkles className="w-4 h-4" />
              Discover Amazing Events
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 slide-up">
              <span className="gradient-text">Find Tickets to Your</span>
              <br />
              <span className="text-foreground">Next Event</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto slide-up" style={{ animationDelay: "0.1s" }}>
              Discover and book tickets for the most exciting events in your area. 
              From concerts to conferences, find your perfect experience.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex gap-3 p-1 bg-card rounded-2xl shadow-lg border border-border">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search events, artists, venues..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-12 border-0 bg-transparent shadow-none focus:ring-0 text-base"
                    leftIcon={<Search className="w-5 h-5" />}
                  />
                </div>
                <Button type="submit" disabled={isSearching} className="interactive">
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Search
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-12 slide-up" style={{ animationDelay: "0.3s" }}>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">1000+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50K+</div>
                <div className="text-sm text-muted-foreground">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">100+</div>
                <div className="text-sm text-muted-foreground">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center card-3d p-6 bg-card rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upcoming Events</h3>
              <p className="text-muted-foreground">Browse through our curated selection of upcoming events</p>
            </div>
            
            <div className="text-center card-3d p-6 bg-card rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multiple Venues</h3>
              <p className="text-muted-foreground">Find events happening at venues near you</p>
            </div>
            
            <div className="text-center card-3d p-6 bg-card rounded-2xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Join Community</h3>
              <p className="text-muted-foreground">Connect with other event enthusiasts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Published Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Events</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these amazing events happening soon
            </p>
          </div>
          
          {publishedEvents?.content && publishedEvents.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publishedEvents.content.map((publishedEvent, index) => (
                  <div 
                    key={publishedEvent.id} 
                    className="scale-in" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PublishedEventCard publishedEvent={publishedEvent} />
                  </div>
                ))}
              </div>

              {publishedEvents && (
                <div className="w-full flex justify-center py-8">
                  <SimplePagination
                    pagination={publishedEvents}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Events Found</h3>
              <p className="text-muted-foreground mb-6">
                {query ? "No events match your search criteria" : "No events available at the moment"}
              </p>
              {query && (
                <Button onClick={() => setQuery("")} variant="outline">
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold gradient-text">EventHub</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AttendeeLandingPage;
