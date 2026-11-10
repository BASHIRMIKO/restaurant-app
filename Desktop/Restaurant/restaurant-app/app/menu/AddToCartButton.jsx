"use client";

export default function AddToCartButton({ item }) {
  function addToCart() {
    const existingCart = JSON.parse(
      localStorage.getItem("restaurantCart") || "[]"
    );

    const existingItem = existingCart.find(
      (cartItem) => cartItem.id === item.id
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = existingCart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...existingCart, { ...item, quantity: 1 }];
    }

    localStorage.setItem(
      "restaurantCart",
      JSON.stringify(updatedCart)
    );

    alert(`${item.name} added to cart!`);
  }

  return (
    <button
      onClick={addToCart}
      className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800"
    >
      Add to Cart
    </button>
  );
}