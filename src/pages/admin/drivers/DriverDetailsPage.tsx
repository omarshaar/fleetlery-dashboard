import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react"
import { useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Button, Card, CardContent, CardHeader, CardTitle, Page, PageHeader, Skeleton } from "@/components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/eano/design-system/shadcn/tabs"
import { apiError } from "@/components/auth/apiError"
import { DriverForm } from "@/components/drivers/DriverForm"
import { DriverDocumentsPanel } from "@/components/documents/DriverDocumentsPanel"
import { DriverStatusBadge } from "@/components/drivers/DriverStatusBadge"
import { DriverStatusPanel } from "@/components/drivers/DriverStatusPanel"
import { useAuth } from "@/components/providers/authContext"
import { useLanguage } from "@/i18n"
import { useGetCitiesQuery } from "@/services/api/dashboard/dashboardApi"
import { useGetDriverQuery, useUpdateDriverMutation } from "@/services/api/drivers/driversApi"
import type { DriverFormValues } from "@/types/driver"

export default function DriverDetailsPage() {
  const { driverId = "" } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get("tab") === "documents" ? "documents" : "information"
  const changeTab = (tab: string) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)
      if (tab === "documents") next.set("tab", "documents")
      else next.delete("tab")
      return next
    }, { replace: true })
  }
  const { t, language } = useLanguage()
  const { hasPermission } = useAuth()
  const driverQuery = useGetDriverQuery(driverId)
  const cities = useGetCitiesQuery()
  const [updateDriver, updateState] = useUpdateDriverMutation()
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState("")
  const [fields, setFields] = useState<Record<string, string[]>>({})
  const driver = driverQuery.data

  if (driverQuery.isLoading) return <Page><div className="space-y-4"><Skeleton className="h-12 w-72" /><Skeleton className="h-72 w-full" /></div></Page>
  if (!driver) {
    const error = driverQuery.error ? apiError(driverQuery.error, t("drivers.errors.details")).message : t("drivers.errors.details")
    return <Page><p role="alert" className="rounded-md bg-destructive/10 p-4 text-destructive">{error}</p></Page>
  }

  const initialValues: DriverFormValues = {
    full_name: driver.full_name,
    email: driver.email ?? "",
    phone: driver.phone,
    city_id: driver.city.id,
    transport_type: driver.transport_type,
    birth_date: driver.birth_date ?? "",
    social_security_number: driver.social_security_number ?? "",
    identity_expires_at: driver.identity_expires_at ?? "",
  }

  const save = async (values: DriverFormValues) => {
    setMessage(""); setSuccess(""); setFields({})
    const changed: Record<string, string | null> = {}
    for (const key of Object.keys(values) as Array<keyof DriverFormValues>) {
      if (values[key] !== initialValues[key]) changed[key] = values[key] || null
    }
    if (Object.keys(changed).length === 0) {
      setSuccess(t("drivers.details.noChanges"))
      return
    }
    try {
      await updateDriver({ id: driver.id, version: driver.version, ...changed }).unwrap()
      setSuccess(t("drivers.details.saved"))
    } catch (error) {
      const parsed = apiError(error, t("drivers.errors.update"))
      setMessage(parsed.message); setFields(parsed.fields)
      if (typeof error === "object" && error && "status" in error && error.status === 409) void driverQuery.refetch()
    }
  }

  return (
    <Page>
      <PageHeader title={driver.full_name} subtitle={t("drivers.details.subtitle")}>
        <Button asChild variant="outline" size="sm"><Link to="/admin/drivers"><ArrowLeft />{t("drivers.actions.back")}</Link></Button>
        <Button asChild size="sm"><a href={driver.whatsapp_url} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button>
      </PageHeader>

      <div className="mt-4 space-y-4">
        <Tabs value={activeTab} onValueChange={changeTab} className="w-full">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="information">{t("drivers.details.informationTab")}</TabsTrigger>
            <TabsTrigger value="documents">{t("drivers.details.documentsTab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="information" forceMount className="mt-4 space-y-4 data-[state=inactive]:hidden">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle>{t("drivers.details.summary")}</CardTitle>
                  <DriverStatusBadge status={driver.status} />
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
                <div className="min-w-0 rounded-md bg-muted/40 p-3">
                  <p className="flex items-center gap-2 text-muted-foreground"><Phone className="size-4 shrink-0" />{t("drivers.fields.phone")}</p>
                  <p className="mt-1 font-medium" dir="ltr">{driver.phone}</p>
                </div>
                <div className="min-w-0 rounded-md bg-muted/40 p-3">
                  <p className="flex items-center gap-2 text-muted-foreground"><Mail className="size-4 shrink-0" />{t("drivers.fields.email")}</p>
                  <p className="mt-1 break-all font-medium">{driver.email || "—"}</p>
                </div>
                <div className="min-w-0 rounded-md bg-muted/40 p-3">
                  <p className="text-muted-foreground">{t("drivers.fields.city")}</p>
                  <p className="mt-1 font-medium">{driver.city.name}</p>
                </div>
                <div className="min-w-0 rounded-md bg-muted/40 p-3">
                  <p className="text-muted-foreground">{t("drivers.fields.transport")}</p>
                  <p className="mt-1 font-medium">{t("drivers.transport." + driver.transport_type)}</p>
                </div>
                <div className="min-w-0 rounded-md bg-muted/40 p-3">
                  <p className="text-muted-foreground">{t("drivers.details.createdAt")}</p>
                  <p className="mt-1 font-medium">{new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "Europe/Berlin" }).format(new Date(driver.created_at))}</p>
                </div>
              </CardContent>
            </Card>
            <div>
              {message && <p role="alert" className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
              {success && <p role="status" className="mb-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{success}</p>}
              {hasPermission("drivers.edit") ? (
                <DriverForm fullWidthSubmit key={driver.version} initialValues={initialValues} cities={cities.data ?? []} errors={fields} isSaving={updateState.isLoading} submitLabel={t("drivers.actions.save")} onSubmit={(values) => void save(values)} />
              ) : (
                <Card><CardHeader><CardTitle>{t("drivers.form.basicData")}</CardTitle></CardHeader><CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {Object.entries({
                    [t("drivers.fields.fullName")]: driver.full_name,
                    [t("drivers.fields.email")]: driver.email || "—",
                    [t("drivers.fields.birthDate")]: driver.birth_date || "—",
                    [t("drivers.fields.socialSecurity")]: driver.social_security_number || "—",
                    [t("drivers.fields.identityExpiry")]: driver.identity_expires_at || "—",
                  }).map(([label, value]) => <div key={label}><p className="text-sm text-muted-foreground">{label}</p><p className="font-medium">{value}</p></div>)}
                </CardContent></Card>
              )}
            </div>
            <DriverStatusPanel driver={driver} />
          </TabsContent>
          <TabsContent value="documents" forceMount className="mt-4 data-[state=inactive]:hidden">
            <DriverDocumentsPanel driverId={driver.id} />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  )
}