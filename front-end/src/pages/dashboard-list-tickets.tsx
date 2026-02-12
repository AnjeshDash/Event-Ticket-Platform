import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [tickets, setTickets] = useState<SpringBootPagination<TicketSummary> | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) return;
    
    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else if (typeof err === "string") setError(err);
        else setError("An unknown error occurred");
      }
    };
    doUseEffect();
  }, [isLoading, user?.access_token, page]);

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">Your Tickets</h1>
          </div>
          <p className="text-muted-foreground">Tickets you have purchased</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets?.content.map((ticketItem) => (
            <Link key={ticketItem.id} to={`/dashboard/tickets/${ticketItem.id}`}>
              <Card className="card-3d overflow-hidden group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-xl text-foreground line-clamp-2">
                        {ticketItem.ticketType.name}
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-medium">
                      {ticketItem.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        ${ticketItem.ticketType.price}
                      </p>
                      <p className="text-sm text-muted-foreground">per ticket</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Tag className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">Ticket ID</h4>
                      <p className="text-muted-foreground font-mono text-sm bg-muted/50 px-2 py-1 rounded">
                        {ticketItem.id}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="flex justify-center py-8">
          {tickets && <SimplePagination pagination={tickets} onPageChange={setPage} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardListTickets;
