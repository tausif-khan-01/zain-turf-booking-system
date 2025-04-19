import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import AdminHeader from "./header";

export default function Layout() {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        {/* <header className="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />

          <h1 className="text-lg font-semibold">{getPageTitle()}</h1>
        </header> */}
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </>
  );
}
