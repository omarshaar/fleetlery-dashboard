import { documentAccessLink } from "@/services/api/documents/documentAccessLink"
import { eanoApi } from "@/services/api/eanoApi"
import type { PaginationMeta } from "@/types/driver"
import type { DriverCityOption, DriverDashboard, DriverInvitation, DriverPayout, DriverPayoutList, DriverPortalDocument, DriverProfile, InvitationDetails, InvitationRegistration, ProfileChange, ProfileChangeStatus } from "@/types/driverPortal"
import type { PaymentStatus } from "@/types/settlement"

type Wrapped<T> = { data: T; meta?: PaginationMeta }

export const driverPortalApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getDriverDashboard: builder.query<DriverDashboard, void>({ query: () => "/driver/dashboard", transformResponse: (response: Wrapped<DriverDashboard>) => response.data, providesTags: ["DriverPortal"] }),
    getDriverCities: builder.query<DriverCityOption[], void>({ query: () => "/driver/cities", transformResponse: (response: Wrapped<DriverCityOption[]>) => response.data, providesTags: ["DriverCities"] }),
    getDriverProfile: builder.query<DriverProfile, void>({ query: () => "/driver/profile", transformResponse: (response: Wrapped<DriverProfile>) => response.data, providesTags: ["DriverProfile"] }),
    getOwnDocuments: builder.query<DriverPortalDocument[], void>({ query: () => "/driver/documents", transformResponse: (response: Wrapped<DriverPortalDocument[]>) => response.data, providesTags: ["DriverDocuments"] }),
    uploadOwnDocument: builder.mutation<DriverPortalDocument, { id: string; version: number; file: File; expires_at?: string }>({
      query: ({ id, version, file, expires_at }) => { const body = new FormData(); body.append("file", file); body.append("version", String(version)); if (expires_at) body.append("expires_at", expires_at); return { url: `/driver/documents/${id}/versions`, method: "POST", body } },
      transformResponse: (response: Wrapped<DriverPortalDocument>) => response.data,
      invalidatesTags: ["DriverDocuments", "DriverPortal"],
    }),
    ownDocumentAccessLink: builder.mutation<{ url: string; expires_at: string }, string | number>({ query: (versionId) => ({ url: `/driver/document-versions/${versionId}/access-link`, method: "POST" }), transformResponse: (response: Wrapped<{ url: string; expires_at: string }>) => documentAccessLink(response.data) }),
    getOwnProfileChanges: builder.query<ProfileChange[], void>({ query: () => "/driver/profile-change-requests", transformResponse: (response: Wrapped<ProfileChange[]>) => response.data, providesTags: ["ProfileChanges"] }),
    requestProfileChange: builder.mutation<ProfileChange, { changes: ProfileChange["requested_changes"]; driver_note: string | null }>({
      query: ({ changes, driver_note }) => ({ url: "/driver/profile-change-requests", method: "POST", body: { ...changes, driver_note } }),
      transformResponse: (response: Wrapped<ProfileChange>) => response.data,
      invalidatesTags: ["ProfileChanges"],
    }),
    getOwnPayouts: builder.query<DriverPayoutList, { page: number; payment_status?: PaymentStatus; period_from?: string; period_to?: string }>({
      query: (params) => ({ url: "/driver/settlements", params: { ...params, per_page: 20 } }),
      transformResponse: (response: Wrapped<DriverPayout[]>) => ({ data: response.data, meta: response.meta ?? { current_page: 1, per_page: 20, total: response.data.length, last_page: 1 } }),
      providesTags: ["DriverPayouts"],
    }),
    getOwnPayout: builder.query<DriverPayout, string>({ query: (id) => `/driver/settlements/${id}`, transformResponse: (response: Wrapped<DriverPayout>) => response.data, providesTags: ["DriverPayouts"] }),
    inspectInvitation: builder.query<InvitationDetails, string>({ query: (token) => `/driver-invitations/${token}`, transformResponse: (response: Wrapped<InvitationDetails>) => response.data }),
    acceptInvitation: builder.mutation<void, { token: string; details: InvitationRegistration }>({ query: ({ token, details }) => ({ url: `/driver-invitations/${token}/accept`, method: "POST", body: details }) }),
    getDriverInvitations: builder.query<{ data: DriverInvitation[]; meta: PaginationMeta }, { page: number; status?: DriverInvitation["status"] }>({
      query: ({ page, status }) => ({ url: "/admin/driver-invitations", params: { page, status, per_page: 20 } }),
      transformResponse: (response: Wrapped<DriverInvitation[]>) => ({ data: response.data, meta: response.meta ?? { current_page: 1, per_page: 20, total: response.data.length, last_page: 1 } }),
      providesTags: ["DriverInvitations"],
    }),
    createDriverInvitation: builder.mutation<DriverInvitation, { label: string | null; admin_notes: string | null; expires_in_hours: number }>({
      query: (body) => ({ url: "/admin/driver-invitations", method: "POST", body }), transformResponse: (response: Wrapped<DriverInvitation>) => response.data, invalidatesTags: ["DriverInvitations"],
    }),
    revokeDriverInvitation: builder.mutation<DriverInvitation, { id: string; version: number; reason: string }>({
      query: ({ id, ...body }) => ({ url: `/admin/driver-invitations/${id}/revoke`, method: "POST", body }), transformResponse: (response: Wrapped<DriverInvitation>) => response.data, invalidatesTags: ["DriverInvitations"],
    }),    getAdminProfileChanges: builder.query<{ data: ProfileChange[]; meta: PaginationMeta }, { status?: ProfileChangeStatus; page: number }>({
      query: ({ status, page }) => ({ url: "/admin/profile-change-requests", params: { status, page, per_page: 20 } }),
      transformResponse: (response: Wrapped<ProfileChange[]>) => ({ data: response.data, meta: response.meta ?? { current_page: 1, per_page: 20, total: response.data.length, last_page: 1 } }),
      providesTags: ["ProfileChanges"],
    }),
    decideProfileChange: builder.mutation<ProfileChange, { id: string; version: number; decision: "approve" | "reject"; reason?: string }>({
      query: ({ id, decision, version, reason }) => ({ url: `/admin/profile-change-requests/${id}/${decision}`, method: "POST", body: { version, reason } }),
      transformResponse: (response: Wrapped<ProfileChange>) => response.data,
      invalidatesTags: ["ProfileChanges", "DriverProfile", "Drivers", "CurrentUser"],
    }),
  }),
})
export const { useGetDriverDashboardQuery, useGetDriverCitiesQuery, useGetDriverProfileQuery, useGetOwnDocumentsQuery, useUploadOwnDocumentMutation, useOwnDocumentAccessLinkMutation, useGetOwnProfileChangesQuery, useRequestProfileChangeMutation, useGetOwnPayoutsQuery, useGetOwnPayoutQuery, useInspectInvitationQuery, useAcceptInvitationMutation, useGetDriverInvitationsQuery, useCreateDriverInvitationMutation, useRevokeDriverInvitationMutation, useGetAdminProfileChangesQuery, useDecideProfileChangeMutation } = driverPortalApi
