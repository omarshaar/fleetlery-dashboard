import { documentAccessLink } from "@/services/api/documents/documentAccessLink"
import { eanoApi } from "@/services/api/eanoApi"
import type { DocumentQueueResponse, DocumentStatus, DriverDocument } from "@/types/document"
import type { PaginationMeta } from "@/types/driver"

type Wrapped<T> = { data: T; meta?: PaginationMeta }

export const documentsApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriverDocuments: builder.query<DriverDocument[], string>({
      query: (driverId) => `/drivers/${driverId}/documents`,
      transformResponse: (response: Wrapped<DriverDocument[]>) => response.data,
      providesTags: (_result, _error, driverId) => [{ type: "Documents", id: `DRIVER-${driverId}` }],
    }),
    getDocumentQueueDrivers: builder.query<Array<{ id: string; full_name: string }>, void>({
      query: () => "/documents/work-queue/drivers",
      transformResponse: (response: Wrapped<Array<{ id: string; full_name: string }>>) => response.data,
      providesTags: [{ type: "Drivers", id: "LIST" }],
    }),
    getDocumentQueue: builder.query<DocumentQueueResponse, { page: number; status?: DocumentStatus; driver_id?: string }>({
      query: (params) => ({ url: "/documents/work-queue", params: { ...params, per_page: 20 } }),
      transformResponse: (response: Wrapped<DocumentQueueResponse["data"]>) => ({
        data: response.data,
        meta: response.meta ?? { current_page: 1, per_page: 20, total: response.data.length, last_page: 1 },
      }),
      providesTags: [{ type: "Documents", id: "QUEUE" }],
    }),
    uploadDriverDocument: builder.mutation<DriverDocument, { driverId: string; documentId: string; version: number; file: File; expiresAt?: string }>({
      query: ({ driverId, documentId, version, file, expiresAt }) => {
        const body = new FormData()
        body.append("file", file)
        body.append("version", String(version))
        if (expiresAt) body.append("expires_at", expiresAt)
        return { url: `/drivers/${driverId}/documents/${documentId}/versions`, method: "POST", body }
      },
      transformResponse: (response: Wrapped<DriverDocument>) => response.data,
      invalidatesTags: (_result, _error, argument) => [
        { type: "Documents", id: `DRIVER-${argument.driverId}` },
        { type: "Documents", id: "QUEUE" },
        "Dashboard",
      ],
    }),
    reviewDocument: builder.mutation<DriverDocument, { documentId: string; version: number; status: "accepted" | "rejected"; reason?: string }>({
      query: ({ documentId, ...body }) => ({ url: `/documents/${documentId}/reviews`, method: "POST", body }),
      transformResponse: (response: Wrapped<DriverDocument>) => response.data,
      invalidatesTags: [{ type: "Documents", id: "QUEUE" }, "Dashboard"],
    }),
    createDocumentAccessLink: builder.mutation<{ url: string; expires_at: string }, string | number>({
      query: (versionId) => ({ url: `/document-versions/${versionId}/access-link`, method: "POST" }),
      transformResponse: (response: Wrapped<{ url: string; expires_at: string }>) => documentAccessLink(response.data),
    }),
  }),
})

export const {
  useGetDriverDocumentsQuery,
  useGetDocumentQueueQuery,
  useGetDocumentQueueDriversQuery,
  useUploadDriverDocumentMutation,
  useReviewDocumentMutation,
  useCreateDocumentAccessLinkMutation,
} = documentsApi