"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Search, UtensilsCrossed } from "lucide-react";

export default function MenuFilters({ menuItems }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item.category).filter(Boolean)),
  ];

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category === selectedCategory;

      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.description || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [menuItems, search, selectedCategory]);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div>

      {/* Search and Category Filters */}
      <div className="mb-10 space-y-6">

        <div className="relative mx-auto max-w-xl">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for your favourite food..."
            className="w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-5 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-white text-gray-700 hover:bg-orange-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

      </div>

      {/* Menu Items */}
      {filteredItems.length === 0 ? (
        <div className="rounded-xl bg-white py-16 text-center shadow-sm">

          <UtensilsCrossed
            size={45}
            className="mx-auto mb-4 text-gray-300"
          />

          <h2 className="text-xl font-bold text-gray-800">
            No food found
          </h2>

          <p className="mt-2 text-gray-500">
            Try another search or select a different category.
          </p>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
            className="mt-5 font-semibold text-orange-600 hover:text-orange-700"
          >
            Clear Filters
          </button>

        </div>
      ) : (

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

          {filteredItems.map((item) => (

            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Food Image */}
              <div className="relative overflow-hidden bg-gray-100">

                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-gray-400">
                    <UtensilsCrossed size={45} />
                  </div>
                )}

                <span className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-orange-600 shadow">
                  {item.category}
                </span>

              </div>

              {/* Food Details */}
              <div className="p-6">

                <h3 className="text-xl font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-gray-500">
                  {item.description || "Deliciously prepared for you."}
                </p>

                <div className="mt-6 flex items-center justify-between gap-3">

                  <span className="text-lg font-bold text-orange-600">
                    {formatPrice(item.price)}
                  </span>

                  <AddToCartButton item={item} />

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

      <p className="mt-8 text-center text-sm text-gray-500">
        Showing {filteredItems.length} of {menuItems.length} menu items
      </p>

    </div>
  );
}