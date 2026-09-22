import { LogOut } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, Button, Logo } from "@/components"
import { useAuth } from "@/components/providers/authContext"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/eano/design-system/shadcn/sidebar"
import { useLanguage } from "@/i18n"
import { driverNavigation, navMainData } from "@/router/navigation-data"
import { useLogoutMutation } from "@/services/api/auth/authApi"
import "./FleetlerySidebar.css"

const adminGroups = [
  { titleKey: "fleetlerySidebar.overview", urls: ["/admin"] },
  { titleKey: "fleetlerySidebar.operations", urls: ["/admin/drivers", "/admin/documents", "/admin/profile-change-requests", "/admin/driver-invitations"] },
  { titleKey: "fleetlerySidebar.finance", urls: ["/admin/settlements", "/admin/reports"] },
  { titleKey: "fleetlerySidebar.management", urls: ["/admin/cities", "/admin/users", "/admin/privacy-requests", "/admin/audit-events", "/admin/readiness"] },
]

const adminLabels: Record<string, string> = {
  "/admin": "driverPortal.adminNav.dashboard",
  "/admin/drivers": "driverPortal.adminNav.drivers",
  "/admin/documents": "driverPortal.adminNav.documents",
  "/admin/settlements": "driverPortal.adminNav.settlements",
  "/admin/cities": "adminTools.nav.cities",
  "/admin/reports": "adminTools.nav.reports",
  "/admin/audit-events": "adminTools.nav.audit",
  "/admin/driver-invitations": "driverPortal.adminNav.invitations",
  "/admin/profile-change-requests": "driverPortal.adminNav.requests",
  "/admin/users": "governance.nav.users",
  "/admin/privacy-requests": "governance.nav.privacy",
  "/admin/readiness": "governance.nav.readiness",
}

export function FleetlerySidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, hasRole, hasPermission } = useAuth()
  const { isRTL, t } = useLanguage()
  const { pathname } = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  const [logout, { isLoading }] = useLogoutMutation()
  const navigate = useNavigate()
  const isAdmin = hasRole("admin")

  const adminItems = navMainData.flatMap((group) => group.items ?? []).filter((item) => {
    if (item.url === "/admin/cities") return hasPermission("cities.manage")
    if (item.url === "/admin/reports") return hasPermission("exports.create")
    if (item.url === "/admin/audit-events") return hasPermission("audit.view")
    if (item.url === "/admin/driver-invitations") return hasPermission("users.create")
    if (item.url === "/admin/profile-change-requests") return hasPermission("drivers.view")
    if (item.url === "/admin/users") return hasPermission("users.view")
    if (item.url === "/admin/privacy-requests") return hasPermission("deletions.manage")
    if (item.url === "/admin/readiness") return hasPermission("audit.view")
    if (item.url === "/admin/settlements") return hasPermission("finance.view")
    if (item.url === "/admin/documents") return hasPermission("documents.view")
    return hasPermission("drivers.view")
  })

  const groups = isAdmin
    ? adminGroups.map((group) => ({
        title: t(group.titleKey),
        items: adminItems.filter((item) => group.urls.includes(item.url)).map((item) => ({
          title: t(adminLabels[item.url]), url: item.url, icon: item.icon,
        })),
      })).filter((group) => group.items.length > 0)
    : [{
        title: t("fleetlerySidebar.driverArea"),
        items: driverNavigation.map((item) => ({ title: t(item.titleKey), url: item.url, icon: item.icon })),
      }]

  const handleLogout = async () => {
    try { await logout().unwrap() } finally { navigate("/auth/login", { replace: true }) }
  }

  return (
    <Sidebar {...props} className="fleetlery-sidebar" collapsible="icon" side={isRTL ? "right" : "left"}>
      <SidebarHeader className="border-b border-white/30 p-3 group-data-[collapsible=icon]:p-1.5">
        <div className="min-w-0 px-2.5 py-2 group-data-[collapsible=icon]:p-0">
          <div className="overflow-hidden whitespace-nowrap group-data-[collapsible=icon]:w-9"><Logo /></div>
          <p className="mt-0.5 ps-1 text-[11px] font-medium text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
            {t(isAdmin ? "fleetlerySidebar.adminArea" : "fleetlerySidebar.driverArea")}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent className="fleetlery-sidebar-content gap-0 overscroll-contain px-1 py-2">
        {groups.map((group) => (
          <SidebarGroup key={group.title} className="px-2 py-1.5">
            <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/55">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const active = pathname === item.url || (item.url !== "/admin" && item.url !== "/driver" && pathname.startsWith(item.url + "/"))
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.title} className="fleetlery-nav-link h-10 rounded-xl px-2.5 group-data-[collapsible=icon]:justify-center">
                        <NavLink to={item.url} end={item.url === "/admin" || item.url === "/driver"} onClick={() => { if (isMobile) setOpenMobile(false) }}>
                          <span className="fleetlery-nav-icon"><item.icon aria-hidden="true" className="size-4" /></span>
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="fleetlery-sidebar-footer gap-2 border-t border-sidebar-border/70 p-3 group-data-[collapsible=icon]:px-2">
        <div className="fleetlery-account flex min-w-0 items-center gap-2.5 rounded-xl p-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <Avatar className="size-8 shrink-0 rounded-md"><AvatarFallback className="rounded-md bg-primary/10 text-xs font-semibold text-primary">{user?.name?.charAt(0).toLocaleUpperCase() || "?"}</AvatarFallback></Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-medium">{user?.name}</p>
            <p className="truncate text-xs text-sidebar-foreground/60">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="fleetlery-logout-button sidebar-menu-button h-9 w-full justify-start gap-2 rounded-lg px-3 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0" title={t("auth.actions.logout")} aria-label={t("auth.actions.logout")} disabled={isLoading} onClick={() => void handleLogout()}>
          <LogOut className="size-4 shrink-0" />
          <span className="group-data-[collapsible=icon]:hidden">{t("auth.actions.logout")}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
