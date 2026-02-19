"use client";

import { useState, useRef } from "react";
import { addBookmark } from "../app/actions/bookmark";

export default function AddBookmarkForm() {
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const formRef = useRef(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const formData = new FormData(formRef.current);
		const result = await addBookmark(formData);

		setLoading(false);

		if (result?.error) {
			setError(result.error);
			return;
		}

		// Clear the form on success
		formRef.current.reset();
	};

	return (
		<form
			ref={formRef}
			onSubmit={handleSubmit}
			className="bg-white text-black rounded-xl border border-gray-200 p-6 flex flex-col gap-4"
		>
			<h2 className="font-semibold text-gray-800">Add New Bookmark</h2>

			<div className="flex flex-col gap-2">
				<input
					name="title"
					type="text"
					placeholder="Title (e.g. Tailwind Docs)"
					className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
					required
				/>
				<input
					name="url"
					type="text"
					placeholder="URL (e.g. https://tailwindcss.com)"
					className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
					required
				/>
			</div>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<button
				type="submit"
				disabled={loading}
				className="bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
			>
				{loading ? "Saving..." : "Add Bookmark"}
			</button>
		</form>
	);
}
