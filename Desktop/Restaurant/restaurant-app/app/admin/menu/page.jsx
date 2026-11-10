import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminMenuManager from "./AdminMenuManager";

export default async function AdminMenuPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Verify administrator access
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  // Fetch menu items
  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading menu: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl">

        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Menu Management
        </h1>

        <p className="mb-8 text-gray-600">
          Add, edit and manage your restaurant menu.
        </p>

        <AdminMenuManager menuItems={menuItems || []} />

      </div>
    </main>
  );
}