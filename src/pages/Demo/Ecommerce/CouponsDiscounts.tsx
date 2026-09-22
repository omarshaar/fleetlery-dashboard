import { Page } from "@/eano/components/page/Page";
import { useLanguage } from "@/i18n/hooks";
import {
  CouponsDiscountsCard,
  type CouponsDiscountsCardData,
  PageHeader,
} from "@/components";

import couponsDiscountsMock from "./mock.data/couponsDiscounts.mock.json";

export default function CouponsDiscountsPage() {
  const { t } = useLanguage();

  const items = couponsDiscountsMock as unknown as CouponsDiscountsCardData[];

  return (
    <Page className="flex flex-col h-full">
      <PageHeader
        title={t("ecommerce.couponsDiscounts.pageTitle", {
          defaultValue: "Coupons & Discounts",
        })}
        subtitle={t("ecommerce.couponsDiscounts.pageSubtitle", {
          defaultValue:
            "Create, review, and manage your promo codes",
        })}
      />

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-2">
        {items.map((data) => (
          <CouponsDiscountsCard
            key={data.code}
            data={data}
            onManageClick={() => console.log("Manage coupon", data.code)}
          />
        ))}
      </div>
    </Page>
  );
}
