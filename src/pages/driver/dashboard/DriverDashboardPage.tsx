import { AlertCircle, Banknote, CheckCircle, Files } from "lucide-react"
import { Button, Card, CardContent, Page, PageHeader, Skeleton, StatMiniWidget } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DriverStatusBadge } from "@/components/drivers/DriverStatusBadge"
import { useLanguage } from "@/i18n"
import { useGetDriverDashboardQuery } from "@/services/api/driverPortal/driverPortalApi"

const money = (value: string, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(value))
export default function DriverDashboardPage() {
  const { t } = useLanguage(); const query = useGetDriverDashboardQuery()
  if (query.isLoading) return <Page><div className="grid gap-3 md:grid-cols-3">{[1,2,3].map((item) => <Skeleton key={item} className="h-36" />)}</div></Page>
  if (!query.data) return <Page><Card><CardContent className="flex items-center justify-between pt-6"><p className="text-destructive">{apiError(query.error, t("driverPortal.errors.dashboard")).message}</p><Button variant="outline" onClick={() => void query.refetch()}>{t("driverPortal.actions.retry")}</Button></CardContent></Card></Page>
  const data = query.data
  return <Page><PageHeader title={t("driverPortal.dashboard.title")} subtitle={t("driverPortal.dashboard.subtitle")}><DriverStatusBadge status={data.driver_status} /></PageHeader>
    {data.requires_attention && <Card className="mt-4 border-destructive/40"><CardContent className="flex items-center gap-3 pt-6"><AlertCircle className="text-destructive" /><div><p className="font-medium">{t("driverPortal.dashboard.attention")}</p><p className="text-sm text-muted-foreground">{t("driverPortal.dashboard.attentionHint")}</p></div></CardContent></Card>}
    <div className="mt-4 grid auto-rows-[140px] gap-3 md:grid-cols-3"><StatMiniWidget navigateTo="/driver/documents" data={{ title: t("driverPortal.dashboard.documentsAccepted"), value: `${data.documents.accepted} / ${data.documents.total}`, icon: <CheckCircle /> }} /><StatMiniWidget navigateTo="/driver/documents" data={{ title: t("driverPortal.dashboard.documentsOpen"), value: data.documents.missing + data.documents.rejected, icon: <Files /> }} /><StatMiniWidget navigateTo="/driver/settlements" data={{ title: t("driverPortal.dashboard.remaining"), value: money(data.settlements.remaining_amount, data.settlements.currency), icon: <Banknote /> }} /></div>
  </Page>
}
