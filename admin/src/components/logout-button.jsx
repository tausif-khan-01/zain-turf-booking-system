import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <Button
      variant="ghost"
      className="flex items-center gap-2"
      onClick={logout}
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
}
