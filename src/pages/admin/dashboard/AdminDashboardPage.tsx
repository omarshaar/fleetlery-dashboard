import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  FileClock,
  FileX2,
  UserPlus,
  Users,
} from "lucide-react"
import { apiError } from "@/components/auth/apiError"
import { Page } from "@/eano/components/page/Page"
import { Button, Card, CardContent, CardHeader, CardTitle, PageHeader, Select } from "@/components"
import { StatMiniWidget } from "@/eano/components/widgets/StatMiniWidget"
import { StatMiniSkeleton } from "@/eano/components/widgets/skeletons/WidgetSkeletons"
import { useLanguage } from "@/i18n"
import { useGetAdminDashboardQuery, useGetCitiesQuery } from "@/services/api/dashboard/dashboardApi"
import { useState } from "react"

export default function AdminDashboardPage() {
  const { t, language } = useLanguage()
  const [cityId, setCityId] = useState("")
  const dashboard = useGetAdminDashboardQuery(cityId || undefined)
  const cities = useGetCitiesQuery()
  const data = dashboard.data

  const cards = data ? [
    { title: t("admin.dashboard.kpi.total"), value: data.drivers.total, icon: <Users /> },
    { title: t("admin.dashboard.kpi.active"), value: data.drivers.active, icon: <CheckCircle2 /> },
    { title: t("admin.dashboard.kpi.new"), value: data.drivers.new, icon: <UserPlus /> },
    { title: t("admin.dashboard.kpi.review"), value: data.drivers.under_review, icon: <FileClock /> },
    { title: t("admin.dashboard.kpi.missingDocuments"), value: data.documents.missing, icon: <FileX2 /> },
    { title: t("admin.dashboard.kpi.openSettlements"), value: data.finance.open_settlements, icon: <Banknote /> },
  ] : []

  const attention = data ? [
    [t("admin.dashboard.attention.documentReview"), data.documents.needs_review],
    [t("admin.dashboard.attention.rejectedDocuments"), data.documents.rejected],
    [t("admin.dashboard.attention.identityExpired"), data.attention.identity_expired],
    [t("admin.dashboard.attention.identityExpiring"), data.attention.identity_expiring_within_30_days],
    [t("admin.dashboard.attention.privacyOverdue"), data.privacy.overdue_requests],
  ] as const : []

  const errorMessage = dashboard.error
    ? apiError(dashboard.error, t("admin.dashboard.error")).message
    : ""

  return (
    <Page>
      <PageHeader title={t("admin.dashboard.title")} subtitle={t("admin.dashboard.subtitle")}>
        <div className="flex flex-wrap gap-2">
          <Select
            className="h-9"
            placeholder={t("admin.dashboard.allCities")}
            options={[
              { label: t("admin.dashboard.allCities"), value: "__all__" },
              ...(cities.data ?? []).map((city) => ({ label: city.name, value: city.id })),
            ]}
            value={cityId || "__all__"}
            onChange={(value) => setCityId(value === "__all__" ? "" : value)}
          />
        </div>
      </PageHeader>

      {errorMessage ? (
        <Card className="mt-4 border-destructive/50">
          <CardContent className="flex items-center justify-between gap-4 pt-6">
            <p role="alert" className="text-sm text-destructive">{errorMessage}</p>
            <Button variant="outline" onClick={() => void dashboard.refetch()}>{t("admin.dashboard.retry")}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3" aria-label={t("admin.dashboard.kpiSection")}>
            {dashboard.isLoading
              ? Array.from({ length: 6 }, (_, index) => <StatMiniSkeleton key={index} className="h-32" />)
              : cards.map((card) => <StatMiniWidget key={card.title} data={card} animated className="h-32" />)}
          </section>

          {data && (
            <section className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>{t("admin.dashboard.cities.title")}</CardTitle></CardHeader>
                <CardContent className="scrollbar-hidden max-h-64 space-y-4 overflow-x-hidden overflow-y-auto overscroll-contain pe-2">
                  {data.drivers.by_city.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("admin.dashboard.cities.empty")}</p>
                  ) : data.drivers.by_city.map((city) => {
                    const maximum = Math.max(...data.drivers.by_city.map((item) => item.total), 1)
                    return (
                      <div key={city.id}>
                        <div className="mb-1 flex justify-between text-sm"><span>{city.name}</span><strong>{city.total}</strong></div>
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((city.total / maximum) * 100, city.total ? 4 : 0)}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" />{t("admin.dashboard.attention.title")}</CardTitle></CardHeader>
                <CardContent className="divide-y">
                  {attention.map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between py-3 text-sm">
                      <span className="text-muted-foreground">{label}</span>
                      <strong className={value > 0 ? "text-destructive" : "text-foreground"}>{value}</strong>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </section>
          )}

          {data && (
            <p className="mt-4 text-xs text-muted-foreground">
              {t("admin.dashboard.generatedAt", { value: new Intl.DateTimeFormat(language, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }).format(new Date(data.generated_at)) })}
            </p>
          )}
        </>
      )}
    </Page>
  )
}