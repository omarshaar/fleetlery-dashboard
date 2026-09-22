import { memo } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components";
import { DropdownMenu } from "@/eano/components/navigation-ui/DropdownMenu";
import { useLanguage } from "@/i18n/hooks";
import type { DropdownItem } from "@/eano/components/navigation-ui/DropdownMenu";

/**
 * MegaMenuDropdown Component
 * 
 * Mega menu dropdown button in header
 * Uses the unified DropdownMenu component from eano/components
 */
const MegaMenuDropdown = () => {
  const { t } = useLanguage();

  const menuItems: DropdownItem[] = [
    {
      label: t("navigation.dashboard") || "Dashboards",
      children: [
        { label: "Analytics", onClick: () => console.log("Analytics") },
        { label: "CRM", onClick: () => console.log("CRM") },
        { label: "E-Commerce", onClick: () => console.log("E-Commerce") },
      ]
    },
    {
      label: t("navigation.components") || "Components",
      children: [
        { label: "UI Elements", onClick: () => console.log("UI Elements") },
        { label: "Forms", onClick: () => console.log("Forms") },
        { label: "Tables", onClick: () => console.log("Tables") },
      ]
    }
  ];

  return (
    <DropdownMenu
      trigger={
        <Button variant="ghost" className="flex items-center gap-2">
          {t("navigation.megaMenu") || "Mega Menu"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      }
      items={menuItems}
      align="start"
      widthClass="w-96"
    />
  );
};

export default memo(MegaMenuDropdown);
