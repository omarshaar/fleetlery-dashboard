import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/eano/components/blocks/Calender/calendar.css";

import { useLanguage } from "@/i18n/hooks";

import { Page } from "@/eano/components/page/Page";
import PageHeader from "@/eano/components/widgets/PageHeader";

import { CalenderBlock } from "@/components";

export default function CalenderPage() {
  const { t } = useLanguage();

  return (
    <Page>
      <PageHeader className="mb-4" title={t("navigation.calender")} />

      <CalenderBlock
        events={[
          {
            id: 1,
            title: "Test Event",
            start: new Date(),
            end: new Date(),
            color: "#10B981",
          },
        ]}
        onNavigate={(date, view, action) => {
          console.log(
            "Navigated to date:",
            date,
            "with view:",
            view,
            "and action:",
            action
          );
        }}
        views={["month", "week", "day"]}
      />
    </Page>
  );
}
