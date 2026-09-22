import type { ComponentType, LazyExoticComponent } from "react"
import type { UserRole } from "@/types/auth"

export type RouteComponent =
  | ComponentType
  | LazyExoticComponent<ComponentType>

export type RouteMeta = {
  layout?: "default" | "defaultTabs" | "megaMenu" | "blank"
  auth?: boolean
  guestOnly?: boolean
  roles?: UserRole[]
  permission?: string
  permissionAll?: string[]
  permissionAny?: string[]
  redirectTo?: string
}

export type RouteItem = {
  path: string
  title?: string
  component: RouteComponent
  meta?: RouteMeta
}

export type AppRoutes = RouteItem[]