import { useRBAC } from "@/hooks/use-rbac";
import { PERMISSIONS } from "@/config/roles";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Receipt,
  Users,
  Settings,
} from "lucide-react";

export function useNavItems() {
  const { hasPermission } = useRBAC();

  const items = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      title: "Bookings",
      href: "/bookings",
      icon: Calendar,
      permission: PERMISSIONS.VIEW_BOOKINGS,
    },
    {
      title: "Finances",
      href: "/finances",
      icon: DollarSign,
      permission: PERMISSIONS.VIEW_FINANCES,
    },
    {
      title: "Expenses",
      href: "/expenses",
      icon: Receipt,
      permission: PERMISSIONS.VIEW_EXPENSES,
    },
    {
      title: "Users",
      href: "/users",
      icon: Users,
      permission: PERMISSIONS.VIEW_USERS,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      permission: PERMISSIONS.MANAGE_SETTINGS,
    },
  ];

  return items.filter((item) => hasPermission(item.permission));
} 