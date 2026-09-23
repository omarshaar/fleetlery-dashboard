import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path";

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const useDevProxy = command === 'serve' && !isPreview

  if (command === 'build') {
    const productionUrls = {
      VITE_BACKEND_ORIGIN: env.VITE_BACKEND_ORIGIN,
      VITE_API_BASE_URL: env.VITE_API_BASE_URL,
    }

    for (const [name, value] of Object.entries(productionUrls)) {
      if (!value || !value.startsWith('https://')) {
        throw new Error(`${name} must be an absolute HTTPS URL for production builds`)
      }
    }
  }

  const target = env.VITE_PROXY_TARGET || env.VITE_BACKEND_ORIGIN || 'http://100.94.240.111:8000'
  const backendProxy = {
    target,
    changeOrigin: true,
    // Store upstream cookies on the frontend host during local development.
    cookieDomainRewrite: '',
    headers: { 'ngrok-skip-browser-warning': 'true' },
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'fleetlery.svg', 'apple-touch-icon-180x180.png'],
        manifest: {
          name: 'Fleetlery',
          short_name: 'Fleetlery',
          description: 'Fleetlery fleet management application',
          lang: 'de',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          orientation: 'any',
          background_color: '#0b0f19',
          theme_color: '#111827',
          icons: [
            { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//, /^\/sanctum\//],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname.startsWith('/api/') || url.pathname.startsWith('/sanctum/'),
              handler: 'NetworkOnly',
              method: 'GET',
              options: { cacheName: 'fleetlery-backend-network-only' },
            },
          ],
        },
      }),
    ],
    // Same-origin browser requests let the existing client read XSRF-TOKEN.
    // Production builds continue to use the configured environment URLs.
    define: useDevProxy ? {
      'import.meta.env.VITE_BACKEND_ORIGIN': JSON.stringify(''),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify('/api/v1'),
    } : {},
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
      proxy: {
        '/api': backendProxy,
        '/sanctum': backendProxy,
      },
    },
  }
})
