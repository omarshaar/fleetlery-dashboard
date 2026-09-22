import { Link } from "react-router-dom"
import { Button } from "@/eano/design-system/shadcn/button"
import { useLanguage } from "@/i18n"

export default function Forbidden() {
  const { t } = useLanguage()
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center">
      <div>
        <p className="text-6xl font-bold">403</p>
        <h1 className="mt-4 text-2xl font-semibold">{t("system.forbidden.title")}</h1>
        <p className="mt-2 text-muted-foreground">{t("system.forbidden.description")}</p>
        <Button asChild className="mt-6"><Link to="/">{t("system.forbidden.home")}</Link></Button>
      </div>
    </main>
  )
}