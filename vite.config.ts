import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const useDevProxy = command === 'serve' && !isPreview
  const target = env.VITE_PROXY_TARGET || env.VITE_BACKEND_ORIGIN || 'http://100.94.240.111:8000'
  const backendProxy = {
    target,
    changeOrigin: true,
    // Store upstream cookies on the frontend host during local development.
    cookieDomainRewrite: '',
    headers: { 'ngrok-skip-browser-warning': 'true' },
  }

  return {
    plugins: [react(), tailwindcss()],
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

