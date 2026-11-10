"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(
      localStorage.getItem("restaurantCart") || "[]"
    );

    setCart(savedCart);
  }, []);

  function updateCart(updatedCart) {
    setCart(updatedCart);

    localStorage.setItem(
      "restaurantCart",
      JSON.stringify(updatedCart)
    );
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedCart);
  }

  function decreaseQuantity(id) {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  }

  function removeItem(id) {
    const updatedCart = cart.filter((item) => item.id !== id);
    updateCart(updatedCart);
  }

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

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        {/* Back to Dashboard */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-block font-semibold text-gray-600 hover:text-orange-600"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <h1 className="mb-8 text-3xl font-bold text-gray-900">
          Your Shopping Cart
        </h1>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-white p-8 shadow">
            <p className="text-gray-600">
              Your cart is empty. Visit our menu to add some delicious meals.
            </p>

            <Link
              href="/menu"
              className="mt-5 inline-block font-semibold text-orange-600 hover:text-orange-700"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow"
                >
                  <div>
                    <h2 className="font-bold text-gray-900">
                      {item.name}
                    </h2>

                    <p className="text-green-700">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      className="rounded bg-gray-200 px-3 py-1"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      className="rounded bg-gray-200 px-3 py-1"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-bold">
                Total: {formatPrice(total)}
              </h2>

              <Link
                href="/checkout"
                className="mt-5 block w-full rounded-lg bg-green-700 py-3 text-center font-semibold text-white hover:bg-green-800"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}