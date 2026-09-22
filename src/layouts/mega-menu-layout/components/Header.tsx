
import { memo, useEffect, useState } from "react";
import { useLanguage } from "@/i18n/hooks";
import { Search, Sun, Moon, Maximize, Globe, Settings, ChevronDown } from "lucide-react";
import { Button, Input, Logo, DropdownMenu } from "@/components";
import UserMenu from "./UserMenu";


const LANGUAGES = [
  { code: "ar", label: "AR" },
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
];

function Header() {
  const { t, language, changeLanguage } = useLanguage();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Set theme on mount
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const activeDark = stored ? stored === "dark" : preferDark;
    root.classList.toggle("dark", activeDark);
    setIsDark(activeDark);
  }, []);

  // Handlers
  const handleToggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    const darkNow = root.classList.contains("dark");
    localStorage.setItem("theme", darkNow ? "dark" : "light");
    setIsDark(darkNow);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleToggleSearch = () => setIsSearchOpen((open) => !open);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === language) ?? LANGUAGES[1];

  return (
    <header className="z-50 w-full border-b bg-white dark:bg-black dark:border-border shadow-sm">
      <div className="w-full">
        <div className="flex h-(--header-height) items-center justify-between px-4 md:px-6 lg:px-8">
          {/* Left: Logo */}
          <div className="flex items-center gap-3 md:gap-6">
            <Logo />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t("common.search") || "Quick Search..."}
                className="pl-9 w-64 lg:w-80 border-border dark:border-border"
              />
            </div>

            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleToggleSearch}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Language Switcher */}
            <DropdownMenu
              align="end"
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 md:w-auto md:px-3 flex items-center gap-1 md:pe-0! mx-2.5"
                  title={currentLanguage.label}
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-semibold">
                    {currentLanguage.label}
                  </span>
                  <ChevronDown className="hidden md:block h-3 w-3 opacity-70" />
                </Button>
              }
              items={LANGUAGES.map((lang) => ({
                label: lang.label,
                onClick: () => changeLanguage(lang.code),
                rightSlot:
                  language === lang.code ? <span className="text-xs">✓</span> : undefined,
              }))}
            />

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={handleToggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={handleToggleFullscreen}
              aria-label="Toggle fullscreen"
            >
              <Maximize className="h-5 w-5" />
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5" />
            </Button>

            {/* User Menu */}
            <UserMenu />
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t dark:border-gray-800 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder={t("common.search") || "Quick Search..."}
                className="pl-9 bg-gray-50 dark:bg-gray-800"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default memo(Header);
