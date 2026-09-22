import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Page, PageHeader } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { SettlementForm } from "@/components/settlements/SettlementForm"
import { useLanguage } from "@/i18n"
import { useGetDriversQuery } from "@/services/api/drivers/driversApi"
import { useCreateSettlementMutation } from "@/services/api/settlements/settlementsApi"
import type { SettlementFormValues } from "@/types/settlement"

const initialValues: SettlementFormValues = {
  driver_id: "", period_start: "", period_end: "", order_count: "0", kilometers: "0.00",
  order_revenue: "0.00", kilometer_revenue: "0.00", bonuses: "0.00", gross_revenue: "0.00",
  driver_share: "0.00", company_share: "0.00", contract_cost: "0.00", deductions: "0.00", final_due: "0.00", notes: "",
}

export default function NewSettlementPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const drivers = useGetDriversQuery({ page: 1, per_page: 100 })
  const [create, state] = useCreateSettlementMutation()
  const [message, setMessage] = useState("")
  const [fields, setFields] = useState<Record<string, string[]>>({})
  const save = async (values: SettlementFormValues) => {
    setMessage(""); setFields({})
    try {
      const settlement = await create({ ...values, order_count: Number(values.order_count), notes: values.notes || null }).unwrap()
      navigate(`/admin/settlements/${settlement.id}`, { replace: true })
    } catch (error) {
      const parsed = apiError(error, t("settlements.errors.create")); setMessage(parsed.message); setFields(parsed.fields)
    }
  }
  return <Page>
    <PageHeader title={t("settlements.create.title")} subtitle={t("settlements.create.subtitle")}><Button asChild variant="outline" size="sm"><Link to="/admin/settlements"><ArrowLeft />{t("settlements.actions.back")}</Link></Button></PageHeader>
    {message && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
    <div className="mt-4"><SettlementForm values={initialValues} drivers={drivers.data?.data ?? []} errors={fields} saving={state.isLoading} onSubmit={(values) => void save(values)} /></div>
  </Page>
}
