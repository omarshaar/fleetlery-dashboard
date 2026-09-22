import { Navigate } from "react-router-dom"
import { useAuth } from "@/components/providers/authContext"

export default function EntryPage() {
  const { hasRole } = useAuth()
  return <Navigate to={hasRole("admin") ? "/admin" : "/driver"} replace />
}