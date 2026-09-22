/**
 * @file HeaderTabs.tsx
 * @description Responsive tab header component used in defaultTabsLayout.
 * Handles navigation and closing of tabs with full sync to route and Redux.
 */

"use client"

import React from "react"
import type { ReactNode } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { useLanguage } from "@/i18n"
import type { RootState } from "@/store"
import { closeTab, setActiveTab } from "@/layouts/default-tabs/store/tabsSlice"
import { X } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/eano/design-system/shadcn/tooltip"

import { store } from "@/store"

/**
 * Props for the HeaderTabs component.
 */
export type TabsProps = {
  items: TabItem[]
}

/**
 * Definition of a single tab item.
 */
export type TabItem = {
  title: string
  content?: ReactNode
  key?: string | number
  href?: string
  closeDisable?: boolean
  icon?: ReactNode
}

/**
 * HeaderTabs component.
 * - Displays a row of tabs with titles and close buttons.
 * - Supports navigation and removal of tabs.
 * - Keeps Redux state and Router state in perfect sync.
 */
export default function HeaderTabs({ items }: TabsProps) {
  const { isRTL } = useLanguage()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { activeHref } = useSelector((state: RootState) => state.defaultLayoutTabs)

  const scrollRef = React.useRef<HTMLDivElement>(null)

  /**
   * Sync active tab with current route.
   */
  React.useEffect(() => {
    if (location.pathname) {
      dispatch(setActiveTab(location.pathname))
    }
  }, [location.pathname, dispatch])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      // Only convert vertical scrolling
      if (e.deltaY === 0) return

      e.preventDefault()
      // In RTL, reverse the scroll direction
      const scrollAmount = isRTL ? -e.deltaY : e.deltaY
      el.scrollLeft += scrollAmount
    }

    el.addEventListener("wheel", handleWheel, { passive: false })

    return () => el.removeEventListener("wheel", handleWheel)
  }, [isRTL])

  /**
   * Handle clicking a tab → navigate only.
   */
  const handleTabClick = (href?: string) => {
    if (!href) return
    navigate(href)
  }

  /**
   * Handle closing a tab.
   */
  const handleTabClose = (e: React.MouseEvent, href?: string) => {
    e.stopPropagation()
    if (!href) return

    const state = (store.getState() as RootState).defaultLayoutTabs
    const currentTabs = [...state.tabs]
    const active = state.activeHref

    if (href === active) {
      const remainingTabs = currentTabs.filter((t) => t.href !== href)
      let nextHref = "/"

      if (remainingTabs.length > 0) {
        nextHref = remainingTabs[remainingTabs.length - 1].href
      }

      dispatch(closeTab(href))

      setTimeout(() => {
        navigate(nextHref)
      }, 10)
    } else {
      dispatch(closeTab(href))
    }
  }

  return (
    <TooltipProvider delayDuration={2000}>
      <div
        ref={scrollRef}
        dir={isRTL ? "rtl" : "ltr"}
        className="flex items-center gap-1 py-0.5 w-[95%] overflow-auto hide-scrollbar"
      >
        {items?.map((item, index) => {
          const isActive = item.href === activeHref

          return (
            <Tooltip key={item.key || `page-nav-${index}`}>
              <TooltipTrigger asChild>
                <div
                  onClick={() => handleTabClick(item.href)}
                  className={`ode-tab-item flex items-center justify-between px-4 py-3 relative cursor-pointer 
                    border-s border-border first:border-s-0
                    ${isActive ? "ode-tab-item-active" : ""}`}
                >
                  <div className="flex items-center">
                    {item.icon}

                    <p
                      className={`text-[0.875rem] mx-1.5 ${
                        item.closeDisable ? "" : "me-3"
                      } truncate overflow-hidden whitespace-nowrap block max-w-7.5rem`}
                    >
                      {item.title}
                    </p>
                  </div>

                  {!item.closeDisable && (
                    <div
                      onClick={(e) => handleTabClose(e, item.href)}
                      className="cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </TooltipTrigger>

              <TooltipContent side="bottom" className="text-xs">
                {item.title}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
