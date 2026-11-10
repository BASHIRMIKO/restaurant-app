import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdminOrders from "./AdminOrders";

export default async function AdminPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check administrator permission
  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/account");
  }

  // Fetch customer orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading orders: {error.message}
      </div>
    );
  }

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  return (
    <main className="min-h-screen bg-gray-100 p-6">

      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your restaurant orders.
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Admin: {user.email}
          </p>
        </div>

        {/* Statistics */}

        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="Total Orders"
            value={totalOrders}
          />

          <StatCard
            title="Pending Orders"
            value={pendingOrders}
          />

          <StatCard
            title="Preparing Orders"
            value={preparingOrders}
          />

          <StatCard
            title="Completed Orders"
            value={completedOrders}
          />

        </div>

        {/* Orders */}

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="mb-6 text-2xl font-bold">
            Customer Orders
          </h2>

          <AdminOrders orders={orders} />

        </div>

      </div>

    </main>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <h2 className="mt-3 text-3xl font-bold text-green-700">
        {value}
      </h2>
    </div>
  );
}