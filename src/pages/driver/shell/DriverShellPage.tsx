import { Page, PageHeader } from "@/components"
import { useLanguage } from "@/i18n"

export default function DriverShellPage() {
  const { t } = useLanguage()
  return <Page><PageHeader title={t("driver.home.title")} subtitle={t("driver.home.subtitle")} /></Page>
}