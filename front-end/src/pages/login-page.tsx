import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Sparkles, Loader, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigation } from "@/hooks/use-navigation";

const LoginPage: React.FC = () => {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const { goBackSmart } = useNavigation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!isAuthenticated) {
      signinRedirect();
    }
  }, [isLoading, isAuthenticated, signinRedirect]);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="card-3d p-8 max-w-md">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goBackSmart}
              className="interactive"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>

            {/* Loading Spinner */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Loader className="w-8 h-8 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Authenticating
              </h2>
              <p className="text-muted-foreground">
                Redirecting you to the login page...
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">
                  Establishing secure connection
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
