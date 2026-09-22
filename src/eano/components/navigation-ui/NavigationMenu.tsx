"use client"

import React from "react"
import { Link } from "react-router-dom"
import {
  NavigationMenu as SNavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/eano/design-system/shadcn/navigation-menu"
import { cn } from "@/eano/lib/utils"

/**
 * Unified NavigationMenu component for React (non-Next.js).
 * No dependency on next/link — uses standard <a> elements instead.
 */

export type NavigationMenuSection = {
  /** Label shown on trigger */
  label: string
  /** Optional icon shown next to label */
  icon?: React.ReactNode
  /** Optional link (acts as direct link if no items) */
  href?: string
  /** Optional list of submenu items */
  items?: {
    title: string
    href: string
    description?: string
    icon?: React.ReactNode
  }[]
  /** Optional custom width class for dropdown layout */
  widthClass?: string
}

export type NavigationMenuProps = {
  /** Array of top-level sections */
  sections: NavigationMenuSection[]
  /** Optional flag for mobile viewport */
  isMobile?: boolean
  /** Optional className for wrapper */
  className?: string
}

export function NavigationMenu({
  sections,
  isMobile = false,
  className,
}: NavigationMenuProps) {
  return (
    <SNavigationMenu className={cn("w-full", className)} viewport={isMobile}>
      <NavigationMenuList className="flex-wrap justify-start">
        {sections.map((section, index) => (
          <NavigationMenuItem key={index}>
            {/* Simple link section */}
            {section.href && !section.items ? (
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to={section.href} className="flex items-center gap-2">
                  {section.icon && (
                    <span className="inline-flex h-4 w-4 items-center justify-center">
                      {section.icon}
                    </span>
                  )}
                  <span className="text-sm">{section.label}</span>
                </Link>
              </NavigationMenuLink>
            ) : (
              <>
                <NavigationMenuTrigger>
                  <div className="flex items-center gap-2">
                    {section.icon && (
                      <span className="inline-flex h-4 w-4 items-center justify-center">
                        {section.icon}
                      </span>
                    )}
                    <span className="text-sm">{section.label}</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="relative z-50 p-0!">
                  <ul
                    className={cn(
                      "grid gap-2 p-1.5 w-[230px] md:w-[280px]",
                      section.widthClass ?? ""
                    )}
                  >
                    {section.items?.map((item, i) => (
                      <li key={i}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={item.href}
                            className="flex flex-row items-start gap-2 rounded-md p-2 transition-colors hover:bg-accent focus:bg-accent"
                          >
                            {item.icon && (
                              <span className="mt-1 text-muted-foreground">
                                {item.icon}
                              </span>
                            )}
                            <div>
                              <div className="text-sm font-medium leading-none">
                                {item.title}
                              </div>
                              {item.description && (
                                <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </SNavigationMenu>
  )
}
