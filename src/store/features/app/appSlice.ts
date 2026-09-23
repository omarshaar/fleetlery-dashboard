import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  currentFormData: Record<string, unknown>;
}

const initialState: AppState = {
  currentFormData: {},
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<{ id: string; data: unknown }>) {
      state.currentFormData[action.payload.id] = action.payload.data;
    },
    resetFormData(state, action: PayloadAction<string>) {
      delete state.currentFormData[action.payload];
    },
  },
});

export const { setFormData, resetFormData } = appSlice.actions;
export default appSlice.reducer;
