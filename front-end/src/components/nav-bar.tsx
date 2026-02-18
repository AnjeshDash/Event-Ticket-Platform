import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Sparkles } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link, useNavigate } from "react-router";

const NavBar: React.FC = () => {
  const { user, signoutRedirect } = useAuth();
  const { isOrganizer } = useRoles();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center cursor-pointer"
                onClick={() => navigate("/")}
              >
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <span 
                className="text-xl font-bold gradient-text cursor-pointer hover:text-primary transition-colors"
                onClick={() => navigate("/")}
              >
                EventHub
              </span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              {isOrganizer && (
                <Link 
                  to="/dashboard/events" 
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                >
                  Events
                </Link>
              )}
              <Link 
                to="/dashboard/tickets" 
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
              >
                Tickets
              </Link>
            </nav>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer interactive">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {user?.profile?.preferred_username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 card-3d border-border"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-medium text-foreground">
                  {user?.profile?.preferred_username}
                </p>
                <p className="text-sm text-muted-foreground">{user?.profile?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="interactive cursor-pointer"
                onClick={() => signoutRedirect()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
