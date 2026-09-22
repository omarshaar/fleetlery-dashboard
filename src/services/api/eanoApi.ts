import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
function readCookie(name: string): string | undefined { const value = document.cookie.split("; ").find((item) => item.startsWith(`${name}=`))?.split("=")[1]; return value ? decodeURIComponent(value) : undefined }
export const eanoApi = createApi({
  reducerPath: "eanoApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL || "/api/v1", credentials: "include", prepareHeaders: (headers) => { headers.set("Accept", "application/json"); headers.set("X-Request-ID", crypto.randomUUID()); const csrf = readCookie("XSRF-TOKEN"); if (csrf) headers.set("X-XSRF-TOKEN", csrf); return headers } }),
  tagTypes: ["CurrentUser", "Dashboard", "Cities", "Drivers", "Documents", "Settlements", "DriverPortal", "DriverProfile", "DriverDocuments", "ProfileChanges", "DriverPayouts", "DriverInvitations", "DriverCities", "DriverStatusHistory", "AuditEvents", "Users", "Readiness", "Privacy"], endpoints: () => ({}),
})