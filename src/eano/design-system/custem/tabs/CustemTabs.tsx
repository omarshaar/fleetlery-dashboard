import * as React from "react";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "@/i18n";

/**
 * Elegant, accessible Tabs component for React + TypeScript.
 * - Keyboard accessible (ArrowLeft/Right, Home/End, Enter/Space)
 * - Variants: "underline" | "pills" | "segmented"
 * - Sizes: "sm" | "md" | "lg"
 * - Controlled & uncontrolled modes
 * - Optional lazy mounting for tab panels
 * - Animated indicator (Framer Motion)
 * - Mobile-friendly horizontal scroll with overflow gradients
 * - Dark mode ready (Tailwind "dark:" classes)
 *
 * Usage:
 * <Tabs
 *   items=[
 *     { id: "overview", label: "Overview", icon: <Icon/>, content: <div/> },
 *     { id: "reports", label: "Reports", badge: "12", content: <div/> },
 *   ]
 *   defaultValue="overview"
 *   variant="underline"
 *   size="md"
 *   lazy
 * />
 */

// ---------- Types ----------
export type TabItem = {
  id: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  content: React.ReactNode;
  /** If true, this panel will only mount when activated first time. */
  lazy?: boolean;
};

export type TabsProps = {
  items: TabItem[];
  /** Controlled value. If provided, component is controlled */
  value?: string;
  /** Uncontrolled initial value */
  defaultValue?: string;
  /** Called when active tab changes */
  onChange?: (value: string) => void;
  /** Visual variant */
  variant?: "underline" | "pills" | "segmented";
  /** Visual size */
  size?: "sm" | "md" | "lg";
  /** Full width tabs (distribute space) */
  fullWidth?: boolean;
  /** If true, panels mount lazily (first activation). */
  lazy?: boolean;
  className?: string;
  /** Optional aria-label for tablist when there is no visible label */
  ariaLabel?: string;
};

// Utility: join class names
const cn = (...parts: (string | undefined | false | null)[]) => parts.filter(Boolean).join(" ");

// ---------- Tabs Component ----------
export function Custemtabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  fullWidth = false,
  lazy,
  className,
  ariaLabel,
}: TabsProps) {
  const { isRTL } = useLanguage();
  const isControlled = value !== undefined;
  const initial = defaultValue ?? items[0]?.id;
  const [internalValue, setInternalValue] = useState<string | undefined>(initial);
  const activeValue = isControlled ? value! : internalValue!;

  // Maintain a set of mounted panels for lazy mount behavior
  const mounted = useRef<Set<string>>(new Set(initial ? [initial] : []));
  if (activeValue && !mounted.current.has(activeValue)) mounted.current.add(activeValue);

  const idBase = useId().replace(/:/g, ""); // stable, DOM-safe id base

  // Refs & indicator metrics
  const listRef = useRef<HTMLDivElement | null>(null);
  // NOTE: we use HTMLDivElement now since tabs are <div>, not <button>
  const btnRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, height: 0 });

  // Measure active tab for animated indicator
  const measure = () => {
    const el = btnRefs.current[activeValue];
    const list = listRef.current;
    if (!el || !list) return;
    const rect = el.getBoundingClientRect();
    const listRect = list.getBoundingClientRect();
    
    // Calculate position based on text direction
    let position: number;
    if (isRTL) {
      // In RTL, calculate from the right edge
      position = listRect.right - rect.right + list.scrollLeft;
    } else {
      // In LTR, calculate from the left edge
      position = rect.left - listRect.left + list.scrollLeft;
    }
    
    setIndicator({
      left: position,
      width: rect.width,
      height: rect.height,
    });
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (listRef.current) ro.observe(listRef.current);
    const onWin = () => measure();
    window.addEventListener("resize", onWin);
    window.addEventListener("orientationchange", onWin);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onWin);
      window.removeEventListener("orientationchange", onWin);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeValue, variant]);

  // When active tab changes, ensure it's scrolled into view
  useEffect(() => {
    const el = btnRefs.current[activeValue];
    const list = listRef.current;
    if (el && list) {
      // Use scrollIntoView for better RTL/LTR compatibility
      el.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
    }
  }, [activeValue]);

  const setActive = (id: string) => {
    if (!isControlled) setInternalValue(id);
    onChange?.(id);
  };

  // Keyboard navigation for the tablist (arrows/home/end)
  const onKeyDownList = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    const idx = Math.max(0, enabled.findIndex((i) => i.id === activeValue));
    
    // In RTL, ArrowRight goes to previous and ArrowLeft goes to next
    const isNextKey = isRTL ? e.key === "ArrowLeft" : e.key === "ArrowRight";
    const isPrevKey = isRTL ? e.key === "ArrowRight" : e.key === "ArrowLeft";
    
    if (isNextKey) {
      const next = enabled[(idx + 1) % enabled.length];
      setActive(next.id);
      btnRefs.current[next.id]?.focus();
      e.preventDefault();
    } else if (isPrevKey) {
      const prev = enabled[(idx - 1 + enabled.length) % enabled.length];
      setActive(prev.id);
      btnRefs.current[prev.id]?.focus();
      e.preventDefault();
    } else if (e.key === "Home") {
      const first = enabled[0];
      setActive(first.id);
      btnRefs.current[first.id]?.focus();
      e.preventDefault();
    } else if (e.key === "End") {
      const last = enabled[enabled.length - 1];
      setActive(last.id);
      btnRefs.current[last.id]?.focus();
      e.preventDefault();
    }
  };

  // Style maps
  const sizeMap = {
    sm: {
      px: "px-3",
      py: "py-1.5",
      text: "text-sm",
      gap: "gap-1.5",
      radius: "rounded-xl",
    },
    md: {
      px: "px-4",
      py: "py-2",
      text: "text-sm md:text-base",
      gap: "gap-2",
      radius: "rounded-2xl",
    },
    lg: {
      px: "px-5",
      py: "py-2.5",
      text: "text-base md:text-lg",
      gap: "gap-2.5",
      radius: "rounded-2xl",
    },
  } as const;

  const s = sizeMap[size];

  const baseBtn = cn(
    "relative inline-flex items-center whitespace-nowrap select-none",
    "font-medium leading-none transition-colors",
    s.px,
    s.py,
    s.text,
    s.radius,
    fullWidth ? "flex-1 justify-center" : "",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 dark:focus-visible:ring-indigo-400/50"
  );

  const variantBtn = (active: boolean) =>
    variant === "underline"
      ? cn(
          baseBtn,
          active
            ? "text-primary"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        )
      : variant === "pills"
      ? cn(
          baseBtn,
          active
            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm"
            : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
        )
      : // segmented
        cn(
          baseBtn,
          active
            ? "text-neutral-900 dark:text-white"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        );

  const listBorders =
    variant === "underline"
      ? "border-b border-neutral-200 dark:border-neutral-800"
      : variant === "segmented"
      ? "bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl"
      : "";

  return (
    <div className={cn("w-full", className)}>
      {/* Tablist wrapper with overflow scroll & gradient masks */}
      <div className="relative">
        {/* left/right fades (optional) */}
        {/* <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-white dark:from-black to-transparent" /> */}
        {/* <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-white dark:from-black to-transparent" /> */}

        <div
          ref={listRef}
          role="tablist"
          aria-label={ariaLabel}
          onKeyDown={onKeyDownList}
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "relative flex w-full items-center gap-1 overflow-x-auto hide-scrollbar",
            "[scrollbar-width:none] [-ms-overflow-style:none]",
            listBorders
          )}
        >
          {/* Animated indicator for underline and segmented */}
          {variant !== "pills" && (
            <motion.div
              aria-hidden
              className={cn(
                "absolute top-0",
                isRTL ? "right-0" : "left-0",
                variant === "underline"
                  ? "h-0.5 -bottom-px top-auto bg-primary"
                  : "rounded-2xl bg-white shadow-sm dark:bg-neutral-800"
              )}
              transition={{ type: "spring", stiffness: 500, damping: 40, mass: 1 }}
              animate={{ 
                [isRTL ? 'right' : 'left']: indicator.left, 
                width: indicator.width, 
                height: variant === "underline" ? 2 : indicator.height 
              }}
            />
          )}

          {items.map((tab) => {
            const active = tab.id === activeValue;
            return (
              <div
                key={tab.id}
                ref={(el) => {
                  btnRefs.current[tab.id] = el;
                }}
                role="tab"
                id={`${idBase}-tab-${tab.id}`}
                aria-selected={active}
                aria-controls={`${idBase}-panel-${tab.id}`}
                tabIndex={active ? 0 : -1}
                aria-disabled={tab.disabled || undefined}
                onClick={() => !tab.disabled && setActive(tab.id)}
                onKeyDown={(e) => {
                  if (tab.disabled) return;
                  if (e.key === "Enter" || e.key === " ") {
                    setActive(tab.id);
                    e.preventDefault();
                  }
                }}
                className={cn(
                  variantBtn(active),
                  tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer py-3!",
                  variant === "segmented" && active ? "z-10" : ""
                )}
              >
                <span className={cn("inline-flex items-center", s.gap)}>
                  {tab.icon && <span className="shrink-0 inline-flex">{tab.icon}</span>}
                  <span className="truncate">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={cn(
                        "ml-1 inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold",
                        active
                          ? variant === "pills"
                            ? "bg-white/20 text-white"
                            : "bg-primary text-white"
                          : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-100"
                      )}
                    >
                      {tab.badge}
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Panels */}
      <div className="mt-4">
        {/* Only one child inside AnimatePresence to avoid the 'mode="wait"' warning */}
        <AnimatePresence mode="wait" initial={false}>
          {(() => {
            const activeTab = items.find((t) => t.id === activeValue);
            if (!activeTab) return null;
            const shouldMount = !((lazy || activeTab.lazy) && !mounted.current.has(activeTab.id));
            return (
              <motion.div
                key={activeTab.id}
                role="tabpanel"
                id={`${idBase}-panel-${activeTab.id}`}
                aria-labelledby={`${idBase}-tab-${activeTab.id}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.16 }}
              >
                {shouldMount ? activeTab.content : null}
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </div>
  );
}


// Make Tabs the default export for easy importing
export default Custemtabs;

// ---------- Tailwind helpers ----------
// Hide scrollbar (Firefox, WebKit) while keeping scrollability
// Add these utilities to your global CSS if you don't already have them:
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
