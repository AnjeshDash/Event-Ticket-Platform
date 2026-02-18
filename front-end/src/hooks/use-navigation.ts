import { useNavigate } from "react-router";

export const useNavigation = () => {
  const navigate = useNavigate();

  // Navigate back with fallback
  const goBack = (fallbackPath = "/") => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to a specific path
      navigate(fallbackPath);
    }
  };

  // Navigate back with intelligent fallback based on current path
  const goBackSmart = () => {
    const currentPath = window.location.pathname;
    
    // Define intelligent fallback paths based on current location
    const fallbackMap: Record<string, string> = {
      "/events": "/",
      "/organizers": "/",
      "/dashboard": "/",
      "/dashboard/events": "/",
      "/dashboard/tickets": "/dashboard",
      "/dashboard/validate-qr": "/dashboard",
    };

    // Check if current path starts with any key in fallbackMap
    const fallbackPath = Object.keys(fallbackMap).find(key => 
      currentPath.startsWith(key)
    ) || "/";

    goBack(fallbackPath);
  };

  // Navigate to specific dashboard section
  const goToDashboard = (section = "") => {
    navigate(`/dashboard${section ? `/${section}` : ""}`);
  };

  // Navigate to events
  const goToEvents = () => {
    navigate("/");
  };

  return {
    goBack,
    goBackSmart,
    goToDashboard,
    goToEvents,
    navigate
  };
};
