import React from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";

import "./index.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store, persistor } from "./app/store.js";
import { CartProvider } from "./context/CartContext.jsx";
import { NotificationsProvider } from './context/NotificationContext.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<div>Loading Redux...</div>} persistor={persistor}>
      <React.StrictMode>
        <BrowserRouter>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID_SECRET}>
            <NotificationsProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </NotificationsProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    </PersistGate>
  </Provider>
);