import { useMemo } from "react"
import { DataTable, type ColumnConfig } from "@/eano/data-table-builder"
import type { AuditEvent } from "@/types/admin"
import { Search, X } from "lucide-react"
import { useState, type FormEvent } from "react"
import { Button, Card, CardContent, Input, Page, PageHeader, Skeleton, } from "@/components"
import { apiError } from "@/components/auth/apiError"
import { useLanguage } from "@/i18n"
import { useGetAuditEventsQuery } from "@/services/api/admin/adminApi"
export default function AuditEventsPage(){const {t}=useLanguage();const [page,setPage]=useState(1);const [draft,setDraft]=useState("");const [event,setEvent]=useState("");const query=useGetAuditEventsQuery({page,event:event||undefined});const search=(e:FormEvent)=>{e.preventDefault();setEvent(draft.trim());setPage(1)};
  const columns = useMemo<ColumnConfig<AuditEvent>[]>(() => [
    { key: "created_at", label: t("adminTools.audit.time"), render: (_, item) => (<div>{new Date(item.created_at).toLocaleString()}</div>) },
    { key: "event", label: t("adminTools.audit.event"), render: (_, item) => (<div className="font-medium">{item.event}</div>) },
    { key: "actor", label: t("adminTools.audit.actor"), render: (_, item) => (<div>{item.actor?.name??"System"}</div>) },
    { key: "subject", label: t("adminTools.audit.subject"), render: (_, item) => (<div><div>{item.subject_type?.split("\\").pop()??"—"}</div><div className="max-w-48 truncate text-xs text-muted-foreground">{item.subject_id??"—"}</div></div>) },
    { key: "request_id", label: t("adminTools.audit.request"), render: (_, item) => (<div className="max-w-48 truncate text-xs">{item.request_id??"—"}</div>) },
  ], [t])
return <Page><PageHeader title={t("adminTools.audit.title")} subtitle={t("adminTools.audit.subtitle")}/><Card className="mt-4"><CardContent className="pt-6"><form className="flex gap-2" onSubmit={search}><Input placeholder={t("adminTools.audit.eventFilter")} value={draft} onChange={e=>setDraft(e.target.value)}/><Button variant="outline"><Search />{t("adminTools.audit.search")}</Button>{event&&<Button type="button" variant="ghost" onClick={()=>{setDraft("");setEvent("");setPage(1)}}><X /></Button>}</form></CardContent></Card>{query.error?<p className="mt-4 rounded-md bg-destructive/10 p-4 text-destructive">{apiError(query.error,t("adminTools.audit.error")).message}</p>:<Card className="mt-4 overflow-hidden"><CardContent className="p-0">{query.isLoading?<div className="space-y-3 p-5">{[1,2,3].map(i=><Skeleton key={i} className="h-12"/>)}</div>:!query.data?.data.length?<p className="p-10 text-center text-muted-foreground">{t("adminTools.audit.empty")}</p>:<DataTable<AuditEvent> tableId="fleetlery-admin-audit" data={query.data?.data ?? []} columns={columns} rowKey={(item) => item.id} preset="simple" emptyMessage={t("adminTools.audit.empty")} className="rounded-none border-0 shadow-none" />}</CardContent>{query.data&&query.data.meta.last_page>1&&<div className="flex justify-end gap-2 border-t p-4"><Button variant="outline" disabled={page<=1} onClick={()=>setPage(v=>v-1)}>{t("settlements.pagination.previous")}</Button><Button variant="outline" disabled={page>=query.data.meta.last_page} onClick={()=>setPage(v=>v+1)}>{t("settlements.pagination.next")}</Button></div>}</Card>}</Page>}
