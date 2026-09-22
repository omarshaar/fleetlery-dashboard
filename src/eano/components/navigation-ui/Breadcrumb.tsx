import React from "react"
import { Link } from "react-router-dom"
import {
  Breadcrumb as SBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/eano/design-system/shadcn/breadcrumb"

/**
 * Unified Breadcrumb component.
 * Simplifies usage by removing the need to import subcomponents.
 * Accepts an array of items with labels and hrefs.
 */
export type BreadcrumbItemType = {
  label: string
  href?: string
  /** Whether this item represents the current page */
  current?: boolean
}

export type BreadcrumbProps = {
  /** List of breadcrumb items */
  items: BreadcrumbItemType[]
  /** Optional class name for the wrapper */
  className?: string
}

/**
 * Example:
 * <Breadcrumb items={[
 *   { label: "Home", href: "#" },
 *   { label: "Projects", href: "#" },
 *   { label: "EANO Shop", current: true }
 * ]}/>
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <SBreadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild={!!item.href}
                aria-current={item.current ? "page" : undefined}
              >
                {item.href ? (
                  <Link to={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </SBreadcrumb>
  )
}
