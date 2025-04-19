import {
  Calendar,
  ChevronsUpDown,
  CreditCard,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// Menu items configuration
const menuConfig = {
  mainMenu: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Bookings",
      url: "/bookings",
      icon: Calendar,
    },
    {
      title: "Expenses",
      url: "/expenses",
      icon: CreditCard,
    },
  ],
  footerMenu: [
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-10 rounded-lg border">
                <AvatarImage src={"/logo.jpg"} alt={"ZAIN TURF"} />
                <AvatarFallback className="rounded-lg">ZT</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  <span className="text-primary">Zain</span> Turf
                </span>
                <span className="truncate text-xs">Admin Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuConfig.mainMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink to={item.url}>
                    {({ isActive }) => (
                      <SidebarMenuButton
                        className={"cursor-pointer"}
                        isActive={isActive}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {menuConfig.footerMenu.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url}>
                {({ isActive }) => (
                  <SidebarMenuButton isActive={isActive}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
