"use client";

import { useState, useEffect } from "react";

import BookmarkCard from "./BookmarkCard";
import { createClient } from "../lib/supabase/client";

export default function BookmarkList({ initialBookmarks }) {
	const [bookmarks, setBookmarks] = useState(initialBookmarks);

	useEffect(() => {
		setBookmarks(initialBookmarks);
	}, [initialBookmarks]);

	useEffect(() => {
		const supabase = createClient();
		console.log("🔌 Setting up realtime...");

		let cleanup;

		const setupRealtime = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();

			console.log("👤 User:", user?.id, "| Error:", error);

			if (!user) {
				console.log("❌ No user found — subscription aborted");
				return;
			}

			const channel = supabase
				.channel(`bookmarks-${user.id}`)
				.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "bookmarks",
						filter: `user_id=eq.${user.id}`,
					},
					(payload) => {
						console.log("📨 Realtime event received:", payload);

						const { eventType, new: newRow, old: oldRow } = payload;

						if (eventType === "INSERT") {
							console.log("➕ INSERT:", newRow);
							setBookmarks((current) => {
								const exists = current.find((b) => b.id === newRow.id);
								if (exists) {
									console.log("⚠️ Duplicate detected, skipping");
									return current;
								}
								return [newRow, ...current];
							});
						}

						if (eventType === "UPDATE") {
							console.log("✏️ UPDATE:", newRow);
							setBookmarks((current) =>
								current.map((b) => (b.id === newRow.id ? newRow : b)),
							);
						}

						if (eventType === "DELETE") {
							console.log("🗑️ DELETE:", oldRow);
							setBookmarks((current) =>
								current.filter((b) => b.id !== oldRow.id),
							);
						}
					},
				)
				.subscribe((status, err) => {
					console.log("📡 Subscription status:", status, err || "");
					// status will be: SUBSCRIBED, TIMED_OUT, CLOSED, or CHANNEL_ERROR
				});

			return () => {
				console.log("🧹 Cleaning up realtime channel");
				supabase.removeChannel(channel);
			};
		};

		setupRealtime().then((fn) => {
			cleanup = fn;
		});

		return () => {
			if (cleanup) cleanup();
		};
	}, []);

	if (bookmarks.length === 0) {
		return (
			<div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
				<span className="text-4xl block mb-3">🔖</span>
				<p className="text-gray-500 text-sm">
					No bookmarks yet. Add your first one above.
				</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{bookmarks.map((bookmark) => (
				<BookmarkCard key={bookmark.id} bookmark={bookmark} />
			))}
		</div>
	);
}
