import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import "./App.css";

// =========================
// COMPONENTS
// =========================
import Layout from "./Components/Layout";
import ProtectedRoute from "./Components/ProtectedRoute";

// =========================
// PAGES
// =========================
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import CustomerView from "./Pages/CustomerView";
import Orders from "./Pages/Orders";
import Customers from "./Pages/Customers";
import Analytics from "./Pages/Analytics";
import Settings from "./Pages/Settings";
import Cart from "./Pages/Cart";
import ProductDetails from "./Pages/ProductDetails";
import Checkout from "./Pages/Checkout";
import NotFound from "./Pages/NotFound";

// =========================
// DATA
// =========================
import { productsData } from "./data";

function App() {
  // =========================
  // PRODUCTS
  // =========================
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================
  // DARK MODE
  // =========================
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode =
      localStorage.getItem("darkMode");

    return savedMode === "true";
  });

  // =========================
  // SAVE DARK MODE
  // =========================
  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      String(darkMode)
    );
  }, [darkMode]);

  // =========================
  // LOAD PRODUCTS
  // =========================
  useEffect(() => {
    try {
      const savedProducts =
        JSON.parse(
          localStorage.getItem("products")
        ) || [];

      const updatedProducts =
        productsData.map((newProduct) => {
          const oldProduct =
            savedProducts.find(
              (product) =>
                product.id === newProduct.id
            );

          return {
            ...newProduct,

            // =========================
            // IMAGE
            // =========================
            image:
              newProduct.image ||
              oldProduct?.image ||
              "",

            // =========================
            // RATING
            // =========================
            rating:
              newProduct.rating ??
              oldProduct?.rating ??
              4.0,

            // =========================
            // STOCK
            // =========================
            stock:
              oldProduct?.stock !== undefined
                ? oldProduct.stock
                : newProduct.stock !== undefined
                ? newProduct.stock
                : 50,
          };
        });

      setProducts(updatedProducts);

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );

      setProducts(productsData);

      localStorage.setItem(
        "products",
        JSON.stringify(productsData)
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // SAVE PRODUCTS
  // =========================
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(
        "products",
        JSON.stringify(products)
      );
    }
  }, [products, loading]);

  // =========================
  // APP ROUTES
  // =========================
  return (
    <Routes>

      {/* =====================================================
          LOGIN
      ===================================================== */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* =====================================================
          PROTECTED APP LAYOUT
      ===================================================== */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </ProtectedRoute>
        }
      >

        {/* =================================================
            DASHBOARD
        ================================================= */}
        <Route
          index
          element={
            <Dashboard
              products={products}
              loading={loading}
            />
          }
        />

        {/* =================================================
            PRODUCTS
        ================================================= */}
        <Route
          path="products"
          element={
            <Products
              products={products}
              setProducts={setProducts}
              loading={loading}
            />
          }
        />

        {/* =================================================
            ORDERS
        ================================================= */}
        <Route
          path="orders"
          element={<Orders />}
        />

        {/* =================================================
            CUSTOMERS
        ================================================= */}
        <Route
          path="customers"
          element={<Customers />}
        />

        {/* =================================================
            CUSTOMER VIEW
        ================================================= */}
        <Route
          path="customer-view"
          element={
            <CustomerView
              products={products}
            />
          }
        />

        {/* =================================================
            ANALYTICS
        ================================================= */}
        <Route
          path="analytics"
          element={<Analytics />}
        />

        {/* =================================================
            SETTINGS
        ================================================= */}
        <Route
          path="settings"
          element={
            <Settings
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          }
        />

        {/* =================================================
            CART
        ================================================= */}
        <Route
          path="cart"
          element={<Cart />}
        />

        {/* =================================================
            PRODUCT DETAILS
        ================================================= */}
        <Route
          path="product/:id"
          element={<ProductDetails />}
        />

        {/* =================================================
            CHECKOUT
        ================================================= */}
        <Route
          path="checkout"
          element={<Checkout />}
        />

      </Route>

      {/* =====================================================
          404
      ===================================================== */}
      <Route
        path="*"
        element={<NotFound />}
      />

    </Routes>
  );
}

export default App;