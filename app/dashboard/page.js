import AddBookmarkForm from "../../components/AddBookmarkForm";
import BookmarkList from "../../components/BookmarkList";
import LogoutButton from "../../components/LogoutButton";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	// Fetch initial bookmarks from server
	const { data: bookmarks, error } = await supabase
		.from("bookmarks")
		.select("*")
		.order("created_at", { ascending: false });

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			{/* Header */}
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<span className="text-3xl">🔖</span>
					<div>
						<h1 className="text-xl font-bold text-gray-900">
							Smart Bookmarks
						</h1>
						<p className="text-sm text-gray-500">{user?.email}</p>
					</div>
				</div>
				<LogoutButton />
			</div>

			{/* Add Bookmark Form */}
			<div className="mb-8">
				<AddBookmarkForm />
			</div>

			{/* Bookmark List — receives initial data, handles realtime in Phase 5 */}
			<BookmarkList initialBookmarks={bookmarks || []} />
		</div>
	);
}
