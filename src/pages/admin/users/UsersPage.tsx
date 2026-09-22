import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { Button, Card, CardContent, ConfirmDialog, DataTable, Input, Page, PageHeader, Skeleton } from "@/components"
import type { ColumnConfig } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useAuth } from "@/components/providers/authContext"
import { DynamicForm } from "@/eano/form-builder/DynamicForm"
import type { FormConfig, FormField } from "@/eano/form-builder/types/form.types"
import { removeForm } from "@/eano/form-builder/core/formSlice"
import { useDispatch } from "react-redux"
import { useLanguage } from "@/i18n"
import { useCreateAdminUserMutation, useDeleteUserMutation, useGetUsersQuery, useSetUserActiveMutation } from "@/services/api/governance/governanceApi"
import type { AdminUser } from "@/types/governance"

export default function UsersPage() {
  const { t } = useLanguage()
  const dispatch = useDispatch()
  useEffect(() => () => { dispatch(removeForm({ formId: "fleetlery-admin-user-create" })) }, [dispatch])
  const { user, hasPermission } = useAuth()
  const [page, setPage] = useState(1)
  const [searchDraft, setSearchDraft] = useState("")
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState("")
  const users = useGetUsersQuery({ page, search: search || undefined })
  const [create, createState] = useCreateAdminUserMutation()
  const [setActive, activeState] = useSetUserActiveMutation()
  const [deleteUser, deleteState] = useDeleteUserMutation()

  const schema = useMemo<FormField[]>(() => [
    { type: "input", name: "name", label: t("governance.users.name"), grid: "12 md:6", validation: "required|min:2", props: { required: true } },
    { type: "input", name: "email", label: t("governance.users.email"), grid: "12 md:6", validation: "required|email", props: { type: "email", required: true } },
    { type: "input", name: "password", label: t("governance.users.password"), grid: "12 md:6", validation: "required|min:8", props: { type: "password", required: true } },
    { type: "input", name: "password_confirmation", label: t("governance.users.confirmPassword"), grid: "12 md:6", validation: "required|min:8", props: { type: "password", required: true } },
    { type: "button", name: "submit", grid: "12", props: { text: createState.isLoading ? t("common.loading") : t("governance.users.create"), type: "submit" } },
  ], [t, createState.isLoading])
  const config = useMemo<FormConfig>(() => ({
    formId: "fleetlery-admin-user-create",
    showSuccessToast: false,
    persistence: { enabled: false, storage: "session" },
    onSubmit: async ({ values, ctx }) => {
      setMessage(""); setSuccess("")
      try {
        await create({ name: String(values.name ?? ""), email: String(values.email ?? ""), password: String(values.password ?? ""), password_confirmation: String(values.password_confirmation ?? ""), roles: ["admin"] }).unwrap()
        ctx.setValue("name", ""); ctx.setValue("email", "")
        setSuccess(t("governance.users.created"))
        return true
      } catch (error) {
        setMessage(apiError(error, t("governance.users.errors.create")).message)
        return false
      } finally {
        ctx.setValue("password", ""); ctx.setValue("password_confirmation", "")
      }
    },
  }), [create, t])
  const changeActive = useCallback(async (row: AdminUser) => {
    setMessage(""); setSuccess("")
    try { await setActive({ id: row.id, active: !row.is_active }).unwrap() }
    catch (error) { setMessage(apiError(error, t("governance.users.errors.update")).message) }
  }, [setActive, t])
  const removeUser = useCallback(async (row: AdminUser) => {
    setMessage(""); setSuccess("")
    try {
      await deleteUser({ id: row.id, confirmation: row.email }).unwrap()
      setSuccess(t("governance.users.deleted"))
    } catch (error) {
      setMessage(apiError(error, t("governance.users.errors.delete")).message)
    }
  }, [deleteUser, t])
  const columns = useMemo<ColumnConfig<AdminUser>[]>(() => [
    { key: "name", label: t("governance.users.name"), type: "text" },
    { key: "email", label: t("governance.users.email"), type: "text" },
    { key: "roles", label: t("governance.users.role"), type: "custom", render: (_value, row) => row.roles.map((role) => role.name).join(", ") },
    { key: "is_active", label: t("governance.users.status"), type: "custom", render: (_value, row) => row.is_active ? t("governance.users.active") : t("governance.users.inactive") },
    { key: "last_login_at", label: t("governance.users.lastLogin"), type: "custom", render: (value) => value ? new Date(String(value)).toLocaleString("de-DE", { timeZone: "Europe/Berlin" }) : "—" },
    { key: "id", label: t("governance.users.actions"), type: "custom", render: (_value, row) => <div className="flex flex-wrap gap-2">
      {hasPermission("users.disable") && <Button size="sm" variant={row.is_active ? "outline" : "default"} disabled={activeState.isLoading || row.id === user?.id} onClick={() => void changeActive(row)}>{row.is_active ? t("governance.users.disable") : t("governance.users.enable")}</Button>}
      {hasPermission("users.delete") && row.id !== user?.id && <ConfirmDialog
        trigger={<Button size="sm" variant="destructive" disabled={deleteState.isLoading}>{t("governance.users.delete")}</Button>}
        title={t("governance.users.deleteTitle")}
        description={t("governance.users.deleteDescription", { name: row.name })}
        actionLabel={deleteState.isLoading ? t("common.loading") : t("governance.users.deleteConfirm")}
        cancelLabel={t("governance.users.deleteCancel")}
        destructive
        onConfirm={() => void removeUser(row)}
      />}
    </div> },
  ], [t, activeState.isLoading, deleteState.isLoading, hasPermission, user?.id, changeActive, removeUser])
  const submitSearch = (event: FormEvent) => { event.preventDefault(); setPage(1); setSearch(searchDraft.trim()) }

  return <Page>
    <PageHeader title={t("governance.users.title")} subtitle={t("governance.users.subtitle")} />
    {message && <p role="alert" className="mt-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{message}</p>}
    {success && <p role="status" className="mt-4 rounded-md bg-primary/10 p-3 text-sm text-primary">{success}</p>}
    {hasPermission("users.create") && <Card className="mt-4"><CardContent className="pt-6"><DynamicForm config={config} schema={schema} /></CardContent></Card>}
    <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={submitSearch}><Input aria-label={t("governance.users.search")} placeholder={t("governance.users.search")} value={searchDraft} onChange={(event) => setSearchDraft(event.target.value)} /><Button type="submit" variant="outline">{t("governance.users.searchAction")}</Button></form>
    {users.isLoading ? <Skeleton className="mt-4 h-64" /> : users.isError ? <div role="alert" className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive"><p>{apiError(users.error, t("governance.users.errors.list")).message}</p><Button className="mt-2" variant="outline" onClick={() => void users.refetch()}>{t("driverPortal.actions.refresh")}</Button></div> : <div className="mt-4"><DataTable<AdminUser> tableId="fleetlery-admin-users" data={users.data?.data ?? []} columns={columns} emptyMessage={t("governance.users.empty")} features={{ hideableColumns: true }} /></div>}
    {users.data && users.data.meta.last_page > 1 && <div className="mt-4 flex justify-end gap-2"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>{t("settlements.pagination.previous")}</Button><Button variant="outline" disabled={page >= users.data.meta.last_page} onClick={() => setPage((value) => value + 1)}>{t("settlements.pagination.next")}</Button></div>}
  </Page>
}
