import { eanoApi } from "@/services/api/eanoApi"
import type { AdminDashboard, CityOption } from "@/types/dashboard"

type Wrapped<T> = { data: T }

export const dashboardApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query<AdminDashboard, string | undefined>({
      query: (cityId) => ({
        url: "/dashboard",
        params: cityId ? { city_id: cityId } : undefined,
      }),
      transformResponse: (response: Wrapped<AdminDashboard>) => response.data,
      providesTags: ["Dashboard"],
    }),
    getCities: builder.query<CityOption[], void>({
      query: () => "/cities",
      transformResponse: (response: Wrapped<CityOption[]>) => response.data,
      providesTags: ["Cities"],
    }),
  }),
})

export const { useGetAdminDashboardQuery, useGetCitiesQuery } = dashboardApi