import { type FormEvent, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { AuthCard } from "@/components/auth/AuthCard"
import { apiError } from "@/components/auth/apiError"
import { Button } from "@/eano/design-system/shadcn/button"
import { Input } from "@/eano/design-system/shadcn/input"
import { Label } from "@/eano/design-system/shadcn/label"
import { useLanguage } from "@/i18n"
import { useLoginMutation } from "@/services/api/auth/authApi"

export default function LoginPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [login, { isLoading }] = useLoginMutation()
  const [message, setMessage] = useState("")
  const [form, setForm] = useState({ email: "", password: "", remember: false })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setMessage("")
    try {
      await login(form).unwrap()
      const requested = (location.state as { from?: string } | null)?.from
      navigate(requested || "/", { replace: true })
    } catch (error) {
      setMessage(apiError(error, t("auth.errors.login")).message)
    }
  }

  return (
    <AuthCard title={t("auth.login.title")} description={t("auth.login.description")}>
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        {message && <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.fields.email")}</Label>
          <Input id="email" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.fields.password")}</Label>
          <Input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.remember} onChange={(event) => setForm({ ...form, remember: event.target.checked })} />
          {t("auth.fields.remember")}
        </label>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? t("common.loading") : t("auth.actions.login")}
        </Button>
      </form>
    </AuthCard>
  )
}