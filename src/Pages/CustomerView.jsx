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
  "Fruits & Vegetables":
    fruitsVegetables,

  "Dairy & Breakfast":
    dairyBreakfast,

  "Snacks & Munchies":
    snacksMunchies,

  Beverages:
    beverages,

  "Staples & Essentials":
    staplesEssentials,

  "Bakery & Biscuits":
    bakeryBiscuits,

  "Personal Care":
    personalCare,

  "Home Care":
    homeCare,

  "Baby Care":
    babyCare,

  "Beauty & Cosmetics":
    beautyCosmetics,

  Electronics:
    electronics,

  Fashion:
    fashion,

  "Home & Kitchen":
    homeKitchen,

  "Toys & Games":
    toysGames,

  "Pets Care":
    petsCare,
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
//
// Product image only comes from product.image.
// Category image is NEVER used for product cards.
// =========================================================

function getProductImage(product) {
  if (
    product?.image &&
    typeof product.image ===
      "string" &&
    product.image.trim() !== ""
  ) {
    return product.image;
  }

  return "";
}

// =========================================================
// CUSTOMER VIEW
// =========================================================

function CustomerView({
  products = [],
}) {
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

  const [orders, setOrders] =
    useState([]);

  // null = category screen
  // category name = selected category
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(null);

  // =======================================================
  // NORMALIZED SEARCH
  // =======================================================

  const searchQuery =
    normalize(search);

  // =======================================================
  // SEARCH MODE
  // =======================================================

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
        Array.isArray(
          savedOrders
        )
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
  // CATEGORY PRODUCT DATA
  // =======================================================

  const categoryProductData =
    useMemo(() => {
      const result = {};

      categories.forEach(
        (category) => {
          result[category] =
            products.filter(
              (product) =>
                normalize(
                  product.category
                ) ===
                normalize(category)
            );
        }
      );

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
  //
  // IMPORTANT:
  //
  // Search is GLOBAL.
  //
  // selectedCategory does NOT restrict
  // the search results.
  //
  // Example:
  //
  // Fruits & Vegetables selected
  // Search "iPhone 16"
  //
  // iPhone 16 will still appear.
  // =======================================================

  const filteredProducts =
    useMemo(() => {

      // =================================================
      // GLOBAL SEARCH
      // =================================================

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

      // =================================================
      // NORMAL CATEGORY VIEW
      // =================================================

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

    } catch (error) {
      console.error(
        "Cart update failed:",
        error
      );
    }
  }

  // =======================================================
  // RATING STARS
  // =======================================================

  function RatingStars({
    rating,
  }) {
    const value =
      typeof rating ===
      "object"
        ? rating?.rate ??
          rating?.value ??
          rating?.rating
        : rating;

    const numeric =
      Number(value);

    if (
      !Number.isFinite(
        numeric
      )
    ) {
      return (
        <span className="no-rating">
          No rating
        </span>
      );
    }

    return (
      <div className="rating-box">

        <span className="stars">

          {[1, 2, 3, 4, 5].map(
            (star) => (
              <span
                key={star}
                className={
                  numeric >=
                  star
                    ? "star full"
                    : numeric >=
                      star - 0.5
                    ? "star half"
                    : "star empty"
                }
              >
                ★
              </span>
            )
          )}

        </span>

        <span className="rating-number">
          {numeric.toFixed(1)}
        </span>

      </div>
    );
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="customer-view-page">

      <main className="customer-main">

        {/* =================================================
            CATEGORY SCREEN

            Shows only when:
            - no category selected
            - no search active
        ================================================= */}

        {!selectedCategory &&
          !isSearching && (
            <section className="category-section">

              <div className="section-heading">
                <h2>
                  Shop by Category
                </h2>
              </div>

              <div className="category-grid">

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
                        className="category-card"
                        onClick={() =>
                          setSelectedCategory(
                            category
                          )
                        }
                      >

                        {/* CATEGORY IMAGE */}

                        <div className="category-image-wrap">

                          <img
                            src={image}
                            alt={
                              category
                            }
                            loading="lazy"
                          />

                        </div>

                        {/* CATEGORY NAME */}

                        <span className="category-name">
                          {category}
                        </span>

                        {/* PRODUCT COUNT */}

                        <span className="category-count">
                          {items.length}{" "}
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
            PRODUCTS / SEARCH SCREEN
        ================================================= */}

        {(selectedCategory ||
          isSearching) && (
          <section className="products-section">

            {/* PRODUCT SECTION HEADER */}

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

            {/* =================================================
                NO PRODUCTS
            ================================================= */}

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

              /* =================================================
                 PRODUCT GRID
              ================================================= */

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

                        {/* =====================================
                            PRODUCT IMAGE + NAME
                        ===================================== */}

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

                              <div
                                className="product-image-placeholder"
                                aria-label={`${product.name} image not available`}
                              >

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

                        {/* =====================================
                            RATING
                        ===================================== */}

                        <RatingStars
                          rating={
                            product.rating
                          }
                        />

                        {/* =====================================
                            PRICE
                        ===================================== */}

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

                        {/* =====================================
                            STOCK
                        ===================================== */}

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

                        {/* =====================================
                            VIEW PRODUCT
                        ===================================== */}

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

                        {/* =====================================
                            ADD TO CART
                        ===================================== */}

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

                        {/* =====================================
                            GO TO CART
                        ===================================== */}

                        {inCart && (
                          <button
                            type="button"
                            className="customer-go-cart-btn"
                            onClick={() =>
                              navigate(
                                "/cart"
                              )
                            }
                          >
                            🛒 Go to Cart
                          </button>
                        )}

                        {/* =====================================
                            BUY NOW
                        ===================================== */}

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

            {/* =================================================
                BACK TO CATEGORIES

                Only normal category view.
            ================================================= */}

            {selectedCategory &&
              !isSearching && (
                <div className="back-to-categories-wrapper">

                  <button
                    type="button"
                    className="back-category-btn"
                    onClick={() => {
                      setSelectedCategory(
                        null
                      );
                    }}
                  >
                    ← Back to Categories
                  </button>

                </div>
              )}

          </section>
        )}

        {/* =================================================
            MY ORDERS

            Hidden during global search.
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

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="nexa-footer">

        <div>
          © 2024 NexaCart.
          All rights reserved.
        </div>

        <div className="footer-links">

          <span>
            Privacy Policy
          </span>

          <span>
            |
          </span>

          <span>
            Terms & Conditions
          </span>

          <span>
            |
          </span>

          <span>
            Help & Support
          </span>

        </div>

      </footer>

    </div>
  );
}

export default CustomerView;