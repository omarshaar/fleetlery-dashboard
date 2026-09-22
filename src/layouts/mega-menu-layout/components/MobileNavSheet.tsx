import { useState, memo } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronRight } from "lucide-react";
import { Sheet, Button, Logo } from "@/components";
import { useLanguage } from "@/i18n/hooks";
import { navMainData } from "@/router/navigation-data";

/**
 * MobileNavSheet
 *
 * Responsive mobile navigation using the unified Sheet component.
 * - Shows a hamburger button on small screens
 * - Opens a left sidebar sheet with all navigation groups and items
 * - Reuses navMainData for consistency with desktop navigation
 */
const MobileNavSheet = () => {
  const location = useLocation();
  const { isRTL } = useLanguage();
  const [open, setOpen] = useState(false);

  // تحديد المجموعة المفتوحة افتراضياً بناءً على المسار الحالي
  const currentPath = location.pathname;
  const initialOpenGroupIndex = navMainData.findIndex((group) =>
    group.items?.some((item) => item.url === currentPath),
  );
  const [openGroupIndex, setOpenGroupIndex] = useState<number | undefined>(
    initialOpenGroupIndex >= 0 ? initialOpenGroupIndex : undefined,
  );

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
  };

  return (
    <div className="md:hidden flex items-center justify-end w-full">
      <Sheet
        open={open}
        onOpenChange={handleOpenChange}
        side={isRTL ? "right" : "left"}
        size="min(100vw, 290px)"
        trigger={
          <Button
            variant="outline"
            size="icon"
            className="border-border bg-white/80 backdrop-blur dark:bg-black/80"
          >
            <Menu className="h-5 w-5" />
          </Button>
        }
        innerClassName="w-full px-4 sm:max-w-sm h-full flex flex-col"
      >
        <div className="space-y-3 py-1 flex-1 ">
          <div className="w-full flex items-center justify-between bg-white dark:bg-black z-10">
            <Logo />
          </div>
          {navMainData.map((group, index) => {
            const Icon = group.icon as
              | React.ComponentType<{
                  className?: string;
                }>
              | undefined;

            return (
              <div key={index} className="space-y-1">
                <div className="flex w-full items-center gap-2 px-3 py-0! text-sm font-medium text-gray-800 ring-gray-100  dark:text-gray-100 dark:ring-gray-800">
                  {Icon && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm dark:bg-[#1b1b1b] dark:text-gray-100">
                      <Icon className="h-4 w-4" />
                    </div>
                  )}
                  <button
                    type="button"
                    className="flex-1 text-start truncate font-bold! p-0! py-3!"
                    onClick={() => {
                      if (!group.items || group.items.length === 0) {
                        setOpen(false);
                        window.location.href = group.url;
                      } else {
                        setOpenGroupIndex((prev) =>
                          prev === index ? undefined : index,
                        );
                      }
                    }}
                  >
                    {group.title}
                  </button>
                </div>

                {group.items &&
                  group.items.length > 0 &&
                  openGroupIndex === index && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-800">
                      {group.items.map((item, i) => (
                        <Link
                          key={i}
                          to={item.url}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between rounded-xl px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 dark:hover:text-white"
                        >
                          <span className="truncate text-sm">{item.title}</span>
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-700 dark:bg-gray-700 dark:text-gray-100">
                            <ChevronRight className="h-3 w-3" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </Sheet>
    </div>
  );
};

export default memo(MobileNavSheet);
