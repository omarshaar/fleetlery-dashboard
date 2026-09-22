import { eanoApi } from "@/services/api/eanoApi"
import type { CurrentUser, LoginRequest } from "@/types/auth"

type Wrapped<T> = { data: T }
const backendOrigin = import.meta.env.VITE_BACKEND_ORIGIN || ""

async function initializeCsrf(): Promise<void> {
  const response = await fetch(`${backendOrigin}/sanctum/csrf-cookie`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-Request-ID": crypto.randomUUID(),
    },
  })

  if (!response.ok) throw new Error("secure_session_failed")
}

export const authApi = eanoApi.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<CurrentUser, void>({
      query: () => "/me",
      transformResponse: (response: Wrapped<CurrentUser>) => response.data,
      providesTags: ["CurrentUser"],
    }),
    login: builder.mutation<void, LoginRequest>({
      async queryFn(payload, _api, _extra, baseQuery) {
        try {
          await initializeCsrf()
        } catch {
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "secure_session_failed",
            },
          }
        }

        const result = await baseQuery({
          url: "/auth/login",
          method: "POST",
          body: payload,
        })

        return result.error ? { error: result.error } : { data: undefined }
      },
      invalidatesTags: ["CurrentUser"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_argument, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(eanoApi.util.resetApiState())
        }
      },
    }),
  }),
})

export const {
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi