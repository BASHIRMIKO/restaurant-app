import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./logout-button";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <div className="mb-10 rounded-2xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to Our Restaurant!
          </h1>

          <p className="mt-3 text-gray-600">
            You are successfully logged in.
          </p>

          <p className="mt-4 text-gray-700">
            <strong>Email:</strong> {user.email}
          </p>
        </div>

        <h2 className="mb-5 text-2xl font-bold text-gray-900">
          What would you like to do?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

          <Link
            href="/menu"
            className="rounded-xl bg-white p-7 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-orange-600">
              Browse Menu
            </h3>
            <p className="mt-3 text-gray-600">
              Explore our delicious meals, drinks and desserts.
            </p>
          </Link>

          <Link
            href="/cart"
            className="rounded-xl bg-white p-7 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-green-700">
              My Cart
            </h3>
            <p className="mt-3 text-gray-600">
              View your selected food items and proceed to checkout.
            </p>
          </Link>

          <Link
            href="/orders"
            className="rounded-xl bg-white p-7 shadow transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-blue-700">
              My Orders
            </h3>
            <p className="mt-3 text-gray-600">
              View your previous orders and their status.
            </p>
          </Link>

        </div>

        <div className="mt-10">
          <LogoutButton />
        </div>

      </div>
    </main>
  );
}