// Small helpers. Avoid external deps.

export function uid(prefix = "img") {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

export function revokeIfObjectURL(src?: string) {
  if (!src) return
  try {
    // Only revoke blob: urls
    if (src.startsWith("blob:")) URL.revokeObjectURL(src)
  } catch {}
}
