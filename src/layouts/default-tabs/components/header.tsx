import { useCallback, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/eano/design-system/shadcn/button"
import HeaderTabs from "@/eano/design-system/custem/tabs/HeaderTabs"
import { setActiveTab } from "@/layouts/default-tabs/store/tabsSlice"
import type { RootState } from "@/store"
import { SidebarMenuToggle } from "@/eano/design-system/shadcn/components/app-sidebar"
import { useSidebar } from "@/eano/design-system/shadcn/sidebar"

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const stored = localStorage.getItem("theme")
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const activeDark = stored ? stored === "dark" : preferDark
    root.classList.toggle("dark", activeDark)
    setIsDark(activeDark)
  }, [])

  const handleToggle = useCallback(() => {
    const root = document.documentElement
    root.classList.toggle("dark")
    const darkNow = root.classList.contains("dark")
    localStorage.setItem("theme", darkNow ? "dark" : "light")
    setIsDark(darkNow)
  }, [])

  return (
    <Button variant="outline" size="icon" className="h-9 w-9 sidebar-menu-button" onClick={handleToggle}>
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

export default function Header() {
  const { open, isMobile, openMobile } = useSidebar();
  const isOpen = isMobile ? openMobile : open;

  return (
    <header className="dark:bg-black bg-white border-b border-border sticky top-0 z-50 w-full h-(--header-height)">
      <div className="flex items-center h-full">
        {isOpen ? <></> : <SidebarMenuToggle variant="outline" className="ms-4 me-1" />}
        <div className="flex-1 whitespace-nowrap scrollbar-thumb-muted-foreground/30 scrollbar-thumb-rounded-md w-[200px]">
          <HeaderTabsContainer />
        </div>

        <div className="shrink-0 px-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}


function HeaderTabsContainer() {
  const { tabs } = useSelector((state: RootState) => state.defaultLayoutTabs)
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    if (location.pathname) {
      dispatch(setActiveTab(location.pathname))
    }
  }, [location.pathname, dispatch])

  return (
    <HeaderTabs items={tabs} />
  )
}