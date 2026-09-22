/**
 * InfoAlertCardExample
 * ----------------------
 * A showcase page for InfoAlertCard component variations.
 * Displays all InfoAlertCard variants and use cases.
 */

import { InfoAlertCard } from "@/components";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, TrendingUp } from "lucide-react";
import { useLanguage } from "@/i18n/hooks/useLanguage";

export default function InfoAlertCardExample() {
  const { t } = useLanguage();

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">{t("infoAlertCardExample.title")}</h2>
        <p className="text-muted-foreground mb-6">
          {t("infoAlertCardExample.description")}
        </p>
      </div>

      {/* Blue Variant - Information */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.blueVariant")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.salesPipeline.title")}
          description={t("infoAlertCardExample.salesPipeline.description")}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="blue"
        />
      </div>

      {/* Green Variant - Success */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.greenVariant")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.integration.title")}
          description={t("infoAlertCardExample.integration.description")}
          icon={<CheckCircle2 className="h-5 w-5" />}
          variant="green"
        />
      </div>

      {/* Amber Variant - Warning */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.amberVariant")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.maintenance.title")}
          description={t("infoAlertCardExample.maintenance.description")}
          icon={<AlertTriangle className="h-5 w-5" />}
          variant="amber"
        />
      </div>

      {/* Red Variant - Error/Alert */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.redVariant")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.criticalIssue.title")}
          description={t("infoAlertCardExample.criticalIssue.description")}
          icon={<AlertCircle className="h-5 w-5" />}
          variant="red"
        />
      </div>

      {/* Purple Variant - Neutral/Feature */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.purpleVariant")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.newFeature.title")}
          description={t("infoAlertCardExample.newFeature.description")}
          icon={<Info className="h-5 w-5" />}
          variant="purple"
        />
      </div>

      {/* Without Icon */}
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{t("infoAlertCardExample.withoutIcon")}</h3>
        <InfoAlertCard
          title={t("infoAlertCardExample.plainAlert.title")}
          description={t("infoAlertCardExample.plainAlert.description")}
          variant="blue"
        />
      </div>
    </div>
  );
}
