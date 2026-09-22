import { eanoApi } from "@/services/api/eanoApi"
import type { Driver, DriverFormValues, DriverListParams, PaginationMeta } from "@/types/driver"

type Wrapped<T> = { data: T; meta?: PaginationMeta }
type DriverPayload = Omit<DriverFormValues, "email" | "birth_date" | "social_security_number" | "identity_expires_at"> & {
  email: string | null
  birth_date: string | null
  social_security_number: string | null
  identity_expires_at: string | null
}
type UpdateDriverPayload = Partial<DriverPayload> & { id: string; version: number }

export const driversApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getDrivers: builder.query<{ data: Driver[]; meta: PaginationMeta }, DriverListParams>({
      query: (params) => ({ url: "/drivers", params }),
      transformResponse: (response: Wrapped<Driver[]>) => ({
        data: response.data,
        meta: response.meta ?? { current_page: 1, per_page: 25, total: response.data.length, last_page: 1 },
      }),
      providesTags: (result) => result
        ? [...result.data.map((driver) => ({ type: "Drivers" as const, id: driver.id })), { type: "Drivers", id: "LIST" }]
        : [{ type: "Drivers", id: "LIST" }],
    }),
    getDriver: builder.query<Driver, string>({
      query: (id) => `/drivers/${id}`,
      transformResponse: (response: Wrapped<Driver>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Drivers", id }],
    }),
    createDriver: builder.mutation<Driver, DriverPayload>({
      query: (body) => ({ url: "/drivers", method: "POST", body }),
      transformResponse: (response: Wrapped<Driver>) => response.data,
      invalidatesTags: [{ type: "Drivers", id: "LIST" }, "Dashboard"],
    }),
    updateDriver: builder.mutation<Driver, UpdateDriverPayload>({
      query: ({ id, ...body }) => ({ url: `/drivers/${id}`, method: "PATCH", body }),
      transformResponse: (response: Wrapped<Driver>) => response.data,
      invalidatesTags: (_result, _error, argument) => [
        { type: "Drivers", id: argument.id },
        { type: "Drivers", id: "LIST" },
        "Dashboard",
      ],
    }),
  }),
})

export const {
  useGetDriversQuery,
  useGetDriverQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation,
} = driversApi