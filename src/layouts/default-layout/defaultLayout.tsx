import { FleetlerySidebar } from "@/components/navigation/FleetlerySidebar"
import { SidebarProvider } from "@/eano/design-system/shadcn/sidebar"
import { Header } from "@/layouts/default-layout/components"

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen overflow-auto flex relative">
        <div className="sticky top-0 h-screen">
          <FleetlerySidebar />
        </div>
        <div className="flex flex-col w-full min-h-screen overflow-auto">
          <Header />
          <div
            className="w-full"
            style={{ height: "calc(100vh - var(--header-height) - var(--page-padding) - 10px)" }}
          >
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}