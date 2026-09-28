import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { categories } from "../data";

// =========================================================
// CATEGORY IMAGE IMPORTS
// IMPORTANT: ALL FILES ARE .PNG
// =========================================================

import fruitsVegetables from "../assets/category/fruits-vegetables.png";
import dairyBreakfast from "../assets/category/dairy-breakfast.png";
import snacksMunchies from "../assets/category/snacks-munchies.png";
import beverages from "../assets/category/beverages.png";
import staplesEssentials from "../assets/category/staples-essentials.png";
import bakeryBiscuits from "../assets/category/biscuits-bakery.png";
import personalCare from "../assets/category/personal-care.png";
import homeCare from "../assets/category/home-care.png";
import babyCare from "../assets/category/baby-care.png";
import beautyCosmetics from "../assets/category/beauty-cosmetics.png";
import electronics from "../assets/category/electronics.png";
import fashion from "../assets/category/fashion.png";
import homeKitchen from "../assets/category/home-kitchen.png";
import toysGames from "../assets/category/toys-games.png";
import petsCare from "../assets/category/pets-care.png";

// =========================================================
// CATEGORY IMAGES
// =========================================================

const categoryImages = {
  "Fruits & Vegetables": fruitsVegetables,
  "Dairy & Breakfast": dairyBreakfast,
  "Snacks & Munchies": snacksMunchies,
  Beverages: beverages,
  "Staples & Essentials": staplesEssentials,
  "Bakery & Biscuits": bakeryBiscuits,
  "Personal Care": personalCare,
  "Home Care": homeCare,
  "Baby Care": babyCare,
  "Beauty & Cosmetics": beautyCosmetics,
  Electronics: electronics,
  Fashion: fashion,
  "Home & Kitchen": homeKitchen,
  "Toys & Games": toysGames,
  "Pets Care": petsCare,
};

// =========================================================
// NORMALIZE
// =========================================================

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

// =========================================================
// PRODUCT IMAGE
// =========================================================

function getProductImage(product) {
  if (
    product?.image &&
    typeof product.image === "string" &&
    product.image.trim() !== ""
  ) {
    return product.image;
  }

  return "";
}

// =========================================================
// RATING VALUE
// =========================================================

function getRatingValue(rating) {
  const value =
    typeof rating === "object"
      ? rating?.rate ??
        rating?.value ??
        rating?.rating
      : rating;

  const numeric = Number(value);

  return Number.isFinite(numeric)
    ? numeric
    : null;
}

// =========================================================
// RATING STARS
// =========================================================

function RatingStars({ rating }) {
  const numeric = getRatingValue(rating);

  if (numeric === null) {
    return (
      <span className="no-rating">
        No rating
      </span>
    );
  }

  return (
    <div className="rating-box">
      <span className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              numeric >= star
                ? "star full"
                : numeric >= star - 0.5
                ? "star half"
                : "star empty"
            }
          >
            ★
          </span>
        ))}
      </span>

      <span className="rating-number">
        {numeric.toFixed(1)}
      </span>
    </div>
  );
}

// =========================================================
// CUSTOMER VIEW
// =========================================================

function CustomerView({ products = [] }) {
  const navigate = useNavigate();

  const outletContext =
    useOutletContext() || {};

  const {
    search = "",
    cartItems = [],
    reloadCart,
  } = outletContext;

  // =======================================================
  // STATE
  // =======================================================

  const [orders, setOrders] = useState([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  const [
    showCartDrawer,
    setShowCartDrawer,
  ] = useState(false);

  // =======================================================
  // SEARCH
  // =======================================================

  const searchQuery = normalize(search);

  const isSearching =
    searchQuery.length > 0;

  // =======================================================
  // LOAD ORDERS
  // =======================================================

  useEffect(() => {
    try {
      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "orders"
          ) || "[]"
        );

      setOrders(
        Array.isArray(savedOrders)
          ? savedOrders
          : []
      );
    } catch (error) {
      console.error(
        "Orders load failed:",
        error
      );

      setOrders([]);
    }
  }, []);

  // =======================================================
  // CART DRAWER EVENT
  //
  // IMPORTANT:
  // Add to Cart does NOT open drawer automatically.
  // Drawer opens only when another part of app
  // explicitly sends "openCartDrawer".
  // =======================================================

  useEffect(() => {
    const openCart = () => {
      setShowCartDrawer(true);
    };

    window.addEventListener(
      "openCartDrawer",
      openCart
    );

    return () => {
      window.removeEventListener(
        "openCartDrawer",
        openCart
      );
    };
  }, []);

  // =======================================================
  // CATEGORY PRODUCT DATA
  // =======================================================

  const categoryProductData =
    useMemo(() => {
      const result = {};

      categories.forEach((category) => {
        result[category] =
          products.filter(
            (product) =>
              normalize(
                product.category
              ) ===
              normalize(category)
          );
      });

      return result;
    }, [products]);

  // =======================================================
  // CURRENT CATEGORY PRODUCTS
  // =======================================================

  const currentProducts =
    useMemo(() => {
      if (!selectedCategory) {
        return [];
      }

      return (
        categoryProductData[
          selectedCategory
        ] || []
      );
    }, [
      categoryProductData,
      selectedCategory,
    ]);

  // =======================================================
  // FILTERED PRODUCTS
  // =======================================================

  const filteredProducts =
    useMemo(() => {
      // ---------------------------------------------------
      // GLOBAL SEARCH
      // ---------------------------------------------------

      if (isSearching) {
        return products
          .map((product) => ({
            ...product,
            image:
              getProductImage(
                product
              ),
          }))
          .filter((product) => {
            const productName =
              normalize(
                product.name
              );

            const productCategory =
              normalize(
                product.category
              );

            return (
              productName.includes(
                searchQuery
              ) ||
              productCategory.includes(
                searchQuery
              )
            );
          });
      }

      // ---------------------------------------------------
      // CATEGORY VIEW
      // ---------------------------------------------------

      if (!selectedCategory) {
        return [];
      }

      return currentProducts.map(
        (product) => ({
          ...product,
          image:
            getProductImage(
              product
            ),
        })
      );
    }, [
      products,
      currentProducts,
      selectedCategory,
      searchQuery,
      isSearching,
    ]);

  // =======================================================
  // ADD TO CART
  // IMPORTANT:
  // DOES NOT OPEN CART DRAWER AUTOMATICALLY
  // =======================================================

  function addToCart(product) {
    try {
      const saved =
        JSON.parse(
          localStorage.getItem(
            "cart"
          ) || "[]"
        );

      const cart =
        Array.isArray(saved)
          ? saved
          : [];

      const existingItem =
        cart.find(
          (item) =>
            item.id ===
            product.id
        );

      let updatedCart;

      if (existingItem) {
        updatedCart =
          cart.map((item) =>
            item.id ===
            product.id
              ? {
                  ...item,
                  quantity:
                    Number(
                      item.quantity ||
                        1
                    ) + 1,
                }
              : item
          );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(
          updatedCart
        )
      );

      reloadCart?.();

      // -------------------------------------------------
      // IMPORTANT:
      // NO setShowCartDrawer(true)
      // -------------------------------------------------

      window.dispatchEvent(
        new Event("cartUpdated")
      );
    } catch (error) {
      console.error(
        "Cart update failed:",
        error
      );
    }
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="customer-view-page">

      {/* =================================================
          CATEGORY CSS
          
          IMPORTANT:
          Unique class names are used here so old
          .category-grid / .category-card CSS cannot
          accidentally make images full screen.
      ================================================= */}

      <style>
        {`
          /* ================================================
             NEXACART CATEGORY SECTION
          ================================================ */

          .nexa-category-section {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            padding: 0 0 18px;
            box-sizing: border-box;
          }

          .nexa-category-heading {
            width: 100%;
            margin: 0 0 14px;
            padding: 0 8px;
            box-sizing: border-box;
          }

          .nexa-category-heading h2 {
            margin: 0;
            font-size: 27px;
            line-height: 1.2;
            font-weight: 700;
          }

          /* ================================================
             EXACTLY 5 CATEGORIES PER ROW ON DESKTOP
          ================================================ */

          .nexa-category-grid {
            width: 100%;
            display: grid !important;
            grid-template-columns:
              repeat(5, minmax(0, 1fr)) !important;
            gap: 16px !important;
            align-items: stretch;
            box-sizing: border-box;
          }

          /* ================================================
             CATEGORY CARD
          ================================================ */

          .nexa-category-card {
            width: 100% !important;
            min-width: 0 !important;
            max-width: none !important;
            height: 252px !important;

            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;

            padding: 7px 7px 10px !important;
            margin: 0 !important;

            border: 1px solid #dfe4ea !important;
            border-radius: 15px !important;

            background: #ffffff !important;

            box-sizing: border-box !important;

            overflow: hidden !important;

            cursor: pointer;

            appearance: none;
            -webkit-appearance: none;

            transition:
              transform 0.18s ease,
              box-shadow 0.18s ease,
              border-color 0.18s ease;
          }

          .nexa-category-card:hover {
            transform: translateY(-2px);
            box-shadow:
              0 6px 18px rgba(0, 0, 0, 0.08);
            border-color: #cfd6df !important;
          }

          /* ================================================
             CATEGORY IMAGE CONTAINER
             
             VERY IMPORTANT:
             Image gets fixed height.
             It can NEVER become full screen.
          ================================================ */

          .nexa-category-image-wrap {
            width: 100% !important;
            height: 172px !important;
            min-height: 172px !important;
            max-height: 172px !important;

            flex: 0 0 172px !important;

            display: flex !important;
            align-items: center !important;
            justify-content: center !important;

            overflow: hidden !important;

            border-radius: 11px !important;

            background: #f7f7f7 !important;

            box-sizing: border-box !important;
          }

          .nexa-category-image-wrap img {
            display: block !important;

            width: 100% !important;
            height: 100% !important;

            max-width: 100% !important;
            max-height: 100% !important;

            min-width: 0 !important;
            min-height: 0 !important;

            object-fit: cover !important;
            object-position: center !important;

            margin: 0 !important;
            padding: 0 !important;

            border: 0 !important;
          }

          /* ================================================
             CATEGORY NAME
          ================================================ */

          .nexa-category-name {
            display: block !important;

            width: 100% !important;

            margin-top: 10px !important;

            text-align: center !important;

            font-size: 17px !important;
            line-height: 22px !important;
            font-weight: 700 !important;

            color: #111827 !important;

            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;

            box-sizing: border-box;
          }

          /* ================================================
             CATEGORY COUNT
          ================================================ */

          .nexa-category-count {
            display: block !important;

            margin-top: 6px !important;

            font-size: 14px !important;
            line-height: 18px !important;

            color: #536070 !important;

            text-align: center !important;
          }

          /* ================================================
             DARK MODE
          ================================================ */

          .dark .nexa-category-card {
            background: #1b1b1b !important;
            border-color: #3a3a3a !important;
          }

          .dark .nexa-category-image-wrap {
            background: #252525 !important;
          }

          .dark .nexa-category-name {
            color: #ffffff !important;
          }

          .dark .nexa-category-count {
            color: #b8c0ca !important;
          }

          /* ================================================
             LARGE SCREEN
          ================================================ */

          @media (min-width: 1600px) {
            .nexa-category-section {
              max-width: 1500px;
            }

            .nexa-category-grid {
              gap: 18px !important;
            }

            .nexa-category-card {
              height: 270px !important;
            }

            .nexa-category-image-wrap {
              height: 188px !important;
              min-height: 188px !important;
              max-height: 188px !important;
              flex-basis: 188px !important;
            }
          }

          /* ================================================
             TABLET
          ================================================ */

          @media (max-width: 1100px) {
            .nexa-category-grid {
              grid-template-columns:
                repeat(4, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 850px) {
            .nexa-category-grid {
              grid-template-columns:
                repeat(3, minmax(0, 1fr)) !important;
            }
          }

          @media (max-width: 650px) {
            .nexa-category-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
              gap: 12px !important;
            }

            .nexa-category-card {
              height: 235px !important;
            }

            .nexa-category-image-wrap {
              height: 155px !important;
              min-height: 155px !important;
              max-height: 155px !important;
              flex-basis: 155px !important;
            }

            .nexa-category-name {
              font-size: 15px !important;
            }
          }

          @media (max-width: 420px) {
            .nexa-category-grid {
              grid-template-columns:
                repeat(2, minmax(0, 1fr)) !important;
              gap: 9px !important;
            }

            .nexa-category-card {
              height: 210px !important;
              padding: 5px !important;
            }

            .nexa-category-image-wrap {
              height: 135px !important;
              min-height: 135px !important;
              max-height: 135px !important;
              flex-basis: 135px !important;
            }

            .nexa-category-name {
              font-size: 14px !important;
              line-height: 18px !important;
              margin-top: 7px !important;
            }

            .nexa-category-count {
              font-size: 12px !important;
              margin-top: 4px !important;
            }
          }
        `}
      </style>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="customer-main">

        {/* =================================================
            CATEGORY SCREEN
        ================================================= */}

        {!selectedCategory &&
          !isSearching && (
            <section className="nexa-category-section">

              {/* -------------------------------------------
                  ONLY "SHOP BY CATEGORY"
              ------------------------------------------- */}

              <div className="nexa-category-heading">
                <h2>
                  Shop by Category
                </h2>
              </div>

              {/* -------------------------------------------
                  CATEGORY GRID
                  5 PER ROW
              ------------------------------------------- */}

              <div className="nexa-category-grid">

                {categories.map(
                  (category) => {

                    const items =
                      categoryProductData[
                        category
                      ] || [];

                    const image =
                      categoryImages[
                        category
                      ];

                    return (
                      <button
                        type="button"
                        key={category}
                        className="nexa-category-card"
                        onClick={() =>
                          setSelectedCategory(
                            category
                          )
                        }
                      >

                        {/* CATEGORY IMAGE */}

                        <div className="nexa-category-image-wrap">

                          {image ? (
                            <img
                              src={image}
                              alt={category}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              style={{
                                fontSize:
                                  "42px",
                              }}
                            >
                              🛍️
                            </div>
                          )}

                        </div>

                        {/* CATEGORY NAME */}

                        <span className="nexa-category-name">
                          {category}
                        </span>

                        {/* PRODUCT COUNT */}

                        <span className="nexa-category-count">
                          {items.length || 20}{" "}
                          Products
                        </span>

                      </button>
                    );
                  }
                )}

              </div>
            </section>
          )}

        {/* =================================================
            PRODUCTS / SEARCH
        ================================================= */}

        {(selectedCategory ||
          isSearching) && (
          <section className="products-section">

            {/* PRODUCT HEADER */}

            <div className="product-section-header">

              <div>

                <h2>
                  {isSearching
                    ? "Search Results"
                    : selectedCategory}
                </h2>

                <p>
                  {isSearching
                    ? `Products matching "${search}"`
                    : "Fresh & quality products"}
                </p>

              </div>

              <div className="product-count">
                {
                  filteredProducts.length
                }{" "}
                Products
              </div>

            </div>

            {/* NO PRODUCTS */}

            {filteredProducts.length ===
            0 ? (

              <div className="empty-products">

                <h3>
                  No products found
                </h3>

                <p>
                  Try another product
                  name.
                </p>

              </div>

            ) : (

              <div className="products-grid">

                {filteredProducts.map(
                  (product) => {

                    const stock =
                      Number(
                        product.stock ||
                          0
                      );

                    const inCart =
                      cartItems.some(
                        (item) =>
                          item.id ===
                          product.id
                      );

                    const productImage =
                      product.image ||
                      "";

                    return (
                      <article
                        className="product-card"
                        key={
                          product.id
                        }
                      >

                        {/* PRODUCT LINK */}

                        <div
                          className="product-link"
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            navigate(
                              `/product/${product.id}`
                            )
                          }
                          onKeyDown={(
                            event
                          ) => {

                            if (
                              event.key ===
                                "Enter" ||
                              event.key ===
                                " "
                            ) {
                              event.preventDefault();

                              navigate(
                                `/product/${product.id}`
                              );
                            }

                          }}
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="product-image-wrap">

                            {productImage ? (

                              <img
                                src={
                                  productImage
                                }
                                alt={
                                  product.name
                                }
                                loading="lazy"
                                onError={(
                                  event
                                ) => {

                                  event.currentTarget.style.display =
                                    "none";

                                  event.currentTarget.parentElement?.classList.add(
                                    "image-error"
                                  );

                                }}
                              />

                            ) : (

                              <div className="product-image-placeholder">

                                <span>
                                  🛍️
                                </span>

                                <small>
                                  Image not
                                  available
                                </small>

                              </div>

                            )}

                          </div>

                          {/* PRODUCT NAME */}

                          <h3>
                            {
                              product.name
                            }
                          </h3>

                        </div>

                        {/* RATING */}

                        <RatingStars
                          rating={
                            product.rating
                          }
                        />

                        {/* PRICE */}

                        <div className="price-row">

                          <strong>
                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>

                          <span>
                            /{" "}
                            {product.unit ||
                              "1 Piece"}
                          </span>

                        </div>

                        {/* STOCK */}

                        <p
                          className={
                            stock > 0
                              ? "stock green"
                              : "stock red"
                          }
                        >
                          {stock > 0
                            ? `✓ In Stock (${stock})`
                            : "✕ Out of Stock"}
                        </p>

                        {/* VIEW PRODUCT */}

                        <button
                          type="button"
                          className="customer-view-product-btn"
                          onClick={() =>
                            navigate(
                              `/product/${product.id}`
                            )
                          }
                        >
                          View Product
                        </button>

                        {/* ADD TO CART */}

                        <button
                          type="button"
                          className="customer-add-cart-btn"
                          disabled={
                            stock <= 0
                          }
                          onClick={() =>
                            addToCart(
                              product
                            )
                          }
                        >
                          🛒 Add to Cart
                        </button>

                        {/* GO TO CART */}

                        {inCart && (
                          <button
                            type="button"
                            className="customer-go-cart-btn"
                            onClick={() =>
                              setShowCartDrawer(
                                true
                              )
                            }
                          >
                            🛒 Go to Cart
                          </button>
                        )}

                        {/* BUY NOW */}

                        <button
                          type="button"
                          className="customer-buy-now-btn"
                          disabled={
                            stock <= 0
                          }
                          onClick={() => {

                            if (
                              stock > 0
                            ) {
                              navigate(
                                `/product/${product.id}`
                              );
                            }

                          }}
                        >
                          ⚡ Buy Now
                        </button>

                      </article>
                    );
                  }
                )}

              </div>
            )}

            {/* BACK TO CATEGORY */}

            {selectedCategory &&
              !isSearching && (
                <div className="back-to-categories-wrapper">

                  <button
                    type="button"
                    className="back-category-btn"
                    onClick={() =>
                      setSelectedCategory(
                        null
                      )
                    }
                  >
                    ← Back to Categories
                  </button>

                </div>
              )}

          </section>
        )}

        {/* =================================================
            MY ORDERS
        ================================================= */}

        {selectedCategory &&
          !isSearching && (
            <section className="orders-section">

              <h2>
                📦 My Orders
              </h2>

              {orders.length ===
              0 ? (

                <div className="no-orders">

                  <p>
                    No orders yet.
                  </p>

                </div>

              ) : (

                <div className="orders-list">

                  {orders.map(
                    (order) => (
                      <div
                        className="order-card"
                        key={
                          order.id
                        }
                      >

                        <h3>
                          {
                            order.product
                          }
                        </h3>

                        <p>
                          <strong>
                            Order ID:
                          </strong>{" "}
                          {
                            order.id
                          }
                        </p>

                        <p>
                          <strong>
                            Amount:
                          </strong>{" "}
                          ₹
                          {Number(
                            order.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                        <p>
                          <strong>
                            Delivery
                            Status:
                          </strong>{" "}

                          {order.status ===
                            "Pending" &&
                            "⏳ Pending"}

                          {order.status ===
                            "Shipped" &&
                            "🚚 Shipped"}

                          {order.status ===
                            "Delivered" &&
                            "✅ Delivered"}

                          {![ 
                            "Pending",
                            "Shipped",
                            "Delivered",
                          ].includes(
                            order.status
                          ) &&
                            (
                              order.status ||
                              "Processing"
                            )}

                        </p>

                      </div>
                    )
                  )}

                </div>

              )}

            </section>
          )}

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="nexa-footer">

        <div>
          © 2024 NexaCart.
          All rights reserved.
        </div>

        <div className="footer-links">

          <span>
            Privacy Policy
          </span>

          <span>|</span>

          <span>
            Terms & Conditions
          </span>

          <span>|</span>

          <span>
            Help & Support
          </span>

        </div>

      </footer>

      {/* =================================================
          CART DRAWER
      ================================================= */}

      {showCartDrawer && (
        <CartDrawer
          cart={cartItems}
          closeDrawer={() =>
            setShowCartDrawer(false)
          }
          reloadCart={reloadCart}
          navigate={navigate}
        />
      )}

    </div>
  );
}

// =========================================================
// CART DRAWER
// =========================================================

function CartDrawer({
  cart,
  closeDrawer,
  reloadCart,
  navigate,
}) {
  const [
    drawerCart,
    setDrawerCart,
  ] = useState(cart || []);

  // =======================================================
  // SYNC CART
  // =======================================================

  useEffect(() => {
    setDrawerCart(cart || []);
  }, [cart]);

  // =======================================================
  // CART UPDATED EVENT
  // =======================================================

  useEffect(() => {
    const refresh = () => {
      try {
        const saved =
          JSON.parse(
            localStorage.getItem(
              "cart"
            ) || "[]"
          );

        setDrawerCart(
          Array.isArray(saved)
            ? saved
            : []
        );
      } catch {
        setDrawerCart([]);
      }
    };

    window.addEventListener(
      "cartUpdated",
      refresh
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        refresh
      );
    };
  }, []);

  // =======================================================
  // UPDATE QUANTITY
  // =======================================================

  const updateQuantity = (
    id,
    change
  ) => {
    const updated =
      drawerCart
        .map((item) => {

          if (
            item.id !== id
          ) {
            return item;
          }

          const quantity =
            Number(
              item.quantity || 1
            ) + change;

          if (
            quantity <= 0
          ) {
            return null;
          }

          return {
            ...item,
            quantity,
          };
        })
        .filter(Boolean);

    setDrawerCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );

    reloadCart?.();

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =======================================================
  // REMOVE ITEM
  // =======================================================

  const removeItem = (
    id
  ) => {
    const updated =
      drawerCart.filter(
        (item) =>
          item.id !== id
      );

    setDrawerCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );

    reloadCart?.();

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  // =======================================================
  // SUBTOTAL
  // =======================================================

  const subtotal =
    drawerCart.reduce(
      (sum, item) =>
        sum +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 1
          ),
      0
    );

  // =======================================================
  // DELIVERY
  // =======================================================

  const deliveryCharge =
    subtotal >= 499 ||
    subtotal === 0
      ? 0
      : 40;

  // =======================================================
  // HANDLING
  // =======================================================

  const handlingCharge =
    drawerCart.length > 0
      ? 5
      : 0;

  // =======================================================
  // DISCOUNT
  // =======================================================

  const discount =
    subtotal >= 999
      ? Math.round(
          subtotal * 0.05
        )
      : 0;

  // =======================================================
  // TAX
  // =======================================================

  const taxableAmount =
    subtotal -
    discount +
    handlingCharge;

  const tax =
    Math.round(
      taxableAmount * 0.05
    );

  // =======================================================
  // GRAND TOTAL
  // =======================================================

  const grandTotal =
    subtotal -
    discount +
    deliveryCharge +
    handlingCharge +
    tax;

  // =======================================================
  // TOTAL ITEM COUNT
  // =======================================================

  const totalItems =
    drawerCart.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 1
        ),
      0
    );

  // =======================================================
  // DRAWER
  // =======================================================

  return (
    <>
      {/* OVERLAY */}

      <div
        className="cart-drawer-overlay"
        onClick={closeDrawer}
      />

      {/* DRAWER */}

      <aside className="cart-drawer">

        {/* HEADER */}

        <div className="cart-drawer-header">

          <div>

            <h2>
              🛒 Your Cart
            </h2>

            <span>
              {totalItems} items
            </span>

          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="cart-drawer-close"
            aria-label="Close cart"
          >
            ×
          </button>

        </div>

        {/* EMPTY CART */}

        {drawerCart.length ===
        0 ? (

          <div className="cart-drawer-empty">

            <div>
              🛒
            </div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add products to
              continue shopping.
            </p>

            <button
              type="button"
              onClick={
                closeDrawer
              }
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <>
            {/* =========================================
                CART ITEMS
            ========================================= */}

            <div className="cart-drawer-items">

              {drawerCart.map(
                (item) => (

                  <div
                    className="cart-drawer-item"
                    key={item.id}
                  >

                    {/* IMAGE */}

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                      onError={(
                        event
                      ) => {
                        event.currentTarget.style.objectFit =
                          "contain";
                      }}
                    />

                    {/* PRODUCT INFO */}

                    <div className="cart-drawer-item-info">

                      <h3>
                        {
                          item.name
                        }
                      </h3>

                      <RatingStars
                        rating={
                          item.rating
                        }
                      />

                      <p className="drawer-unit">
                        {
                          item.unit ||
                          "1 Piece"
                        }
                      </p>

                      <strong>
                        ₹
                        {Number(
                          item.price ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <button
                        type="button"
                        className="drawer-remove"
                        onClick={() =>
                          removeItem(
                            item.id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                    {/* QUANTITY */}

                    <div className="drawer-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            -1
                          )
                        }
                      >
                        −
                      </button>

                      <span>
                        {
                          item.quantity
                        }
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            1
                          )
                        }
                      >
                        +
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

            {/* =========================================
                CART SUMMARY
            ========================================= */}

            <div className="cart-drawer-summary">

              <div>
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Delivery
                </span>

                <strong>
                  {deliveryCharge ===
                  0
                    ? "FREE"
                    : `₹${deliveryCharge}`}
                </strong>
              </div>

              <div>
                <span>
                  Handling
                </span>

                <strong>
                  ₹
                  {handlingCharge}
                </strong>
              </div>

              {discount > 0 && (
                <div className="drawer-discount">

                  <span>
                    Discount
                  </span>

                  <strong>
                    -₹
                    {discount.toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>
              )}

              <div>
                <span>
                  GST / Tax
                </span>

                <strong>
                  ₹
                  {tax.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              {/* GRAND TOTAL */}

              <div className="drawer-grand-total">

                <span>
                  Grand Total
                </span>

                <strong>
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              {/* CHECKOUT */}

              <button
                type="button"
                className="drawer-checkout-btn"
                onClick={() => {

                  closeDrawer();

                  navigate(
                    "/checkout",
                    {
                      state: {
                        cart:
                          drawerCart,
                      },
                    }
                  );

                }}
              >
                Proceed to Checkout →
              </button>

            </div>
          </>
        )}

      </aside>
    </>
  );
}

export default CustomerView;