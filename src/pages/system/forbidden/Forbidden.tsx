import { Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "@/components/providers/authContext"
import { Button } from "@/eano/design-system/shadcn/button"
import { useLanguage } from "@/i18n"
import { useLogoutMutation } from "@/services/api/auth/authApi"

export default function Forbidden() {
  const { t } = useLanguage()
  const session = useAuth()
  const navigate = useNavigate()
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } finally {
      navigate("/auth/login", { replace: true })
    }
  }

  if (session.isLoading) {
    return <div className="p-6 text-center text-muted-foreground">{t("common.loading")}</div>
  }

  if (!session.isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div>
        <p className="text-6xl font-bold">403</p>
        <h1 className="mt-4 text-2xl font-semibold">{t("system.forbidden.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("system.forbidden.description")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/">{t("system.forbidden.home")}</Link></Button>
          <Button variant="outline" disabled={isLoggingOut} onClick={() => void handleLogout()}>
            {isLoggingOut ? t("common.loading") : t("auth.actions.logout")}
          </Button>
        </div>
      </div>
    </main>
  )
}
