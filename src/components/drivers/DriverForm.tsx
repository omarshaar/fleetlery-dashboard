import { useState, type FormEvent } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@/components"
import { useLanguage } from "@/i18n"
import type { CityOption } from "@/types/dashboard"
import type { DriverFormValues } from "@/types/driver"

type Props = {
  initialValues: DriverFormValues
  cities: CityOption[]
  errors?: Record<string, string[]>
  isSaving: boolean
  submitLabel: string
  fullWidthSubmit?: boolean
  onSubmit: (values: DriverFormValues) => void
}

export function DriverForm({ initialValues, cities, errors = {}, isSaving, submitLabel, fullWidthSubmit = false, onSubmit }: Props) {
  const { t } = useLanguage()
  const [values, setValues] = useState(initialValues)
  const update = (field: keyof DriverFormValues, value: string) => setValues((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit(values)
  }

  return (
    <form onSubmit={submit}>
      <Card>
        <CardHeader><CardTitle>{t("drivers.form.basicData")}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input label={t("drivers.fields.fullName")} required autoComplete="name" value={values.full_name} error={errors.full_name?.[0]} onChange={(event) => update("full_name", event.target.value)} />
          <Input label={t("drivers.fields.phone")} required type="tel" placeholder="+4915112345678" autoComplete="tel" value={values.phone} error={errors.phone?.[0]} onChange={(event) => update("phone", event.target.value)} />
          <Input label={t("drivers.fields.email")} type="email" autoComplete="email" value={values.email} error={errors.email?.[0]} onChange={(event) => update("email", event.target.value)} />
          <Select
            id="driver-city"
            label={t("drivers.fields.city")}
            required
            placeholder={t("drivers.form.chooseCity")}
            options={cities.map((city) => ({ label: city.name, value: city.id }))}
            value={values.city_id}
            error={errors.city_id?.[0]}
            onChange={(value) => update("city_id", value)}
          />
          <Select
            id="driver-transport"
            label={t("drivers.fields.transport")}
            required
            options={[
              { label: t("drivers.transport.car"), value: "car" },
              { label: t("drivers.transport.bicycle"), value: "bicycle" },
            ]}
            value={values.transport_type}
            onChange={(value) => update("transport_type", value)}
          />
          <Input label={t("drivers.fields.birthDate")} type="date" value={values.birth_date} error={errors.birth_date?.[0]} onChange={(event) => update("birth_date", event.target.value)} />
          <Input label={t("drivers.fields.socialSecurity")} value={values.social_security_number} error={errors.social_security_number?.[0]} onChange={(event) => update("social_security_number", event.target.value)} />
          <Input label={t("drivers.fields.identityExpiry")} type="date" value={values.identity_expires_at} error={errors.identity_expires_at?.[0]} onChange={(event) => update("identity_expires_at", event.target.value)} />
        </CardContent>
      </Card>
      <div className="mt-4 flex justify-end">
        <Button type="submit" className={fullWidthSubmit ? "w-full" : undefined} disabled={isSaving}>{isSaving ? t("common.loading") : submitLabel}</Button>
      </div>
    </form>
  )
}