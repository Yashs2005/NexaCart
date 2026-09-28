import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RatingStars({ rating }) {
  const value =
    typeof rating === "number"
      ? rating
      : rating?.rate ??
        rating?.value ??
        rating?.rating ??
        null;

  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return (
      <span className="cart-no-rating">
        No rating
      </span>
    );
  }

  const numericRating = Number(value);

  return (
    <div className="cart-rating">
      <div className="cart-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          if (numericRating >= star) {
            return (
              <span
                key={star}
                className="cart-star-full"
              >
                ★
              </span>
            );
          }

          if (
            numericRating >=
            star - 0.5
          ) {
            return (
              <span
                key={star}
                className="cart-star-half"
              >
                <span className="cart-star-half-base">
                  ★
                </span>

                <span className="cart-star-half-fill">
                  ★
                </span>
              </span>
            );
          }

          return (
            <span
              key={star}
              className="cart-star-empty"
            >
              ★
            </span>
          );
        })}
      </div>

      <span className="cart-rating-number">
        {numericRating.toFixed(1)}
      </span>
    </div>
  );
}

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      try {
        const saved =
          JSON.parse(
            localStorage.getItem(
              "cart"
            ) || "[]"
          );

        setCart(
          Array.isArray(saved)
            ? saved
            : []
        );
      } catch {
        setCart([]);
      }
    };

    loadCart();

    window.addEventListener(
      "cartUpdated",
      loadCart
    );

    window.addEventListener(
      "storage",
      loadCart
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        loadCart
      );

      window.removeEventListener(
        "storage",
        loadCart
      );
    };
  }, []);

  const updateQuantity = (
    id,
    change
  ) => {
    const updated = cart
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

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const removeItem = (id) => {
    const updated =
      cart.filter(
        (item) =>
          item.id !== id
      );

    setCart(updated);

    localStorage.setItem(
      "cart",
      JSON.stringify(updated)
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.quantity || 1),
    0
  );

  const delivery =
    subtotal >= 499 || subtotal === 0
      ? 0
      : 40;

  const handling =
    cart.length > 0 ? 5 : 0;

  const discount =
    subtotal >= 999
      ? Math.round(
          subtotal * 0.05
        )
      : 0;

  const taxableAmount =
    subtotal -
    discount +
    handling;

  const tax = Math.round(
    taxableAmount * 0.05
  );

  const grandTotal =
    subtotal -
    discount +
    delivery +
    handling +
    tax;

  return (
    <div className="cart-page">

      <div className="cart-page-header">
        <button
          type="button"
          onClick={() =>
            navigate(
              "/customer-view"
            )
          }
        >
          ← Continue Shopping
        </button>

        <h1>🛒 Your Cart</h1>
      </div>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products to
            your cart to continue.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate(
                "/customer-view"
              )
            }
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-layout">

          <div className="cart-items-panel">

            <div className="cart-items-title">
              <h2>
                Cart Items
              </h2>

              <span>
                {cart.reduce(
                  (sum, item) =>
                    sum +
                    Number(
                      item.quantity || 1
                    ),
                  0
                )}{" "}
                items
              </span>
            </div>

            {cart.map((item) => (
              <div
                className="cart-compact-item"
                key={item.id}
              >
                <img
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-compact-details">
                  <h3>
                    {item.name}
                  </h3>

                  <RatingStars
                    rating={
                      item.rating
                    }
                  />

                  <p>
                    {item.category ||
                      "General"}
                  </p>

                  <strong>
                    ₹
                    {Number(
                      item.price || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>

                <div className="cart-compact-quantity">
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
                    {item.quantity}
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

                <div className="cart-compact-total">
                  <strong>
                    ₹
                    {(
                      Number(
                        item.price || 0
                      ) *
                      Number(
                        item.quantity ||
                          1
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                  <button
                    type="button"
                    onClick={() =>
                      removeItem(
                        item.id
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="cart-order-summary">

            <h2>
              Order Summary
            </h2>

            <div>
              <span>Subtotal</span>
              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div>
              <span>Delivery</span>
              <strong>
                {delivery === 0
                  ? "FREE"
                  : `₹${delivery}`}
              </strong>
            </div>

            <div>
              <span>Handling</span>
              <strong>
                ₹{handling}
              </strong>
            </div>

            {discount > 0 && (
              <div>
                <span>Discount</span>
                <strong>
                  -₹
                  {discount.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>
            )}

            <div>
              <span>GST / Tax</span>
              <strong>
                ₹
                {tax.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="cart-summary-grand">
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
              className="cart-checkout-main-btn"
              onClick={() =>
                navigate(
                  "/checkout",
                  {
                    state: {
                      cart,
                    },
                  }
                )
              }
            >
              Proceed to Checkout →
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Cart;
