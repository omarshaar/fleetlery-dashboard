import { Header } from "@/layouts/default-tabs/components";
import { AppSidebar } from "@/eano/design-system/shadcn/components/app-sidebar";
import { SidebarProvider } from "@/eano/design-system/shadcn/sidebar";
import TabWatcher from "./components/TabWatcher";
import React, { memo } from "react";

function defaultTabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-auto flex relative">
        <div className="sticky top-0 h-screen">
          <AppSidebar />
        </div>

        <div className="flex flex-col w-full min-h-screen overflow-auto">
          <TabWatcher />
          <Header />
          <div className="w-full" style={{height: "calc(100vh - var(--header-height) - var(--page-padding) - 10px)"}}>{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}

const DefaultTabsLayout = memo(defaultTabsLayout);
export default DefaultTabsLayout;

    