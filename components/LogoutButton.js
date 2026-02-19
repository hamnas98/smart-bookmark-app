"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase/client";

export default function LogoutButton() {
	const router = useRouter();

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push("/");
		router.refresh();
	};

	return (
		<button
			onClick={handleLogout}
			className="text-sm text-gray-500 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
		>
			Sign out
		</button>
	);
}
