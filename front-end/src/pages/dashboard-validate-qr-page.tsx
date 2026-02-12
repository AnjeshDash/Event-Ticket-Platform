import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, X, Sparkles, QrCode, Keyboard } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Validate Ticket</h1>
            </div>
            <p className="text-muted-foreground">Scan QR code or enter ticket ID manually</p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="max-w-2xl mx-auto card-3d mb-8">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Main Content */}
          <div className="card-3d overflow-hidden">
            <div className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-8">
              {/* Scanner Viewport */}
              <div className="rounded-xl overflow-hidden mx-auto mb-8 relative bg-card border border-border">
                <Scanner
                  key={`scanner-${data}-${validationStatus}`}
                  onScan={(result) => {
                    if (result) {
                      const qrCodeId = result[0].rawValue;
                      setData(qrCodeId);
                      handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                    }
                  }}
                  onError={handleError}
                />

                {/* Validation Status Overlay */}
                {validationStatus && (
                  <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center">
                    {validationStatus === TicketValidationStatus.VALID ? (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Check className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-lg font-medium text-green-600">Valid Ticket</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-20 h-20 bg-destructive rounded-full flex items-center justify-center mb-4 mx-auto">
                          <X className="w-10 h-10 text-white" />
                        </div>
                        <p className="text-lg font-medium text-destructive">Invalid Ticket</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Input Section */}
              {isManual ? (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Keyboard className="w-5 h-5" />
                      <span>Manual Entry</span>
                    </div>
                  </div>
                  <Input
                    placeholder="Enter ticket ID manually"
                    value={data || ""}
                    onChange={(e) => setData(e.target.value)}
                    className="text-center text-lg"
                  />
                  <Button
                    onClick={() =>
                      handleValidate(data || "", TicketValidationMethod.MANUAL)
                    }
                    className="interactive gradient w-full"
                    size="lg"
                  >
                    Validate Ticket
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <QrCode className="w-5 h-5" />
                      <span>QR Scanner</span>
                    </div>
                  </div>
                  <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
                    <span className="font-mono text-lg">
                      {data || "Scan QR code to validate"}
                    </span>
                  </div>
                  <Button
                    onClick={() => setIsManual(true)}
                    variant="outline"
                    className="interactive w-full"
                    size="lg"
                  >
                    <Keyboard className="w-4 h-4 mr-2" />
                    Manual Entry
                  </Button>
                </div>
              )}

              {/* Reset Button */}
              <div className="pt-6 border-t border-border">
                <Button
                  onClick={handleReset}
                  variant="ghost"
                  className="interactive w-full"
                  size="lg"
                >
                  Reset Scanner
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
