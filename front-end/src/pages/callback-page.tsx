import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

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
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-2">Login Error</h1>
        <p className="text-gray-400 mb-4">{error.message}</p>
        <Button onClick={() => navigate("/login")}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="space-y-4 text-center">
        <p className="text-xl font-semibold">
          {isLoading ? "Processing login..." : "Completing login..."}
        </p>
        <p className="text-gray-400">
          {isAuthenticated ? "Authenticated! Redirecting..." : "Waiting for authentication..."}
        </p>
        {!isLoading && !isAuthenticated && (
          <div className="pt-4">
             <Button onClick={() => navigate("/")}>Go to Home</Button>
             <p className="text-xs text-gray-500 mt-2">If you are stuck, your session might have expired.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallbackPage;
