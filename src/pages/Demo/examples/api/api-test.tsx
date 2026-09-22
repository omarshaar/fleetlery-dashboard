"use client"

import { useGetDemoPostsQuery } from "@/services/api/eanoApi"

export default function PostsTestPage() {
  const { data, isLoading, error, refetch, isFetching } = useGetDemoPostsQuery()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧪 Posts API Test (RTK Query)</h1>

      <div className="flex gap-3 mb-5">
        <button
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          🔁 Refresh
        </button>
      </div>

      {isLoading && <p>Loading for the first time...</p>}

      {isFetching && !isLoading && <p>Updating in background...</p>}

      {error && <p className="text-red-500">Error loading posts</p>}

      {data && (
        <ul className="space-y-2 bg-card p-6 rounded-lg shadow-md">
          {data.slice(0, 10).map((post: any) => (
            <li key={post.id} className="p-4 border rounded">
              <h3 className="font-semibold">{post.title}</h3>
              <p className="text-sm text-gray-600">{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
