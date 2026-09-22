import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import routes from "@/router"
import { addOrActivateTab } from "../store/tabsSlice"

/**
 * Watches for route changes and adds a tab dynamically
 */
export default function TabWatcher() {
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    // Find the route that matches the current path
    const currentRoute = routes.find((r) => r.path === location.pathname)

    if (currentRoute?.meta?.layout === "defaultTabs") {
      dispatch(
        addOrActivateTab({
          title: currentRoute.title || "Page",
          href: currentRoute.path,
        })
      )
    }
  }, [location.pathname, dispatch])

  return null
}
