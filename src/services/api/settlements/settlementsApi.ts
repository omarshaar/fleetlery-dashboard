import { eanoApi } from "@/services/api/eanoApi"
import type { PaginationMeta } from "@/types/driver"
import type { PaymentMethod, Settlement, SettlementFormValues, SettlementListParams, SettlementListResponse } from "@/types/settlement"

type Wrapped<T> = { data: T; meta?: PaginationMeta }
type SettlementPayload = Omit<SettlementFormValues, "order_count" | "notes"> & { order_count: number; notes: string | null }

export const settlementsApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettlements: builder.query<SettlementListResponse, SettlementListParams>({
      query: (params) => ({ url: "/settlements", params }),
      transformResponse: (response: Wrapped<Settlement[]>) => ({
        data: response.data,
        meta: response.meta ?? { current_page: 1, per_page: 25, total: response.data.length, last_page: 1 },
      }),
      providesTags: (result) => result
        ? [...result.data.map((item) => ({ type: "Settlements" as const, id: item.id })), { type: "Settlements", id: "LIST" }]
        : [{ type: "Settlements", id: "LIST" }],
    }),
    getSettlement: builder.query<Settlement, string>({
      query: (id) => `/settlements/${id}`,
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Settlements", id }],
    }),
    createSettlement: builder.mutation<Settlement, SettlementPayload>({
      query: (body) => ({ url: "/settlements", method: "POST", body }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: [{ type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
    updateSettlement: builder.mutation<Settlement, Partial<Omit<SettlementPayload, "driver_id">> & { id: string; version: number }>({
      query: ({ id, ...body }) => ({ url: `/settlements/${id}`, method: "PATCH", body }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Settlements", id }, { type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
    approveSettlement: builder.mutation<Settlement, { id: string; version: number }>({
      query: ({ id, version }) => ({ url: `/settlements/${id}/approve`, method: "POST", body: { version } }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Settlements", id }, { type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
    voidSettlement: builder.mutation<Settlement, { id: string; version: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/settlements/${id}/void`, method: "POST", body }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Settlements", id }, { type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
    recordPayment: builder.mutation<Settlement, { id: string; version: number; amount: string; paid_at: string; method: PaymentMethod; reference: string | null; notes: string | null }>({
      query: ({ id, ...body }) => ({ url: `/settlements/${id}/payments`, method: "POST", body }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Settlements", id }, { type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
    reversePayment: builder.mutation<Settlement, { id: string; paymentId: string; version: number; reason: string }>({
      query: ({ id, paymentId, ...body }) => ({ url: `/settlements/${id}/payments/${paymentId}/reverse`, method: "POST", body }),
      transformResponse: (response: Wrapped<Settlement>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [{ type: "Settlements", id }, { type: "Settlements", id: "LIST" }, "Dashboard"],
    }),
  }),
})

export const {
  useGetSettlementsQuery, useGetSettlementQuery, useCreateSettlementMutation, useUpdateSettlementMutation,
  useApproveSettlementMutation, useVoidSettlementMutation, useRecordPaymentMutation, useReversePaymentMutation,
} = settlementsApi
