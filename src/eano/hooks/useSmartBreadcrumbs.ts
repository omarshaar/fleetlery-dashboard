import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { navMainData } from "@/router/navigation-data";
import type { BreadcrumbItemType } from "../components/navigation-ui/Breadcrumb";
import { useLanguage } from "@/i18n/hooks";

function findHomeItem(): BreadcrumbItemType | null {
  for (const group of navMainData) {
    if (!group.items) continue;
    const home = group.items.find((item) => item.url === "/");
    if (home) {
      return {
        label: home.title,
        href: "/",
      };
    }
  }

  return null;
}

function humanizePath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "/";
  const last = segments[segments.length - 1];
  return last
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function useSmartBreadcrumbs(): BreadcrumbItemType[] {
  const location = useLocation();
  const { pathname } = location;
  const { language } = useLanguage();

  return useMemo(() => {
    const breadcrumbs: BreadcrumbItemType[] = [];
    const homeItem = findHomeItem();

    if (pathname === "/") {
      if (homeItem) {
        breadcrumbs.push({ label: homeItem.label, current: true });
      } else {
        breadcrumbs.push({ label: "Home", current: true });
      }
      return breadcrumbs;
    }

    if (homeItem) {
      breadcrumbs.push(homeItem);
    }

    const matchedGroup = navMainData.find((group) => {
      if (group.url === pathname) return true;
      return group.items?.some((item) => item.url === pathname);
    });

    if (!matchedGroup) {
      breadcrumbs.push({ label: humanizePath(pathname), current: true });
      return breadcrumbs;
    }

    const groupLabel = matchedGroup.title;
    const matchedChild = matchedGroup.items?.find((item) => item.url === pathname);

    if (matchedChild) {
      // Category level (non-current)
      breadcrumbs.push({ label: groupLabel });
      // Leaf page (current)
      breadcrumbs.push({ label: matchedChild.title, href: matchedChild.url, current: true });
      return breadcrumbs;
    }

    // Direct group route matches current path
    breadcrumbs.push({ label: groupLabel, href: matchedGroup.url, current: true });
    return breadcrumbs;
  }, [pathname, language]);
}
