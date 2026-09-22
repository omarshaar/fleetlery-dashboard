import { useMemo, type ReactNode } from "react"
import { AuthContext, type AuthContextValue } from "@/components/providers/authContext"
import { AbilityContext } from "@/eano/access-control/core/AbilityContext"
import { buildAbility } from "@/eano/access-control/core/ability"
import { useGetCurrentUserQuery } from "@/services/api/auth/authApi"
import { toCaslPermission } from "@/types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isFetching, refetch } = useGetCurrentUserQuery()
  const user = data ?? null
  const normalizedPermissions = useMemo(
    () =>
      (user?.permissions ?? [])
        .map(toCaslPermission)
        .filter((permission): permission is `${string}.${string}` => permission !== null),
    [user?.permissions],
  )
  const ability = useMemo(
    () => buildAbility(normalizedPermissions),
    [normalizedPermissions],
  )
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading: isLoading || isFetching,
      isAuthenticated: user !== null,
      hasRole: (role) => user?.roles.includes(role) ?? false,
      hasPermission: (permission) => user?.permissions.includes(permission) ?? false,
      refetch: () => {
        void refetch()
      },
    }),
    [user, isLoading, isFetching, refetch],
  )

  return (
    <AuthContext.Provider value={value}>
      <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    </AuthContext.Provider>
  )
}