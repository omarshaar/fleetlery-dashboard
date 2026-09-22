import type { ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/components/providers/authContext"
import type { UserRole } from "@/types/auth"

type RouteAccessProps = {
  children: ReactNode
  auth?: boolean
  guestOnly?: boolean
  roles?: UserRole[]
}

export function RouteAccess({ children, auth, guestOnly, roles }: RouteAccessProps) {
  const session = useAuth()
  const location = useLocation()

  if (session.isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading…</div>
  }

  if (guestOnly && session.isAuthenticated) {
    return <Navigate to={session.hasRole("admin") ? "/admin" : "/driver"} replace />
  }

  if (auth && !session.isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  }

  if (roles?.length && !roles.some(session.hasRole)) {
    return <Navigate to="/system/403" replace />
  }

  return <>{children}</>
}