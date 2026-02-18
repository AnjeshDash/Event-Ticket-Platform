import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { ArrowLeft, CheckCircle, CreditCard, Sparkles, Shield, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import { useNavigation } from "@/hooks/use-navigation";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const { goBackSmart, navigate: navNavigate } = useNavigation();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  if (isPurchaseSuccess) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="card-3d overflow-hidden">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-2">
                Your ticket purchase was successful.
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecting to home page in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
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
              <div 
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => navNavigate("/")}
              >
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Purchase Ticket</h1>
            </div>
            <p className="text-muted-foreground">Complete your purchase details</p>
          </div>

          {/* Purchase Form */}
          <div className="card-3d overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
              {error && (
                <div className="mb-6">
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <Shield className="w-4 h-4" />
                      <span className="font-medium">Error: {error}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Credit Card Section */}
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Payment Information</span>
                  </div>
                </div>

                {/* Credit Card Number */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Credit Card Number</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="pl-12"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label className="text-foreground font-medium">Cardholder Name</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="John Smith"
                      className="pl-12"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-muted-foreground">JS</span>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Your payment information is secure and encrypted</span>
                  </div>
                </div>
              </div>

              {/* Purchase Button */}
              <div className="pt-6">
                <Button
                  onClick={handlePurchase}
                  className="interactive gradient w-full"
                  size="lg"
                >
                  Purchase Ticket
                </Button>
              </div>

              {/* Mock Notice */}
              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">
                  This is a mock purchase page. No actual payment will be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
