import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

export default function StripeWrapper({ children }) {
  const pk = import.meta.env.VITE_STRIPE_PK;

  if (!pk || !pk.startsWith("pk_")) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Stripe not configured</h2>
        <p className="text-sm text-gray-700">
          Missing or invalid <code>VITE_STRIPE_PK</code>. Add it to <code>client/.env</code> and restart Vite.
        </p>
      </div>
    );
  }

  const stripePromise = loadStripe(pk);
  return <Elements stripe={stripePromise}>{children}</Elements>;
}