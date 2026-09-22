type DocumentAccessLink = { url: string; expires_at: string }

/** Keep cookie-authenticated content requests on Vite's existing API proxy. */
export function documentAccessLink(
  link: DocumentAccessLink,
  useDevProxy = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_ORIGIN,
): DocumentAccessLink {
  if (!useDevProxy) return link
  const url = new URL(link.url, window.location.origin)
  if (!/^\/api\/v1\/(?:driver\/)?document-versions\/[^/]+\/content$/.test(url.pathname)) return link
  // Preserve the signed path and query exactly. Vite restores the upstream host.
  return { ...link, url: url.pathname + url.search + url.hash }
}
