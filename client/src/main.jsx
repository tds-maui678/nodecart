import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import store from "./store";
import App from "./App";
import "./index.css";
import ErrorBoundary from "./components/ErrorBoundry";

import { AuthProvider } from "./lib/AuthProvider";
import { CartProvider } from "./lib/CartProvider";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <Elements stripe={stripePromise}>
                  <App />
               </Elements>
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);