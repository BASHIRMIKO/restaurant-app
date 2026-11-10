import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrderSuccessPage({ searchParams }) {
  const { id } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!id) {
    return <p className="p-10 text-center">Order ID not found.</p>;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Order Not Found
          </h1>
          <Link href="/menu" className="mt-4 inline-block text-green-700">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-lg">

        <div className="mb-6 text-center">
          <div className="text-6xl text-green-600">✓</div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>

          <p className="mt-2 text-gray-600">
            Thank you for ordering with us.
          </p>
        </div>

        <div className="mb-6 rounded-lg bg-gray-100 p-5">
          <p className="font-semibold">
            Order Number: {order.id}
          </p>

          <p className="mt-2">
            Customer: {order.customer_name}
          </p>

          <p>
            Phone: {order.phone}
          </p>

          <p>
            Delivery Address: {order.delivery_address}
          </p>

          <p className="mt-2 font-semibold text-green-700">
            Status: {order.status}
          </p>
        </div>

        <h2 className="mb-4 text-xl font-bold">
          Order Summary
        </h2>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between border-b pb-3"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                {formatPrice(
                  Number(item.price) * item.quantity
                )}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-green-700">
            {formatPrice(order.total_price)}
          </span>
        </div>

        <Link
          href="/menu"
          className="mt-8 block rounded-lg bg-green-700 py-3 text-center font-semibold text-white hover:bg-green-800"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}