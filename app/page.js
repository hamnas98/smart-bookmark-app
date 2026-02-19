import LoginButton from "../components/LoginButton";

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams
  const error = resolvedParams?.error

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">🔖</span>
          <h1 className="text-2xl font-bold text-gray-900">Smart Bookmarks</h1>
          <p className="text-gray-500 text-sm text-center">
            Save, organize, and access your bookmarks from anywhere
          </p>
        </div>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
            Authentication failed. Please try again.
          </div>
        )}

        <LoginButton />
      </div>
    </main>
  )
}