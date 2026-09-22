import { lazy } from "react"
import type { AppRoutes } from "./core/types"

const routes: AppRoutes = [
  {
    path: "/",
    component: lazy(() => import("@/pages/system/entry/EntryPage")),
    meta: { auth: true, layout: "blank" },
  },
  {
    path: "/auth/login",
    component: lazy(() => import("@/pages/auth/login/LoginPage")),
    meta: { guestOnly: true, layout: "blank" },
  },
  {
    path: "/admin",
    component: lazy(() => import("@/pages/admin/dashboard/AdminDashboardPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.drivers" },
  },
  {
    path: "/admin/drivers",
    component: lazy(() => import("@/pages/admin/drivers/DriversPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.drivers" },
  },
  {
    path: "/admin/drivers/new",
    component: lazy(() => import("@/pages/admin/drivers/NewDriverPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "create.drivers" },
  },
  {
    path: "/admin/drivers/:driverId",
    component: lazy(() => import("@/pages/admin/drivers/DriverDetailsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.drivers" },
  },
  {
    path: "/admin/documents",
    component: lazy(() => import("@/pages/admin/documents/DocumentQueuePage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.documents" },
  },
  {
    path: "/admin/settlements",
    component: lazy(() => import("@/pages/admin/settlements/SettlementsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.finance" },
  },
  {
    path: "/admin/settlements/new",
    component: lazy(() => import("@/pages/admin/settlements/NewSettlementPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "manage.finance" },
  },
  {
    path: "/admin/settlements/:settlementId",
    component: lazy(() => import("@/pages/admin/settlements/SettlementDetailsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.finance" },
  },
  {
    path: "/accept-invitation",
    component: lazy(() => import("@/pages/auth/invitation/DriverInvitationPage")),
    meta: { layout: "blank", guestOnly: true },
  },
  {
    path: "/admin/cities",
    component: lazy(() => import("@/pages/admin/cities/CitiesPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "manage.cities" },
  },
  {
    path: "/admin/reports",
    component: lazy(() => import("@/pages/admin/reports/ReportsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "create.exports" },
  },
  {
    path: "/admin/audit-events",
    component: lazy(() => import("@/pages/admin/audit/AuditEventsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.audit" },
  },  {
    path: "/admin/driver-invitations",
    component: lazy(() => import("@/pages/admin/invitations/DriverInvitationsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "create.users" },
  },  {
    path: "/admin/profile-change-requests",
    component: lazy(() => import("@/pages/admin/profileChanges/ProfileChangeRequestsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.drivers" },
  },
  {
    path: "/admin/users",
    component: lazy(() => import("@/pages/admin/users/UsersPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.users" },
  },
  {
    path: "/admin/privacy-requests",
    component: lazy(() => import("@/pages/admin/privacy/PrivacyRequestsPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "manage.deletions" },
  },
  {
    path: "/admin/readiness",
    component: lazy(() => import("@/pages/admin/readiness/ReadinessPage")),
    meta: { layout: "default", auth: true, roles: ["admin"], permission: "view.audit" },
  },  {
    path: "/driver",
    component: lazy(() => import("@/pages/driver/dashboard/DriverDashboardPage")),
    meta: { layout: "default", auth: true, roles: ["driver"] },
  },
  {
    path: "/driver/profile",
    component: lazy(() => import("@/pages/driver/profile/DriverProfilePage")),
    meta: { layout: "default", auth: true, roles: ["driver"] },
  },
  {
    path: "/driver/documents",
    component: lazy(() => import("@/pages/driver/documents/DriverDocumentsPage")),
    meta: { layout: "default", auth: true, roles: ["driver"] },
  },
  {
    path: "/driver/settlements",
    component: lazy(() => import("@/pages/driver/settlements/DriverSettlementsPage")),
    meta: { layout: "default", auth: true, roles: ["driver"] },
  },
  {
    path: "/driver/settlements/:settlementId",
    component: lazy(() => import("@/pages/driver/settlements/DriverSettlementDetailsPage")),
    meta: { layout: "default", auth: true, roles: ["driver"] },
  },
  {
    path: "/system/403",
    component: lazy(() => import("@/pages/system/forbidden/Forbidden")),
    meta: { layout: "blank" },
  },
  {
    path: "/system/coming-soon",
    component: lazy(() => import("@/pages/system/comming-soon/CommingSoon")),
    meta: { layout: "blank" },
  },
  {
    path: "/system/404",
    component: lazy(() => import("@/pages/system/not-found/NotFound")),
    meta: { layout: "blank" },
  },
]

export default routes