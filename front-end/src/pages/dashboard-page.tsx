import { useRoles } from "@/hooks/use-roles";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useNavigation } from "@/hooks/use-navigation";

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();
  const { goBackSmart } = useNavigation();

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

  if (isOrganizer) {
    navigate("/dashboard/events");
    return;
  }

  if (isStaff) {
    navigate("/dashboard/validate-qr");
    return;
  }

  navigate("/dashboard/tickets");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting...</p>
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goBackSmart}
            className="interactive"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
