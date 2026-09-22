import { useState, type FormEvent } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Textarea } from "@/components"
import { useLanguage } from "@/i18n"
import type { Driver } from "@/types/driver"
import type { SettlementFormValues } from "@/types/settlement"

type Props = {
  values: SettlementFormValues
  drivers: Driver[]
  errors?: Record<string, string[]>
  saving: boolean
  lockDriver?: boolean
  onSubmit: (values: SettlementFormValues) => void
}

const moneyFields: Array<keyof SettlementFormValues> = [
  "order_revenue", "kilometer_revenue", "bonuses", "gross_revenue", "driver_share",
  "company_share", "contract_cost", "deductions", "final_due",
]

export function SettlementForm({ values, drivers, errors = {}, saving, lockDriver, onSubmit }: Props) {
  const { t } = useLanguage()
  const [form, setForm] = useState(values)
  const set = (field: keyof SettlementFormValues, value: string) => setForm((current) => ({ ...current, [field]: value }))
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit(form) }

  const field = (name: keyof SettlementFormValues, type = "text", step?: string) => (
    <div className="space-y-2">
      <Label htmlFor={`settlement-${name}`}>{t(`settlements.fields.${name}`)}</Label>
      <Input id={`settlement-${name}`} type={type} step={step} min={type === "number" ? "0" : undefined} value={form[name]} onChange={(event) => set(name, event.target.value)} required={name !== "notes"} />
      {errors[name]?.[0] && <p className="text-xs text-destructive">{errors[name][0]}</p>}
    </div>
  )

  return (
    <form className="space-y-4" onSubmit={submit}>
      <Card>
        <CardHeader><CardTitle>{t("settlements.form.period")}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 md:col-span-2">
            <Label>{t("settlements.fields.driver_id")}</Label>
            <Select disabled={lockDriver} placeholder={t("settlements.form.chooseDriver")} options={drivers.map((driver) => ({ label: driver.full_name, value: driver.id }))} value={form.driver_id || undefined} onChange={(value) => set("driver_id", value)} />
            {errors.driver_id?.[0] && <p className="text-xs text-destructive">{errors.driver_id[0]}</p>}
          </div>
          {field("period_start", "date")}
          {field("period_end", "date")}
          {field("order_count", "number", "1")}
          {field("kilometers", "number", "0.01")}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t("settlements.form.amounts")}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {moneyFields.map((name) => <div key={name}>{field(name, "number", "0.01")}</div>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>{t("settlements.fields.notes")}</CardTitle></CardHeader>
        <CardContent><Textarea value={form.notes} onChange={(event) => set("notes", event.target.value)} rows={3} /></CardContent>
      </Card>
      <div className="flex justify-end"><Button type="submit" disabled={saving}>{saving ? t("settlements.actions.saving") : t("settlements.actions.save")}</Button></div>
    </form>
  )
}
