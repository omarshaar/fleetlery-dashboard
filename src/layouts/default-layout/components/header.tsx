import { useEffect, useState } from "react"
// import { LOGO } from "@/layouts/default-layout/components"
import { ChevronDown, Moon, Sun } from "lucide-react"
import { useLanguage } from "@/i18n/hooks"

import { Button } from "@/eano/design-system/shadcn/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  // DropdownMenuLabel,
} from "@/eano/design-system/shadcn/dropdown-menu"
// import { Avatar, AvatarImage, AvatarFallback } from "@/design-system/shadcn/avatar"
// import { Separator } from "@/design-system/shadcn/separator" 
import { useSidebar } from "@/eano/design-system/shadcn/sidebar"
import { SidebarMenuToggle } from "@/eano/design-system/shadcn/components/app-sidebar"

function ThemeToggle({ t }: { t: (key: string) => string }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const activeDark = stored ? stored === "dark" : preferDark
    root.classList.toggle("dark", activeDark)
    setIsDark(activeDark)
  }, []);

  const toggle = () => {
    const root = document.documentElement
    root.classList.toggle("dark")
    const darkNow = root.classList.contains("dark")
    localStorage.setItem("theme", darkNow ? "dark" : "light")
    setIsDark(darkNow)
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      className="h-9 w-9 sidebar-menu-button" 
      onClick={toggle}
      title={t('header.theme.toggle')}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">{t('header.theme.toggle')}</span>
    </Button>
  )
}
export default function Header() {
  const { language, changeLanguage, t } = useLanguage();
  const { open, isMobile, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  const languages = [
    { code: 'ar', label: 'AR', flag: '🇸🇦' },
    { code: 'en', label: 'EN', flag: '🇺🇸' },
    { code: 'de', label: 'DE', flag: '🇩🇪' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <header className="dark:bg-black bg-white w-full h-(--header-height) min-h-(--header-height) border-b border-border px-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: mobile nav + logo/breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {isOpen ? <></> : <SidebarMenuToggle variant="outline" className="" />}
        <div className="flex items-center gap-2">
          {/* <LOGO />
          <Separator orientation="vertical" className="mx-1 hidden sm:block" /> */}
          <div className="hidden sm:block text-muted-foreground">
            <span className="text-foreground/90">{t('header.dashboard')}</span>
          </div>
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-2">
        {/* Language */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 gap-2 min-w-[72px] sidebar-menu-button">
              {currentLanguage?.label || 'EN'}
              <ChevronDown className="h-4 w-4 opacity-70" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {languages.map((lang) => (
              <DropdownMenuItem 
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={language === lang.code ? 'bg-accent' : ''}
              >
                <span className="mr-2">{lang.flag}</span>
                {lang.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle t={t} />
      </div>
    </header>
  )
}
