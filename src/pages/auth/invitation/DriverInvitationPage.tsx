import { useMemo, useState, type FormEvent } from "react"
import { ChevronDown } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import { Alert, Button, Command, Input, Label, Popover, Select } from "@/components"
import { AuthCard } from "@/components/auth/AuthCard"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useAcceptInvitationMutation, useInspectInvitationQuery } from "@/services/api/driverPortal/driverPortalApi"
import { callingCodes } from "./callingCodes"

const normalizeNationalInput = (value: string, code: (typeof callingCodes)[number]) => {
  const number = value.trimStart()
  const international = `+${code.code}`
  const internationalWithExitCode = `00${code.code}`
  const national = number.startsWith(international)
    ? number.slice(international.length).trimStart()
    : number.startsWith(internationalWithExitCode)
      ? number.slice(internationalWithExitCode.length).trimStart()
      : number
  if (!code.nationalPrefix.startsWith("0")) return national
  if (!national.startsWith(code.nationalPrefix)) return national
  return national.slice(code.nationalPrefix.length).replace(/^0+/, "")
}

const formatPhone = (value: string, code: string, nationalPrefix: string) => {
  const compact = value.trim().replace(/[\s().-]/g, "")
  if (compact.startsWith("+")) return compact
  if (compact.startsWith("00")) return `+${compact.slice(2)}`
  const national = nationalPrefix && compact.startsWith(nationalPrefix)
    ? compact.slice(nationalPrefix.length)
    : compact
  return `+${code}${national}`
}

export default function DriverInvitationPage() {
  const { t, language } = useLanguage()
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""
  const invitation = useInspectInvitationQuery(token, { skip: token.length !== 64 })
  const [accept, state] = useAcceptInvitationMutation()
  const [message, setMessage] = useState("")
  const [fields, setFields] = useState<Record<string, string[]>>({})
  const [done, setDone] = useState(false)
  const [codeOpen, setCodeOpen] = useState(false)
  const [selectedCodeKey, setSelectedCodeKey] = useState("DE:49")
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", password: "", password_confirmation: "", city_id: "", transport_type: "car", birth_date: "", social_security_number: "", identity_expires_at: "" })
  const selectedCode = callingCodes.find((item) => `${item.region}:${item.code}` === selectedCodeKey) ?? callingCodes.find((item) => item.region === "DE")!
  const cities = invitation.data?.cities ?? []
  const citiesUnavailable = invitation.isSuccess && cities.length === 0
  const codeOptions = useMemo(() => {
    const names = new Intl.DisplayNames([language], { type: "region" })
    const collator = new Intl.Collator(language)
    return callingCodes.map((item) => ({
      ...item,
      label: `${item.region === "001" ? t("driverPortal.invitation.internationalNetwork") : names.of(item.region) ?? item.region} +${item.code}`,
    })).sort((a, b) => collator.compare(a.label, b.label))
  }, [language, t])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage(""); setFields({})
    const phone = formatPhone(form.phone, selectedCode.code, selectedCode.nationalPrefix)
    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      setFields({ phone: [t("driverPortal.invitation.invalidPhone")] })
      return
    }
    try {
      await accept({ token, details: { ...form, phone, birth_date: form.birth_date || null, social_security_number: form.social_security_number || null, identity_expires_at: form.identity_expires_at || null } }).unwrap()
      setDone(true)
    } catch (error) {
      const parsed = apiError(error, t("driverPortal.errors.invitationAccept"))
      setMessage(parsed.message); setFields(parsed.fields)
    }
  }

  if (done) return <AuthCard title={t("driverPortal.invitation.doneTitle")} description={t("driverPortal.invitation.doneText")}><Button asChild className="w-full"><Link to="/auth/login">{t("auth.actions.login")}</Link></Button></AuthCard>
  if (!token || invitation.error) return <AuthCard title={t("driverPortal.invitation.invalidTitle")} description={t("driverPortal.invitation.invalidText")}><Button asChild className="w-full"><Link to="/auth/login">{t("auth.actions.login")}</Link></Button></AuthCard>

  return <AuthCard title={t("driverPortal.invitation.title")} description={t("driverPortal.invitation.subtitle")}>
    <form className="space-y-3" onSubmit={(event) => void submit(event)}>
      {message && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
      <Input label={t("drivers.fields.fullName")} required value={form.full_name} error={fields.full_name?.[0]} onChange={(event) => setForm({ ...form, full_name: event.target.value })} />
      <Input label={t("drivers.fields.email")} type="email" required value={form.email} error={fields.email?.[0]} onChange={(event) => setForm({ ...form, email: event.target.value })} />
      <div className="grid grid-cols-[8rem_minmax(0,1fr)] items-end gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <Label className="text-sm font-medium">{t("driverPortal.invitation.callingCode")}</Label>
          <Popover open={codeOpen} onOpenChange={setCodeOpen} align="start" contentClassName="w-[min(22rem,calc(100vw-2rem))] p-0" content={<Command className="w-full min-w-0 border-0 shadow-none md:min-w-0" placeholder={t("driverPortal.invitation.searchCallingCode")} emptyMessage={t("driverPortal.invitation.noCallingCode")} groups={[{ items: codeOptions.map((item) => ({ label: item.label, onSelect: () => { setSelectedCodeKey(`${item.region}:${item.code}`); setForm((current) => ({ ...current, phone: normalizeNationalInput(current.phone, item) })); setCodeOpen(false) } })) }]} />}>
            <Button type="button" variant="outline" role="combobox" aria-expanded={codeOpen} aria-label={t("driverPortal.invitation.callingCode")} className="w-full justify-between" dir="ltr">+{selectedCode.code}<ChevronDown className="size-4 shrink-0" /></Button>
          </Popover>
        </div>
        <Input label={t("drivers.fields.phone")} type="tel" inputMode="tel" autoComplete="tel-national" dir="ltr" required placeholder={t("driverPortal.invitation.phonePlaceholder")} value={form.phone} error={fields.phone?.[0]} onChange={(event) => setForm({ ...form, phone: normalizeNationalInput(event.target.value, selectedCode) })} />
      </div>
      {citiesUnavailable && <Alert variant="destructive" description={t("driverPortal.invitation.noCities")} />}
      <Select label={t("drivers.fields.city")} required disabled={invitation.isLoading || citiesUnavailable} placeholder={invitation.isLoading ? t("common.loading") : t("driverPortal.invitation.chooseCity")} options={cities.map((city) => ({ label: city.name, value: city.id }))} value={form.city_id || undefined} error={fields.city_id?.[0]} onChange={(value) => setForm({ ...form, city_id: value })} />
      <Select label={t("drivers.fields.transport")} required options={[{ label: t("drivers.transport.car"), value: "car" }, { label: t("drivers.transport.bicycle"), value: "bicycle" }]} value={form.transport_type} onChange={(value) => setForm({ ...form, transport_type: value })} />
      <Input label={t("drivers.fields.birthDate")} type="date" value={form.birth_date} error={fields.birth_date?.[0]} onChange={(event) => setForm({ ...form, birth_date: event.target.value })} />
      <Input label={t("drivers.fields.socialSecurity")} value={form.social_security_number} error={fields.social_security_number?.[0]} onChange={(event) => setForm({ ...form, social_security_number: event.target.value })} />
      <Input label={t("drivers.fields.identityExpiry")} type="date" value={form.identity_expires_at} error={fields.identity_expires_at?.[0]} onChange={(event) => setForm({ ...form, identity_expires_at: event.target.value })} />
      <Input label={t("auth.fields.password")} type="password" required value={form.password} error={fields.password?.[0]} onChange={(event) => setForm({ ...form, password: event.target.value })} />
      <Input label={t("driverPortal.invitation.confirmPassword")} type="password" required value={form.password_confirmation} onChange={(event) => setForm({ ...form, password_confirmation: event.target.value })} />
      <Button type="submit" className="w-full" disabled={state.isLoading || invitation.isLoading || citiesUnavailable}>{state.isLoading ? t("common.loading") : t("driverPortal.invitation.createAccount")}</Button>
    </form>
  </AuthCard>
}
