import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function OrdersPage() {
  const supabase = await createClient();

  // Check whether the customer is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch orders belonging to this customer
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading orders: {error.message}
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "preparing":
        return "bg-blue-100 text-blue-700";

      case "ready":
        return "bg-purple-100 text-purple-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View your orders and track their progress.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <h2 className="text-xl font-bold text-gray-800">
              You haven't placed any orders yet.
            </h2>

            <p className="mt-3 text-gray-500">
              Explore our menu and order your favourite meals.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">

                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Order #{order.id.slice(0, 8)}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString("en-NG")}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </div>

                <div className="py-5">
                  <h3 className="mb-3 font-semibold text-gray-800">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">
                    {Array.isArray(order.items) &&
                      order.items.map((item, index) => (
                        <div
                          key={item.id || index}
                          className="flex justify-between gap-4 text-sm"
                        >
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>

                          <span className="font-medium text-gray-800">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-2 border-t pt-5 text-sm text-gray-600">
                  <p>
                    <strong>Customer:</strong> {order.customer_name}
                  </p>

                  <p>
                    <strong>Phone:</strong> {order.phone}
                  </p>

                  <p>
                    <strong>Delivery Address:</strong>{" "}
                    {order.delivery_address}
                  </p>
                </div>

                <div className="mt-5 flex justify-between border-t pt-5">
                  <span className="font-bold text-gray-800">
                    Total Amount
                  </span>

                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(order.total_price)}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/account"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            ← Back to Dashboard
          </Link>
        </div>

      </div>
    </main>
  );
}