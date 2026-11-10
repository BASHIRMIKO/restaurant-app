import { createClient } from "@/lib/supabase/server";
import MenuFilters from "./MenuFilters";
import Link from "next/link";

export default async function MenuPage() {
  const supabase = await createClient();

  const { data: menuItems, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category", { ascending: true });

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        Error loading menu: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">

       <div className="mb-8 flex items-center justify-between">
  <Link
    href="/account"
    className="font-semibold text-gray-600 hover:text-orange-600"
  >
    ← Back to Dashboard
  </Link>

  <Link
    href="/cart"
    className="rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
  >
    View Cart
  </Link>
</div>

        <div className="mb-12 text-center">
          <p className="mb-3 font-semibold uppercase tracking-widest text-orange-500">
            Freshly Prepared for You
          </p>

          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Explore Our Menu
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-gray-600">
            Discover delicious meals, refreshing drinks and tasty desserts
            prepared with care.
          </p>
        </div>

        <MenuFilters menuItems={menuItems || []} />

      </div>
    </main>
  );
}