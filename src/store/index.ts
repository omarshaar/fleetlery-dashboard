import { configureStore } from "@reduxjs/toolkit"

import appReducer from "@/store/features/app/appSlice.ts"
import defaultLayoutTabsReducer from "@/layouts/default-tabs/store/tabsSlice"
import { dataTableReducer } from "@/eano/data-table-builder/store/dataTableSlice"
import formBuilderReducer from "@/eano/form-builder/core/formSlice"

import { eanoApi } from "@/services/api/eanoApi"

export const store = configureStore({
  reducer: {
    app: appReducer,
    defaultLayoutTabs: defaultLayoutTabsReducer,
    dataTables: dataTableReducer,
    formBuilder: formBuilderReducer,
    [eanoApi.reducerPath]: eanoApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "formBuilder/setFieldValue",
          "formBuilder/hydrateForm",
          "formBuilder/setFieldArray",
        ],
        ignoredPaths: ["formBuilder"],
      },
    }).concat(
      eanoApi.middleware
    ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
