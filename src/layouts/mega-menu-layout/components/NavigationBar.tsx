import React, { memo } from "react";
import { NavigationMenu } from "@/eano/components/navigation-ui/NavigationMenu";
import type { NavigationMenuSection } from "@/eano/components/navigation-ui/NavigationMenu";
import { navMainData } from "@/router/navigation-data";
import MobileNavSheet from "./MobileNavSheet";
import { Breadcrumb } from "@/components";
import { useSmartBreadcrumbs } from "@/eano/hooks";

/**
 * NavigationBar Component
 *
 * Secondary navigation bar containing dropdown menus from navMainData
 *
 * Features:
 * - Dynamic menu items from navigation-data.ts
 * - Dropdown menus with icons
 * - Active state highlighting
 * - Responsive design
 * - RTL/LTR support
 */
const NavigationBar = () => {
  const breadcrumbs = useSmartBreadcrumbs();

  // Transform navMainData into NavigationMenuSection format
  const sections: NavigationMenuSection[] = navMainData.map((item) => {
    const Icon = item.icon as
      | React.ComponentType<{
          className?: string;
        }>
      | undefined;

    return {
      label: item.title,
      icon: Icon ? <Icon className="h-4 w-4" /> : undefined,
      href: item.items && item.items.length > 0 ? undefined : item.url,
      items: item.items?.map((subItem) => ({
        title: subItem.title,
        href: subItem.url,
      })),
    };
  });

  return (
    <nav
      className="sticky top-0 border-b bg-white dark:bg-black dark:border-border z-50"
      style={{ direction: "ltr" }} // force LTR for nav bar
    >
      <div className="w-full">
        {/* Secondary Navigation */}
        <div className="flex h-auto items-center px-4 md:px-6 lg:px-8">
          <div className="hidden md:block w-full min-w-0">
            <div className="">
              <NavigationMenu sections={sections} className="" />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center justify-between md:hidden py-1 w-full">
            <div className="w-max">
              <MobileNavSheet />
            </div>

            <div>
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default memo(NavigationBar);
