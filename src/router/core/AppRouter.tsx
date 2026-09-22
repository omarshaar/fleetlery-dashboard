import { Suspense } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"
import { RouteAccess } from "@/components/auth/RouteAccess"
import { ProtectedRoute } from "@/eano/access-control"
import routes from ".."
import { LayoutManager } from "./LayoutManager"

const loading = <div className="p-6 text-center text-muted-foreground">Loading…</div>

export default function AppRouter() {
  return useRoutes([
    {
      element: (
        <LayoutManager>
          <Suspense fallback={loading}>
            <Outlet />
          </Suspense>
        </LayoutManager>
      ),
      children: routes.map((route) => {
        const meta = route.meta ?? {}
        let element = (
          <Suspense fallback={loading}>
            <route.component />
          </Suspense>
        )

        const hasPermission =
          meta.permission || meta.permissionAll || meta.permissionAny

        if (hasPermission) {
          element = (
            <ProtectedRoute
              permission={meta.permission}
              permissionAll={meta.permissionAll}
              permissionAny={meta.permissionAny}
              redirectTo={meta.redirectTo ?? "/system/403"}
            >
              {element}
            </ProtectedRoute>
          )
        }

        return {
          path: route.path,
          element: (
            <RouteAccess
              auth={meta.auth}
              guestOnly={meta.guestOnly}
              roles={meta.roles}
            >
              {element}
            </RouteAccess>
          ),
        }
      }),
    },
    { path: "*", element: <Navigate to="/system/404" replace /> },
  ])
}