// src/eano/access-control/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAbilityFromContext } from "./AbilityContext";
import type { AppAbility } from "./ability";

interface ProtectedRouteProps {
  children: React.ReactNode;

  // Single / ALL / ANY
  permission?: string;
  permissionAll?: string[];
  permissionAny?: string[];

  redirectTo?: string;
  ability?: AppAbility;
  data?: any;
}

export function ProtectedRoute({
  children,
  permission,
  permissionAll,
  permissionAny,
  redirectTo = "/403",
  ability,
  data,
}: ProtectedRouteProps) {

  const contextAbility = useAbilityFromContext();
  const finalAbility = ability ?? contextAbility;

  // ⛔ IMPORTANT: ability not yet built → permissions still loading
  if (!finalAbility?.rules || finalAbility.rules.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading permissions…
      </div>
    );
  }

  let allowed = true;

  // ---------------------------
  // SINGLE PERMISSION
  // ---------------------------
  if (permission) {
    const [action, subject] = permission.split(".");
    allowed = finalAbility.can(action, subject, data);
  }

  // ---------------------------
  // ALL PERMISSIONS (AND)
  // ---------------------------
  if (permissionAll?.length) {
    allowed = permissionAll.every((perm) => {
      const [action, subject] = perm.split(".");
      return finalAbility.can(action, subject, data);
    });
  }

  // ---------------------------
  // ANY PERMISSION (OR)
  // ---------------------------
  if (permissionAny?.length) {
    allowed = permissionAny.some((perm) => {
      const [action, subject] = perm.split(".");
      return finalAbility.can(action, subject, data);
    });
  }

  // ---------------------------
  // HANDLE REDIRECT
  // ---------------------------
  if (!allowed) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
