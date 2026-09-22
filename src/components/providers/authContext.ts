import { createContext, useContext } from "react"
import type { CurrentUser, UserRole } from "@/types/auth"

export type AuthContextValue = {
  user: CurrentUser | null
  isLoading: boolean
  isAuthenticated: boolean
  hasRole: (role: UserRole) => boolean
  hasPermission: (permission: string) => boolean
  refetch: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext)
  if (!value) throw new Error("useAuth must be used inside AuthProvider")
  return value
}