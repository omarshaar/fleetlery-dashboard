import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface TabItem {
  title: string
  href: string
  closeDisable?: boolean
}

interface TabsState {
  tabs: TabItem[]
  activeHref: string
}

const initialState: TabsState = {
  tabs: [],
  activeHref: "",
}

const tabsSlice = createSlice({
  name: "defaultLayoutTabs",
  initialState,
  reducers: {
    // Add new tab or activate existing one
    addOrActivateTab: (state, action: PayloadAction<TabItem>) => {
      const exists = state.tabs.find((t) => t.href === action.payload.href)
      if (!exists) state.tabs.push(action.payload)
      state.activeHref = action.payload.href
    },

    // Mark a tab as active
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeHref = action.payload
    },

    // Close a tab
    closeTab: (state, action: PayloadAction<string>) => {
      const newTabs = state.tabs.filter((t) => t.href !== action.payload)
      state.tabs = newTabs
      // If the closed tab was active, set last tab as active
      if (state.activeHref === action.payload && newTabs.length > 0) {
        state.activeHref = newTabs[newTabs.length - 1].href
      }
    },
  },
})

export const { addOrActivateTab, setActiveTab, closeTab } = tabsSlice.actions
export default tabsSlice.reducer
