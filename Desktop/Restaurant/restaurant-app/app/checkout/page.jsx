"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const supabase = createClient();
  const router = useRouter();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    delivery_address: "",
  });

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("restaurantCart") || "[]"
    );

    setCart(savedCart);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleOrder(e) {
    e.preventDefault();

    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Check whether the customer is logged in
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.push("/login");
        return;
      }

      // Save the order in Supabase
      const { data, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          customer_name: form.customer_name,
          phone: form.phone,
          delivery_address: form.delivery_address,
          items: cart,
          total_price: total,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Clear the shopping cart
      localStorage.removeItem("restaurantCart");

      // Go to the confirmation page
      router.push(`/order-success?id=${data.id}`);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow">
            <h2 className="text-xl font-bold">
              Your cart is empty
            </h2>

            <Link
              href="/menu"
              className="mt-5 inline-block rounded-lg bg-green-700 px-6 py-3 text-white"
            >
              Browse Menu
            </Link>
          </div>
        ) : (

          <div className="grid gap-8 md:grid-cols-2">

            {/* Customer Information */}

            <form
              onSubmit={handleOrder}
              className="rounded-xl bg-white p-6 shadow"
            >

              <h2 className="mb-6 text-xl font-bold">
                Delivery Information
              </h2>

              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                required
                className="mb-5 w-full rounded-lg border p-3"
                placeholder="Enter your full name"
              />

              <label className="mb-2 block font-medium">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mb-5 w-full rounded-lg border p-3"
                placeholder="Enter your phone number"
              />

              <label className="mb-2 block font-medium">
                Delivery Address
              </label>

              <textarea
                name="delivery_address"
                value={form.delivery_address}
                onChange={handleChange}
                required
                rows="4"
                className="mb-5 w-full rounded-lg border p-3"
                placeholder="Enter your complete delivery address"
              />

              {error && (
                <p className="mb-4 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

            </form>

            {/* Order Summary */}

            <div className="h-fit rounded-xl bg-white p-6 shadow">

              <h2 className="mb-6 text-xl font-bold">
                Your Order
              </h2>

              <div className="space-y-4">

                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      {formatPrice(
                        Number(item.price) * item.quantity
                      )}
                    </p>
                  </div>
                ))}

              </div>

              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-green-700">
                  {formatPrice(total)}
                </span>
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}