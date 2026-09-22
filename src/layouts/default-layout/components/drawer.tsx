import { Icon } from "@/assets/icons";
import { Input } from "@/eano/design-system/shadcn/input"
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Logo } from "@/components";

export default function Drawer() {
  return (
    <div className="w-60 h-screen border-e border-border dark:bg-black bg-white flex flex-col">
      <SideBarHeader />
      <SidebarBody />
    </div>
  )
}

function SideBarHeader() {
  return (
    <div className="p-5 border-b border-border">
      
      {/* buttons */}
      <div className="mb-5 flex items-center cursor-pointer">
        <div className="w-3 h-3 rounded-2xl bg-red-500 me-2"></div>
        <div className="w-3 h-3 rounded-2xl bg-orange-400 me-2"></div>
        <div className="w-3 h-3 rounded-2xl bg-green-400 me-2"></div>
      </div>

      {/* Logo */}
      <Logo />

      {/* search input */}
      <div>
        <Input
          className="mt-4 bg-transparent text-white placeholder:text-muted-foreground"
          placeholder="Search..."
          type="text"
        />
      </div>

    </div>
  )
}

interface NavSection {
  title: string;
  items: {
    name: string;
    icon: string;
    href: string;
    badge?: string;
  }[];
}

function SidebarBody() {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<string[]>(["Main"]);

  const navigationSections: NavSection[] = [
    {
      title: "Main",
      items: [
        { name: "Home", icon: "home", href: "/" },
        { name: "Admin Dashboard", icon: "chart-pie", href: "/admin-dashboard", badge: "NEW" },
      ],
    },
    {
      title: "Store Management",
      items: [
        { name: "Products", icon: "package", href: "/products" },
        { name: "Orders", icon: "shopping-cart", href: "/order-list-block" },
        { name: "Customers", icon: "users", href: "/customers" },
        { name: "Analytics", icon: "trending-up", href: "/analytics" },
      ],
    },
    {
      title: "Components",
      items: [
        { name: "Tables", icon: "table", href: "/table" },
        { name: "Charts", icon: "bar-chart-3", href: "/charts" },
        { name: "Widgets", icon: "layout-grid", href: "/widgets-showcase", badge: "Demo" },
        { name: "Forms", icon: "square-check", href: "/form-builder" },
      ],
    },
    {
      title: "Documentation",
      items: [
        { name: "Base UI", icon: "book", href: "/base-ui" },
        { name: "Layout UI", icon: "layout", href: "/layout-ui" },
        { name: "Navigation UI", icon: "compass", href: "/navigation-ui" },
        { name: "Data Tables", icon: "database", href: "/data-table-demo" },
      ],
    },
  ];

  const toggleSection = (title: string) => {
    setExpandedSections((prev) =>
      prev.includes(title)
        ? prev.filter((s) => s !== title)
        : [...prev, title]
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
      {navigationSections.map((section) => (
        <div key={section.title} className="mb-4">
          {/* Section Header */}
          <button
            onClick={() => toggleSection(section.title)}
            className="w-full flex items-center justify-between px-2 mb-2 text-muted-foreground text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors group"
          >
            <span>{section.title}</span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                expandedSections.includes(section.title) ? "rotate-0" : "-rotate-90"
              }`}
            />
          </button>

          {/* Section Items */}
          {expandedSections.includes(section.title) && (
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavItem
                    key={item.href}
                    name={item.name}
                    icon={item.icon}
                    href={item.href}
                    active={isActive}
                    badge={item.badge}
                  />
                );
              })}
            </div>
          )}
        </div>
      ))}

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="px-2 py-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <p className="text-xs font-semibold text-primary mb-1">v1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Dashboard & Management System
          </p>
        </div>
      </div>
    </div>
  )
}

type NavItemProps = {
  name: string;
  icon: string;
  href: string;
  active: boolean;
  badge?: string;
};

function NavItem({ name, icon, href, active, badge }: NavItemProps) {
  return (
    <a
      href={href}
      className={`
        flex items-center justify-between
        p-2.5 px-3 mb-1
        rounded-lg transition-all duration-200
        ${active
          ? "bg-primary text-primary-foreground font-semibold shadow-md"
          : "dark:text-gray-300 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
        }
      `}
    >
      <div className="flex items-center min-w-0">
        <Icon name={icon} size={18} strokeWidth={active ? 2 : 1.5} />
        <span className="ms-3 text-sm truncate">{name}</span>
      </div>
      {badge && (
        <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full shrink-0">
          {badge}
        </span>
      )}
    </a>
  );
}