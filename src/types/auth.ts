export type UserRole = "admin" | "driver"

export type CurrentUser = {
  id: string
  name: string
  email: string
  is_active: boolean
  roles: UserRole[]
  permissions: string[]
  driver_id: string | null
}

export type LoginRequest = {
  email: string
  password: string
  remember?: boolean
}


export function toCaslPermission(permission: string): `${string}.${string}` | null {
  const separator = permission.lastIndexOf(".")
  return separator > 0
    ? `${permission.slice(separator + 1)}.${permission.slice(0, separator)}`
    : null
}