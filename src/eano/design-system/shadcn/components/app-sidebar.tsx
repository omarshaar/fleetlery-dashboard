
import * as React from "react";
import { useLanguage } from "@/i18n";
import { NavMain } from "@/eano/design-system/shadcn/components/nav-main";
import { NavUser } from "@/eano/design-system/shadcn/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  useSidebar,
} from "@/eano/design-system/shadcn/sidebar";
import { Logo } from "@/components";
import { navMainData } from "@/router/navigation-data";
import { Button } from "../button";
import { Menu } from "lucide-react";


// Sample user and navigation data
const userData = {
  name: "EANO Admin",
  email: "eano@example.com",
  avatar: "/avatars/avatar-1.jpg",
};

const mainNavItems = navMainData;


export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { isRTL } = useLanguage();

  return (
    <Sidebar
      collapsible="icon"
      side={isRTL ? "right" : "left"}
      {...props}
    >
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={mainNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}


function SidebarHeader() {
  const { open, isMobile, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <div className={isOpen ? "p-4" : "p-1.5"}>
      <div className="w-full flex items-center justify-between">
        <Logo />
        <SidebarMenuToggle />
      </div>
    </div>
  );
}


type SidebarMenuToggleProps = {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null;
  className?: string;
};

export function SidebarMenuToggle({ variant, className }: SidebarMenuToggleProps) {
  const { toggleSidebar } = useSidebar();
  return (
    <Button
      variant={variant}
      size="icon"
      className={`h-9 w-9 sidebar-menu-button${className ? ` ${className}` : ""}`}
      onClick={toggleSidebar}
      aria-label="Toggle sidebar menu"
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
}