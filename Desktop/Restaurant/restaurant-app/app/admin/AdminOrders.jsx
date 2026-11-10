"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminOrders({ orders }) {
  const [orderList, setOrderList] = useState(orders);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState("");

  const supabase = createClient();

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  async function updateStatus(orderId, newStatus) {
    setUpdating(orderId);
    setError("");

    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      setError(error.message);
    } else {
      setOrderList((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    }

    setUpdating(null);
  }

  if (orderList.length === 0) {
    return (
      <p className="py-10 text-center text-gray-500">
        No customer orders have been received yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">

      {error && (
        <p className="rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </p>
      )}

      {orderList.map((order) => (

        <div
          key={order.id}
          className="rounded-xl border border-gray-200 p-5"
        >

          <div className="mb-5 flex flex-wrap justify-between gap-3">

            <div>
              <h3 className="font-bold text-lg">
                Order #{String(order.id).slice(0, 8)}
              </h3>

              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString()}
              </p>
            </div>

            <span className="rounded-lg bg-yellow-100 px-3 py-2 text-sm font-semibold capitalize">
              {order.status}
            </span>

          </div>

          {/* Customer Details */}

          <div className="mb-5 grid gap-3 sm:grid-cols-2">

            <div>
              <p className="text-sm text-gray-500">
                Customer Name
              </p>

              <p className="font-semibold">
                {order.customer_name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone Number
              </p>

              <p className="font-semibold">
                {order.phone}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-gray-500">
                Delivery Address
              </p>

              <p className="font-semibold">
                {order.delivery_address}
              </p>
            </div>

          </div>

          {/* Ordered Food */}

          <h4 className="mb-3 font-bold">
            Ordered Items
          </h4>

          <div className="space-y-2">

            {order.items.map((item) => (

              <div
                key={item.id}
                className="flex justify-between text-sm"
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

          {/* Total */}

          <div className="mt-5 border-t pt-4">
            <div className="flex justify-between font-bold">

              <span>Order Total</span>

              <span className="text-green-700">
                {formatPrice(order.total_price)}
              </span>

            </div>
          </div>

          {/* Update Status */}

          <div className="mt-5">

            <label className="mb-2 block text-sm font-semibold">
              Update Order Status
            </label>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(order.id, e.target.value)
              }
              disabled={updating === order.id}
              className="w-full rounded-lg border p-3 sm:w-auto"
            >

              <option value="pending">Pending</option>

              <option value="preparing">Preparing</option>

              <option value="ready">Ready for Pickup/Delivery</option>

              <option value="completed">Completed</option>

              <option value="cancelled">Cancelled</option>

            </select>

            {updating === order.id && (
              <p className="mt-2 text-sm text-gray-500">
                Updating order...
              </p>
            )}

          </div>

        </div>

      ))}

    </div>
  );
}