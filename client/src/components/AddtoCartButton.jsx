import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartProvider";

export default function AddToCartButton({ product, qty = 1, addOns = [], goToCart = false }) {
  const { items, add, clear } = useCart();
  const nav = useNavigate();

  const onAdd = () => {
    if (!product?._id || !product?.restaurant) {
      console.error("AddToCartButton: product missing _id/restaurant", product);
      return;
    }

    // Enforce single-restaurant carts
    if (items.length && items[0].restaurant !== product.restaurant) {
      const ok = window.confirm(
        "Your cart contains items from a different restaurant. Clear cart and add this item?"
      );
      if (!ok) return;
      clear();
    }

    add(product, qty, addOns);
    if (goToCart) nav("/cart");
  };

  return (
    <button
      type="button"
      onClick={onAdd}
      className="inline-flex items-center justify-center bg-black text-white rounded-full px-5 py-2 font-semibold hover:opacity-90"
    >
      Add to cart
    </button>
  );
}