import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, Page, PageHeader, Skeleton, Textarea } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DriverForm } from "@/components/drivers/DriverForm"
import { DriverStatusBadge } from "@/components/drivers/DriverStatusBadge"
import { useLanguage } from "@/i18n"
import { useGetDriverCitiesQuery, useGetDriverProfileQuery, useGetOwnProfileChangesQuery, useRequestProfileChangeMutation } from "@/services/api/driverPortal/driverPortalApi"
import type { DriverFormValues } from "@/types/driver"

export default function DriverProfilePage() {
  const { t } = useLanguage(); const profile = useGetDriverProfileQuery(); const cities = useGetDriverCitiesQuery(); const requests = useGetOwnProfileChangesQuery(); const [requestChange, requestState] = useRequestProfileChangeMutation()
  const [message, setMessage] = useState(""); const [success, setSuccess] = useState(""); const [fields, setFields] = useState<Record<string,string[]>>({}); const [note, setNote] = useState("")
  if (profile.isLoading) return <Page><Skeleton className="h-80" /></Page>
  const driver = profile.data
  if (!driver) return <Page><p className="rounded-md bg-destructive/10 p-4 text-destructive">{apiError(profile.error, t("driverPortal.errors.profile")).message}</p></Page>
  const initial: DriverFormValues = { full_name: driver.full_name, email: driver.email ?? "", phone: driver.phone, city_id: driver.city.id, transport_type: driver.transport_type, birth_date: driver.birth_date ?? "", social_security_number: driver.social_security_number ?? "", identity_expires_at: driver.identity_expires_at ?? "" }
  const pending = requests.data?.some((item) => item.status === "pending") ?? false
  const submit = async (values: DriverFormValues) => {
    setMessage(""); setSuccess(""); setFields({})
    const changes: Record<string,string|null> = {}; for (const key of Object.keys(values) as Array<keyof DriverFormValues>) if (values[key] !== initial[key]) changes[key] = values[key] || null
    if (!Object.keys(changes).length) { setMessage(t("driverPortal.profile.noChanges")); return }
    try { await requestChange({ changes, driver_note: note || null }).unwrap(); setSuccess(t("driverPortal.profile.requestSent")); setNote("") } catch (error) { const parsed = apiError(error, t("driverPortal.errors.changeRequest")); setMessage(parsed.message); setFields(parsed.fields) }
  }
  return <Page><PageHeader title={t("driverPortal.profile.title")} subtitle={t("driverPortal.profile.subtitle")}><DriverStatusBadge status={driver.status} /></PageHeader>
    {message && <p className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}{success && <p className="mt-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{success}</p>}
    {pending ? <Card className="mt-4"><CardContent className="pt-6"><p className="font-medium">{t("driverPortal.profile.pendingTitle")}</p><p className="mt-1 text-sm text-muted-foreground">{t("driverPortal.profile.pendingHint")}</p></CardContent></Card> : <div className="mt-4"><DriverForm initialValues={initial} cities={(cities.data ?? [{ id: driver.city.id, name: driver.city.name }]).map((city) => ({ ...city, is_active: true, drivers_count: 0 }))} errors={fields} isSaving={requestState.isLoading} submitLabel={t("driverPortal.profile.submit")} onSubmit={(values) => void submit(values)} /><Textarea className="mt-4" label={t("driverPortal.profile.note")} value={note} onChange={(event) => setNote(event.target.value)} /></div>}
    <Card className="mt-4"><CardHeader><CardTitle>{t("driverPortal.profile.history")}</CardTitle></CardHeader><CardContent className="space-y-3">{requests.isLoading ? <Skeleton className="h-20" /> : !requests.data?.length ? <p className="text-sm text-muted-foreground">{t("driverPortal.profile.noRequests")}</p> : requests.data.map((item) => <div key={item.id} className="rounded-md border p-3"><div className="flex justify-between gap-3"><span className="font-medium">{t(`driverPortal.requestStatus.${item.status}`)}</span><span className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</span></div>{item.decision_reason && <p className="mt-2 text-sm">{item.decision_reason}</p>}</div>)}</CardContent></Card>
  </Page>
}
