import { useRef } from "react"
import { useLocation } from "react-router-dom"
import routes from ".."
import { layouts, type LayoutKey } from "@/layouts"

function resolveLayoutKey(pathname: string): LayoutKey {
  const match = routes
    .filter(
      (r) =>
        pathname === r.path ||
        pathname.startsWith(r.path.endsWith("/") ? r.path : r.path + "/") ||
        r.path === "/"
    )
    .sort((a, b) => b.path.length - a.path.length)[0]

  const key = (match?.meta?.layout ?? "default") as LayoutKey
  return key in layouts ? key : "default"
}

export const LayoutManager = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation()

  // 1) resolve layout for current route
  const newKey = resolveLayoutKey(pathname)

  // 2) keep a stable reference unless layout actually changes
  const layoutKeyRef = useRef<LayoutKey>(newKey)

  if (layoutKeyRef.current !== newKey) {
    layoutKeyRef.current = newKey
  }

  // 3) this is stable and never changes unless layoutKey changes
  const Layout = layouts[layoutKeyRef.current]

  // 4) children are inserted directly — do NOT memoize with pathname
  return <Layout>{children}</Layout>
}
