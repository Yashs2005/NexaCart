import {
  useNavigate,
  useOutletContext,
  useLocation,
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
  const location = useLocation();

  const outletContext =
    useOutletContext() || {};

  const {
    search = "",
    cartItems = [],
    reloadCart,
  } = outletContext;

  const [orders, setOrders] = useState([]);

  // =======================================================
  // IMPORTANT:
  //
  // ProductDetails sends the selected category back here.
  //
  // If coming from Product Details:
  // selectedCategory = previous category
  //
  // Otherwise:
  // selectedCategory = null
  // =======================================================

  const [selectedCategory, setSelectedCategory] =
    useState(
      location.state?.selectedCategory || null
    );

  // =======================================================
  // CART DRAWER
  // =======================================================

  const [showCartDrawer, setShowCartDrawer] =
    useState(false);

  // =======================================================
  // KEEP CATEGORY WHEN RETURNING FROM PRODUCT DETAILS
  // =======================================================

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(
        location.state.selectedCategory
      );

      // Clear navigation state after reading it.
      // This prevents stale category state on
      // future normal navigation.
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, [location.state]);

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
  // OPEN CART DRAWER EVENT
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
  // SEARCH REMAINS GLOBAL.
  // =======================================================

  const filteredProducts =
    useMemo(() => {
      // GLOBAL SEARCH
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

      // NO CATEGORY
      if (!selectedCategory) {
        return [];
      }

      // CATEGORY PRODUCTS
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
  // OPEN PRODUCT DETAILS
  //
  // IMPORTANT:
  // selectedCategory is passed to ProductDetails.
  //
  // So ProductDetails knows exactly which
  // 20-product category page to return to.
  // =======================================================

  function openProduct(productId) {
    navigate(
      `/product/${productId}`,
      {
        state: {
          fromCategory:
            selectedCategory,
        },
      }
    );
  }

  // =======================================================
  // ADD TO CART
  //
  // IMPORTANT:
  // Adding product does NOT automatically
  // open cart drawer.
  //
  // Cart opens only when user clicks Cart.
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

      <main className="customer-main">

        {/* =================================================
            CATEGORY SCREEN

            Only category cards here.
            Heading is only:
            Shop by Category
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

                        <div className="category-image-wrap">

                          <img
                            src={
                              categoryImages[
                                category
                              ]
                            }
                            alt={
                              category
                            }
                            loading="lazy"
                          />

                        </div>

                        <span className="category-name">
                          {category}
                        </span>

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
            PRODUCTS / SEARCH
        ================================================= */}

        {(selectedCategory ||
          isSearching) && (
          <section className="products-section">

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

                        {/* PRODUCT IMAGE + NAME */}

                        <div
                          className="product-link"
                          role="button"
                          tabIndex={0}
                          onClick={() =>
                            openProduct(
                              product.id
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

                              openProduct(
                                product.id
                              );
                            }

                          }}
                        >

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
                            openProduct(
                              product.id
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
                          onClick={() =>
                            openProduct(
                              product.id
                            )
                          }
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

                This appears AFTER all 20 products.
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

                      navigate(
                        "/customer-view",
                        {
                          replace: true,
                          state: {},
                        }
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
          © 2026 NexaCart.
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

      {/* ===================================================
          CART DRAWER
      =================================================== */}

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
  const [drawerCart, setDrawerCart] =
    useState(cart || []);

  useEffect(() => {
    setDrawerCart(cart || []);
  }, [cart]);

  useEffect(() => {
    const refresh = () => {
      try {
        const saved =
          JSON.parse(
            localStorage.getItem(
              "cart"
            ) || "[]"
          ) || [];

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
  // QUANTITY
  // =======================================================

  const updateQuantity = (
    id,
    change
  ) => {
    const updated =
      drawerCart
        .map((item) => {

          if (item.id !== id) {
            return item;
          }

          const quantity =
            Number(
              item.quantity || 1
            ) + change;

          if (quantity <= 0) {
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
  // REMOVE
  // =======================================================

  const removeItem = (id) => {
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
  // TOTALS
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

  const deliveryCharge =
    subtotal >= 499 ||
    subtotal === 0
      ? 0
      : 40;

  const handlingCharge =
    drawerCart.length > 0
      ? 5
      : 0;

  const discount =
    subtotal >= 999
      ? Math.round(
          subtotal * 0.05
        )
      : 0;

  const taxableAmount =
    subtotal -
    discount +
    handlingCharge;

  const tax =
    Math.round(
      taxableAmount * 0.05
    );

  const grandTotal =
    subtotal -
    discount +
    deliveryCharge +
    handlingCharge +
    tax;

  // =======================================================
  // DRAWER UI
  // =======================================================

  return (
    <>
      <div
        className="cart-drawer-overlay"
        onClick={closeDrawer}
      />

      <aside className="cart-drawer">

        <div className="cart-drawer-header">

          <div>

            <h2>
              🛒 Your Cart
            </h2>

            <span>
              {drawerCart.reduce(
                (sum, item) =>
                  sum +
                  Number(
                    item.quantity ||
                      1
                  ),
                0
              )}{" "}
              items
            </span>

          </div>

          <button
            type="button"
            onClick={closeDrawer}
            className="cart-drawer-close"
          >
            ×
          </button>

        </div>

        {drawerCart.length ===
        0 ? (

          <div className="cart-drawer-empty">

            <div>🛒</div>

            <h3>
              Your cart is empty
            </h3>

            <p>
              Add products to
              continue shopping.
            </p>

            <button
              type="button"
              onClick={closeDrawer}
            >
              Continue Shopping
            </button>

          </div>

        ) : (

          <>

            <div className="cart-drawer-items">

              {drawerCart.map(
                (item) => (

                  <div
                    className="cart-drawer-item"
                    key={item.id}
                  >

                    <img
                      src={
                        item.image
                      }
                      alt={
                        item.name
                      }
                    />

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
                        {item.unit ||
                          "1 Piece"}
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