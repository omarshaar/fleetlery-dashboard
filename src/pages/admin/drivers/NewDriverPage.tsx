import { ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button, Page, PageHeader } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { DriverForm } from "@/components/drivers/DriverForm"
import { useLanguage } from "@/i18n"
import { useGetCitiesQuery } from "@/services/api/dashboard/dashboardApi"
import { useCreateDriverMutation } from "@/services/api/drivers/driversApi"
import type { DriverFormValues } from "@/types/driver"

const emptyValues: DriverFormValues = {
  full_name: "", email: "", phone: "", city_id: "", transport_type: "car",
  birth_date: "", social_security_number: "", identity_expires_at: "",
}

export default function NewDriverPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const cities = useGetCitiesQuery()
  const [createDriver, state] = useCreateDriverMutation()
  const [message, setMessage] = useState("")
  const [fields, setFields] = useState<Record<string, string[]>>({})

  const save = async (values: DriverFormValues) => {
    setMessage(""); setFields({})
    try {
      const driver = await createDriver({
        ...values,
        email: values.email || null,
        birth_date: values.birth_date || null,
        social_security_number: values.social_security_number || null,
        identity_expires_at: values.identity_expires_at || null,
      }).unwrap()
      navigate(`/admin/drivers/${driver.id}`, { replace: true })
    } catch (error) {
      const parsed = apiError(error, t("drivers.errors.create"))
      setMessage(parsed.message); setFields(parsed.fields)
    }
  }

  return (
    <Page>
      <PageHeader title={t("drivers.create.title")} subtitle={t("drivers.create.subtitle")}>
        <Button asChild variant="outline" size="sm"><Link to="/admin/drivers"><ArrowLeft />{t("drivers.actions.back")}</Link></Button>
      </PageHeader>
      {message && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
      <div className="mt-4">
        <DriverForm initialValues={emptyValues} cities={cities.data ?? []} errors={fields} isSaving={state.isLoading} submitLabel={t("drivers.actions.create")} onSubmit={(values) => void save(values)} />
      </div>
    </Page>
  )
}