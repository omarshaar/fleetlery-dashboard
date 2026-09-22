import { CheckCircle, RefreshCw, XCircle } from "lucide-react"
import { Button, Card, CardContent, Page, PageHeader, Skeleton } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useGetReadinessQuery } from "@/services/api/governance/governanceApi"

export default function ReadinessPage() {
  const { t } = useLanguage()
  const query = useGetReadinessQuery()

  return <Page>
    <PageHeader title={t("governance.readiness.title")} subtitle={t("governance.readiness.subtitle")}>
      <Button variant="outline" disabled={query.isFetching} onClick={() => void query.refetch()}><RefreshCw className={query.isFetching ? "animate-spin" : ""} />{t("driverPortal.actions.refresh")}</Button>
    </PageHeader>
    {query.isLoading ? <Skeleton className="mt-4 h-60" /> : !query.data ? <p className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error, t("governance.readiness.error")).message}</p> : <>
      <Card className={`mt-4 ${query.data.ready ? "border-primary/40" : "border-destructive/40"}`}><CardContent className="flex items-center gap-3 pt-6">
        {query.data.ready ? <CheckCircle className="text-primary" /> : <XCircle className="text-destructive" />}
        <div><p className="font-semibold">{query.data.ready ? t("governance.readiness.ready") : t("governance.readiness.notReady")}</p><p className="text-sm text-muted-foreground">{t("governance.readiness.hint")}</p></div>
      </CardContent></Card>
      <div className="mt-4 grid gap-3 md:grid-cols-2">{query.data.checks.map((check) => <Card key={check.name}><CardContent className="flex items-start justify-between gap-3 pt-6"><div><p className="break-words font-medium">{t(`governance.readiness.checks.${check.name}`)}</p>{check.remediation && <p className="mt-1 text-sm text-muted-foreground">{check.remediation}</p>}</div>{check.passed ? <CheckCircle className="shrink-0 text-primary" /> : <XCircle className="shrink-0 text-destructive" />}</CardContent></Card>)}</div>
    </>}
  </Page>
}