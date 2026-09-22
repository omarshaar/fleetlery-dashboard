import { ShieldCheck } from "lucide-react"
import { Page } from "@/eano/components/page/Page"
import PageHeader from "@/eano/components/widgets/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/eano/design-system/shadcn/card"
import { useLanguage } from "@/i18n"
import { useAuth } from "@/components/providers/authContext"

export default function AdminShellPage() {
  const { t } = useLanguage()
  const { user } = useAuth()

  return (
    <Page>
      <PageHeader title={t("admin.home.title")} subtitle={t("admin.home.subtitle")} />
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />{t("admin.home.foundationTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>{t("admin.home.welcome", { name: user?.name })}</p>
          <p className="text-muted-foreground">{t("admin.home.foundationDescription")}</p>
        </CardContent>
      </Card>
    </Page>
  )
}