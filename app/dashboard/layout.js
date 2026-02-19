import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function DashboardLayout({ children }) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/");
	}

	return <div className="min-h-screen bg-gray-50">{children}</div>;
}
