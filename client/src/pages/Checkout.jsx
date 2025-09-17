import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import StripeWrapper from "../components/StripeWrapper";
import api from "../api";
import { useCart } from "../lib/CartProvider";
import { useAuth } from "../lib/AuthProvider";

function CheckoutInner() {
  const stripe = useStripe();
  const elements = useElements();
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  const amountCents = useMemo(() => Math.round(subtotal * 100), [subtotal]);
  const restaurantId = items[0]?.restaurant || null;

  // If cart empty, go to cart
  useEffect(() => {
    if (!items.length) nav("/cart", { replace: true });
  }, [items.length, nav]);

  // Fetch PaymentIntent as soon as we arrive
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setErr("");
        if (amountCents <= 0) throw new Error("Your cart is empty.");
        const { data } = await api.post("/api/stripe/create-payment-intent", { amount: amountCents });
        if (mounted) setClientSecret(data.clientSecret);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message || "Could not start checkout.";
        if (mounted) setErr(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [amountCents]);

  async function handlePay(e) {
    e.preventDefault();
    setErr("");
    if (!stripe || !elements || !clientSecret) return;

    try {
      setPaying(true);
      // 1) Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) {
        setErr(result.error.message || "Payment failed");
        setPaying(false);
        return;
      }

      // 2) Create + mark order paid
      const orderPayload = {
        items: items.map(i => ({
          product: i.productId,
          restaurant: i.restaurant,
          title: i.title,
          qty: i.qty,
          price: i.price,
          image: i.image,
          addOns: i.addOns,
          lineTotal: i.lineTotal,
        })),
        shippingAddress: {
          fullName: user?.name || "",
          address: "Pickup / N/A",
          city: "", state: "", postalCode: "", country: ""
        },
        subtotal,
        total: subtotal,
        stripePaymentIntentId: result.paymentIntent.id,
        restaurant: restaurantId,
      };

      const created = await api.post("/api/orders", orderPayload);
      await api.put(`/api/orders/${created.data._id}/paid`);

      clear();
      nav("/orders", { replace: true });
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Payment/Order failed";
      setErr(msg);
    } finally {
      setPaying(false);
    }
  }

  if (loading) return <div className="max-w-lg mx-auto p-6">Starting checkout…</div>;

  // If PI failed to create (401 or any other error), show message & a way back.
  if (err && !clientSecret) {
    return (
      <div className="max-w-lg mx-auto p-6">
        <h1 className="text-2xl font-bold mb-3">Checkout</h1>
        <div className="mb-4 border border-red-300 bg-red-50 text-red-800 px-3 py-2 rounded">{err}</div>
        <button className="underline" onClick={() => nav("/cart")}>Back to cart</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {err && <div className="mb-3 border border-red-300 bg-red-50 text-red-800 px-3 py-2 rounded">{err}</div>}

      <form onSubmit={handlePay} className="space-y-4">
        <div className="border rounded p-3">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
        <button
          disabled={!stripe || paying}
          className="w-full bg-black text-white rounded-full py-2 font-semibold disabled:opacity-60"
        >
          {paying ? "Processing…" : `Pay $${subtotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <StripeWrapper>
      <CheckoutInner />
    </StripeWrapper>
  );
}