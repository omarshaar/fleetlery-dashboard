import DefaultLayout from "./default-layout/defaultLayout"
import defaultTabsLayout from "./default-tabs/defaultTabsLayout"
import MegaMenuLayout from "./mega-menu-layout/MegaMenuLayout"
import BlankLayout from "./blank-layout/BlankLayout"

export const layouts = {
  default: DefaultLayout,
  defaultTabs: defaultTabsLayout,
  megaMenu: MegaMenuLayout,
  blank: BlankLayout,
  // 🧩 Add other layouts here (e.g. admin, marketing, etc.)
}

export type LayoutKey = keyof typeof layouts