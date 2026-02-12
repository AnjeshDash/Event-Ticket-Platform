import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle, Home, Loader, CheckCircle } from "lucide-react";

const CallbackPage: React.FC = () => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectPath = localStorage.getItem("redirectPath") || "/";
      localStorage.removeItem("redirectPath");
      navigate(redirectPath);
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="max-w-md mx-auto p-8">
          <div className="card-3d overflow-hidden">
            <div className="bg-gradient-to-br from-destructive/5 via-background to-destructive/5 p-8 text-center">
              <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h2>
              <p className="text-muted-foreground mb-6">{error.message}</p>
              <Button
                onClick={() => navigate("/login")}
                className="interactive"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="card-3d p-8 max-w-md">
          <div className="space-y-6">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Loading/Processing State */}
            <div className="flex justify-center mb-6">
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <Loader className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-lg font-medium text-foreground">
                    Processing authentication...
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-lg font-medium text-foreground">
                    Authentication successful!
                  </span>
                </div>
              )}
            </div>

            {/* Status Message */}
            <div className="space-y-2">
              <p className="text-muted-foreground">
                {isLoading 
                  ? "Please wait while we verify your credentials..." 
                  : isAuthenticated 
                    ? "Authenticated! Redirecting you to your destination..." 
                    : "Waiting for authentication completion..."
                }
              </p>
            </div>

            {/* Home Button */}
            {!isLoading && isAuthenticated && (
              <div className="pt-4">
                <Button
                  onClick={() => navigate("/")}
                  className="interactive gradient w-full"
                  size="lg"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
              </div>
            )}

            {/* Help Text */}
            {!isLoading && !isAuthenticated && (
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  If you're stuck here, your authentication session may have expired. Please try logging in again.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallbackPage;
