import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/eano/components/blocks/Calender/calendar.css";
import { CalenderBlock } from "@/components";

export default function CalendarPage() {
  return (
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
          "Navigated to date:", date,
          "with view:", view,
          "and action:", action
        );
      }}
      views={["month", "week", "day"]}
    />
  );
}
