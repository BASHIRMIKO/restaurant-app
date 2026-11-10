"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminMenuManager({ menuItems }) {
  const supabase = createClient();

  const [items, setItems] = useState(menuItems);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
  });

  // Generate a preview whenever an image is selected
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must not exceed 5 MB.");
      e.target.value = "";
      return;
    }

    setMessage("");
    setImageFile(file);
  }

  function resetForm() {
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image_url: "",
    });

    setImageFile(null);
    setEditingId(null);
  }

  async function uploadImage(file) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "-");
    const filePath = `menu/${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw new Error("Image upload failed: " + error.message);
    }

    const { data } = supabase.storage
      .from("menu-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const price = Number(form.price);

      if (
        !form.name.trim() ||
        !form.category ||
        !Number.isFinite(price) ||
        price <= 0
      ) {
        setMessage("Please enter a valid name, category and price.");
        return;
      }

      let imageUrl = form.image_url.trim() || null;

      // Upload the selected image if one exists
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const menuData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        category: form.category,
        image_url: imageUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from("menu_items")
          .update(menuData)
          .eq("id", editingId);

        if (error) throw error;

        setItems((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? { ...item, ...menuData }
              : item
          )
        );

        setMessage("Menu item updated successfully!");
      } else {
        const { data, error } = await supabase
          .from("menu_items")
          .insert([menuData])
          .select()
          .single();

        if (error) throw error;

        setItems((previous) => [data, ...previous]);

        setMessage("Menu item added successfully!");
      }

      resetForm();

      // Reset the file input
      const fileInput = document.getElementById("menu-image");
      if (fileInput) fileInput.value = "";

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item) {
    setEditingId(item.id);

    setForm({
      name: item.name || "",
      description: item.description || "",
      price: String(item.price || ""),
      category: item.category || "",
      image_url: item.image_url || "",
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteItem(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    setMessage("");

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
    } else {
      setItems((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setMessage("Menu item deleted successfully!");
    }
  }

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <div className="space-y-8">

      {/* Add/Edit Form */}
      <section className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-bold">
          {editingId ? "Edit Menu Item" : "Add New Menu Item"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-2 block font-medium">
              Food or Drink Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Grilled Chicken"
              required
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the food or drink..."
              rows="3"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">
                Price (₦)
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="5000"
                min="1"
                step="0.01"
                required
                className="w-full rounded-lg border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Category</option>
                <option value="Starters">Starters</option>
                <option value="Main Courses">Main Courses</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
              </select>
            </div>

          </div>

          {/* Image Upload */}
          <div>
            <label className="mb-2 block font-medium">
              Food Image
            </label>

            <input
              id="menu-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              Accepted formats: JPG, PNG and WEBP. Maximum size: 5 MB.
            </p>
          </div>

          {/* Image Preview */}
          {(imagePreview || form.image_url) && (
            <div>
              <p className="mb-2 text-sm font-medium">
                Image Preview
              </p>

              <img
                src={imagePreview || form.image_url}
                alt="Food preview"
                className="h-48 w-48 rounded-lg border object-cover"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-green-700 px-6 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : editingId
                  ? "Save Changes"
                  : "Add Menu Item"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg bg-gray-200 px-6 py-3 font-semibold"
              >
                Cancel Editing
              </button>
            )}

          </div>

        </form>

        {message && (
          <p className="mt-4 rounded-lg bg-gray-100 p-3 text-sm">
            {message}
          </p>
        )}

      </section>

      {/* Existing Menu Items */}
      <section className="rounded-xl bg-white p-6 shadow">

        <h2 className="mb-6 text-xl font-bold">
          Existing Menu Items ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No menu items available.
          </p>
        ) : (

          <div className="space-y-4">

            {items.map((item) => (

              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4"
              >

                <div className="flex min-w-0 flex-1 items-center gap-4">

                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}

                  <div>
                    <h3 className="font-bold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {item.category}
                    </p>

                    <p className="mt-1 font-semibold text-green-700">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() => startEditing(item)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}