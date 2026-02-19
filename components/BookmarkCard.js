"use client";

import { useState } from "react";
import { deleteBookmark, editBookmark } from "../app/actions/bookmark";

export default function BookmarkCard({ bookmark }) {
	const [isEditing, setIsEditing] = useState(false);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		if (!confirm("Delete this bookmark?")) return;
		setLoading(true);

		const result = await deleteBookmark(bookmark.id);

		setLoading(false);
		if (result?.error) setError(result.error);
	};

	const handleEdit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(e.target);
		const result = await editBookmark(bookmark.id, formData);

		setLoading(false);

		if (result?.error) {
			setError(result.error);
			return;
		}

		setIsEditing(false);
	};

	if (isEditing) {
		return (
			<form
				onSubmit={handleEdit}
				className="bg-white rounded-xl border border-blue-200 p-5 flex flex-col gap-3"
			>
				<input
					name="title"
					defaultValue={bookmark.title}
					className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					required
				/>
				<input
					name="url"
					defaultValue={bookmark.url}
					className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					required
				/>

				{error && <p className="text-red-500 text-sm">{error}</p>}

				<div className="flex gap-2 justify-end">
					<button
						type="button"
						onClick={() => {
							setIsEditing(false);
							setError(null);
						}}
						className="text-sm text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={loading}
						className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
					>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		);
	}

	return (
		<div className="bg-white text-black rounded-xl border border-gray-200 p-5 flex items-start justify-between gap-4 group hover:border-gray-300 transition-colors">
			<div className="flex flex-col gap-1 min-w-0">
				<p className="font-medium text-gray-900 truncate">
					{bookmark.title}
				</p>
				<a
					href={bookmark.url}
					target="_blank"
					rel="noopener noreferrer"
					className="text-sm text-blue-500 hover:text-blue-700 hover:underline truncate transition-colors"
				>
					{bookmark.url}
				</a>
				<p className="text-xs text-gray-400 mt-1">
					{new Date(bookmark.created_at).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				</p>
			</div>

			{error && <p className="text-red-500 text-xs">{error}</p>}

			<div className="flex gap-1 shrink-0">
				<button
					onClick={() => setIsEditing(true)}
					className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
					title="Edit"
				>
					✏️
				</button>
				<button
					onClick={handleDelete}
					disabled={loading}
					className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
					title="Delete"
				>
					🗑️
				</button>
			</div>
		</div>
	);
}
