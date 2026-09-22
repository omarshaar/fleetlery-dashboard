import { Activity, BarChart3, FilePenLine, FileText, History, LayoutDashboard, Mail, MapPin, ReceiptText, Shield, Truck, UserRound, Users, Wallet, type LucideIcon } from "lucide-react"

export type NavigationItem = {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: Array<{ title: string; url: string; icon: LucideIcon }>
}

export const navMainData: NavigationItem[] = [
  { title: "Administration", url: "/admin", icon: LayoutDashboard, isActive: true, items: [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Fahrer", url: "/admin/drivers", icon: Truck },
    { title: "Dokumente", url: "/admin/documents", icon: FileText },
    { title: "Abrechnungen", url: "/admin/settlements", icon: ReceiptText },
    { title: "Städte", url: "/admin/cities", icon: MapPin },
    { title: "Berichte", url: "/admin/reports", icon: BarChart3 },
    { title: "Audit-Protokoll", url: "/admin/audit-events", icon: History },
    { title: "Einladungen", url: "/admin/driver-invitations", icon: Mail },
    { title: "Änderungsanträge", url: "/admin/profile-change-requests", icon: FilePenLine },
    { title: "Benutzer", url: "/admin/users", icon: Users },
    { title: "Datenschutz", url: "/admin/privacy-requests", icon: Shield },
    { title: "Systemstatus", url: "/admin/readiness", icon: Activity },
  ] },
]

export const driverNavigation = [
  { titleKey: "driverPortal.nav.dashboard", url: "/driver", icon: LayoutDashboard },
  { titleKey: "driverPortal.nav.profile", url: "/driver/profile", icon: UserRound },
  { titleKey: "driverPortal.nav.documents", url: "/driver/documents", icon: FileText },
  { titleKey: "driverPortal.nav.payouts", url: "/driver/settlements", icon: Wallet },
] as const