import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "@/components/providers/AuthProvider"
import { useLanguage } from "@/i18n/hooks"
import AppRouter from "@/router/core/AppRouter"

export default function App() {
  useLanguage()

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}