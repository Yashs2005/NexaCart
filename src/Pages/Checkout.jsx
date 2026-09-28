import {
  useMemo,
  useState,
} from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";


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


function RatingStars({ rating }) {
  const numeric = getRatingValue(rating);

  if (numeric === null) {
    return (
      <span className="checkout-no-rating">
        No rating
      </span>
    );
  }

  return (
    <div className="checkout-rating">
      <span className="checkout-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={
              numeric >= star
                ? "checkout-star full"
                : numeric >= star - 0.5
                ? "checkout-star half"
                : "checkout-star empty"
            }
          >
            ★
          </span>
        ))}
      </span>

      <span className="checkout-rating-number">
        {numeric.toFixed(1)}
      </span>
    </div>
  );
}


function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const cart =
    location.state?.cart ||
    JSON.parse(
      localStorage.getItem("cart") || "[]"
    ) ||
    [];

  /*
    paymentStep:
    false = normal checkout
    true  = payment details
  */
  const [showPaymentDetails, setShowPaymentDetails] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState("UPI");

  const [upiApp, setUpiApp] =
    useState("Google Pay");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [upiId, setUpiId] = useState("");

  const [cardName, setCardName] =
    useState("");

  const [cardNumber, setCardNumber] =
    useState("");

  const [cardExpiry, setCardExpiry] =
    useState("");

  const [placeOrderError, setPlaceOrderError] =
    useState("");


  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(item.quantity || 1),
        0
      ),
    [cart]
  );


  const deliveryCharge =
    subtotal >= 499 || subtotal === 0
      ? 0
      : 40;


  const handlingCharge =
    cart.length > 0
      ? 5
      : 0;


  const discount =
    subtotal >= 999
      ? Math.round(subtotal * 0.05)
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


  /*
    STEP 1:
    Validate checkout details before
    showing payment details.
  */
  const handleContinueToPayment = () => {
    setPlaceOrderError("");

    if (cart.length === 0) {
      setPlaceOrderError(
        "Your cart is empty."
      );
      return;
    }

    if (!name.trim()) {
      setPlaceOrderError(
        "Please enter your name."
      );
      return;
    }

    if (
      phone.trim().length !== 10 ||
      !/^\d{10}$/.test(
        phone.trim()
      )
    ) {
      setPlaceOrderError(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!address.trim()) {
      setPlaceOrderError(
        "Please enter your delivery address."
      );
      return;
    }

    setShowPaymentDetails(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /*
    STEP 2:
    Place demo order after payment
    details are selected.
  */
  const handlePlaceOrder = () => {
    setPlaceOrderError("");

    if (paymentMethod === "UPI") {
      if (!upiApp) {
        setPlaceOrderError(
          "Please select a UPI app."
        );
        return;
      }

      if (!upiId.trim()) {
        setPlaceOrderError(
          "Please enter your UPI ID."
        );
        return;
      }
    }


    if (paymentMethod === "Card") {
      if (
        !cardName.trim() ||
        !cardNumber.trim() ||
        !cardExpiry.trim()
      ) {
        setPlaceOrderError(
          "Please complete the demo card details."
        );
        return;
      }
    }


    const oldOrders =
      JSON.parse(
        localStorage.getItem("orders") ||
          "[]"
      ) || [];


    const orderId = Date.now();


    const paymentLabel =
      paymentMethod === "UPI"
        ? `UPI - ${upiApp}`
        : paymentMethod === "Card"
        ? "Card"
        : "Cash on Delivery";


    const newOrders = cart.map(
      (item, index) => ({
        id: orderId + index,
        orderGroupId: orderId,

        customer:
          name.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        product:
          item.name,

        productImage:
          item.image || "",

        category:
          item.category || "General",

        amount:
          Number(item.price || 0) *
          Number(item.quantity || 1),

        quantity:
          Number(item.quantity || 1),

        unit:
          item.unit || "1 Piece",

        price:
          Number(item.price || 0),

        subtotal,
        deliveryCharge,
        handlingCharge,
        discount,
        tax,
        grandTotal,

        paymentMethod:
          paymentLabel,

        status:
          "Pending",

        orderDate:
          new Date().toISOString(),
      })
    );


    localStorage.setItem(
      "orders",
      JSON.stringify([
        ...oldOrders,
        ...newOrders,
      ])
    );


    localStorage.removeItem("cart");

    window.dispatchEvent(
      new Event("cartUpdated")
    );


    alert(
      "✅ Order Placed Successfully!"
    );

    navigate("/customer-view");
  };


  /*
    Empty cart
  */
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="checkout-empty-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products before proceeding
            to checkout.
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
      </div>
    );
  }


  return (
    <div className="checkout-page">

      {/* =================================================
          CHECKOUT HEADER
      ================================================= */}

      <div className="checkout-topbar">

        <button
          type="button"
          className="checkout-back-btn"
          onClick={() =>
            navigate(-1)
          }
        >
          ← Back
        </button>

        <div>
          <h1>
            {showPaymentDetails
              ? "Payment"
              : "Checkout"}
          </h1>

          <p>
            {showPaymentDetails
              ? "Choose your payment method"
              : "Review your order and delivery details"}
          </p>
        </div>

      </div>


      {/* =================================================
          STEP INDICATOR
      ================================================= */}

      <div className="checkout-steps">

        <div
          className={
            !showPaymentDetails
              ? "checkout-step active"
              : "checkout-step completed"
          }
        >
          <span>
            {!showPaymentDetails
              ? "1"
              : "✓"}
          </span>

          <div>
            <strong>
              Order Details
            </strong>

            <small>
              Products & delivery
            </small>
          </div>
        </div>


        <div className="checkout-step-line" />


        <div
          className={
            showPaymentDetails
              ? "checkout-step active"
              : "checkout-step"
          }
        >
          <span>2</span>

          <div>
            <strong>
              Payment
            </strong>

            <small>
              Select payment method
            </small>
          </div>
        </div>

      </div>


      {/* =================================================
          PAYMENT DETAILS STEP
          Only shown AFTER Pay button is clicked.
      ================================================= */}

      {showPaymentDetails ? (

        <section className="checkout-payment-page">

          <div className="checkout-payment-main">

            <div className="checkout-card payment-card">

              <div className="payment-card-heading">
                <div>
                  <h2>
                    💳 Payment Method
                  </h2>

                  <p>
                    Select how you want to
                    pay ₹
                    {grandTotal.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>


              {/* =========================================
                  PAYMENT METHOD TABS
              ========================================= */}

              <div className="real-payment-methods">

                <button
                  type="button"
                  className={
                    paymentMethod === "UPI"
                      ? "real-payment-option active"
                      : "real-payment-option"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "UPI"
                    );
                    setPlaceOrderError(
                      ""
                    );
                  }}
                >
                  <div className="payment-option-icon upi-icon">
                    UPI
                  </div>

                  <div>
                    <strong>
                      UPI
                    </strong>

                    <small>
                      Google Pay, PhonePe,
                      Paytm & more
                    </small>
                  </div>

                  <span className="payment-radio">
                    {paymentMethod ===
                    "UPI"
                      ? "✓"
                      : ""}
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    paymentMethod ===
                    "Card"
                      ? "real-payment-option active"
                      : "real-payment-option"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "Card"
                    );
                    setPlaceOrderError(
                      ""
                    );
                  }}
                >
                  <div className="payment-option-icon card-icon">
                    💳
                  </div>

                  <div>
                    <strong>
                      Credit / Debit Card
                    </strong>

                    <small>
                      Visa, Mastercard &
                      other cards
                    </small>
                  </div>

                  <span className="payment-radio">
                    {paymentMethod ===
                    "Card"
                      ? "✓"
                      : ""}
                  </span>
                </button>


                <button
                  type="button"
                  className={
                    paymentMethod ===
                    "COD"
                      ? "real-payment-option active"
                      : "real-payment-option"
                  }
                  onClick={() => {
                    setPaymentMethod(
                      "COD"
                    );
                    setPlaceOrderError(
                      ""
                    );
                  }}
                >
                  <div className="payment-option-icon cod-icon">
                    💵
                  </div>

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <small>
                      Pay when your order
                      arrives
                    </small>
                  </div>

                  <span className="payment-radio">
                    {paymentMethod ===
                    "COD"
                      ? "✓"
                      : ""}
                  </span>
                </button>

              </div>


              {/* =========================================
                  UPI DETAILS
              ========================================= */}

              {paymentMethod ===
                "UPI" && (
                <div className="upi-payment-box">

                  <h3>
                    Pay using UPI
                  </h3>

                  <p className="upi-subtitle">
                    Select your UPI app
                  </p>


                  <div className="upi-app-grid">

                    <button
                      type="button"
                      className={
                        upiApp ===
                        "Google Pay"
                          ? "upi-app active"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp(
                          "Google Pay"
                        )
                      }
                    >
                      <img
                        src="https://cdn.simpleicons.org/googlepay"
                        alt="Google Pay"
                      />

                      <span>
                        Google Pay
                      </span>

                      {upiApp ===
                        "Google Pay" && (
                        <b>✓</b>
                      )}
                    </button>


                    <button
                      type="button"
                      className={
                        upiApp ===
                        "PhonePe"
                          ? "upi-app active"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp(
                          "PhonePe"
                        )
                      }
                    >
                      <img
                        src="https://cdn.simpleicons.org/phonepe"
                        alt="PhonePe"
                      />

                      <span>
                        PhonePe
                      </span>

                      {upiApp ===
                        "PhonePe" && (
                        <b>✓</b>
                      )}
                    </button>


                    <button
                      type="button"
                      className={
                        upiApp ===
                        "Paytm"
                          ? "upi-app active"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp(
                          "Paytm"
                        )
                      }
                    >
                      <img
                        src="https://cdn.simpleicons.org/paytm"
                        alt="Paytm"
                      />

                      <span>
                        Paytm
                      </span>

                      {upiApp ===
                        "Paytm" && (
                        <b>✓</b>
                      )}
                    </button>


                    <button
                      type="button"
                      className={
                        upiApp ===
                        "Other UPI"
                          ? "upi-app active"
                          : "upi-app"
                      }
                      onClick={() =>
                        setUpiApp(
                          "Other UPI"
                        )
                      }
                    >
                      <div className="other-upi-logo">
                        U
                      </div>

                      <span>
                        Other UPI
                      </span>

                      {upiApp ===
                        "Other UPI" && (
                        <b>✓</b>
                      )}
                    </button>

                  </div>


                  <div className="upi-divider">
                    <span>
                      OR
                    </span>
                  </div>


                  <label className="payment-input-label">
                    UPI ID
                    <input
                      type="text"
                      value={upiId}
                      onChange={(event) =>
                        setUpiId(
                          event.target.value
                        )
                      }
                      placeholder="example@upi"
                    />
                  </label>


                  <p className="payment-demo-note">
                    Demo payment UI — no
                    real transaction or
                    payment will be processed.
                  </p>

                </div>
              )}


              {/* =========================================
                  CARD DETAILS
              ========================================= */}

              {paymentMethod ===
                "Card" && (
                <div className="card-payment-box">

                  <h3>
                    Card Details
                  </h3>

                  <div className="card-visual">

                    <div className="card-visual-top">
                      <span>
                        NexaCart
                      </span>

                      <span>
                        💳
                      </span>
                    </div>

                    <div className="card-number-preview">
                      •••• •••• •••• 1234
                    </div>

                    <div className="card-visual-bottom">
                      <span>
                        CARD HOLDER
                      </span>

                      <span>
                        MM / YY
                      </span>
                    </div>

                  </div>


                  <label className="payment-input-label">
                    Cardholder Name

                    <input
                      type="text"
                      value={cardName}
                      onChange={(event) =>
                        setCardName(
                          event.target.value
                        )
                      }
                      placeholder="Enter cardholder name"
                    />
                  </label>


                  <label className="payment-input-label">
                    Card Number

                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(event) =>
                        setCardNumber(
                          event.target.value
                        )
                      }
                      placeholder="Demo card number"
                      maxLength={19}
                    />
                  </label>


                  <label className="payment-input-label">
                    Expiry

                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(event) =>
                        setCardExpiry(
                          event.target.value
                        )
                      }
                      placeholder="MM / YY"
                      maxLength={5}
                    />
                  </label>


                  <p className="payment-demo-note">
                    Demo payment UI — do
                    not enter real card
                    details.
                  </p>

                </div>
              )}


              {/* =========================================
                  COD
              ========================================= */}

              {paymentMethod ===
                "COD" && (
                <div className="cod-payment-box">

                  <div className="cod-big-icon">
                    💵
                  </div>

                  <div>
                    <h3>
                      Cash on Delivery
                    </h3>

                    <p>
                      Pay ₹
                      {grandTotal.toLocaleString(
                        "en-IN"
                      )}{" "}
                      when your order
                      arrives.
                    </p>
                  </div>

                </div>
              )}


              {placeOrderError && (
                <div className="checkout-error">
                  {placeOrderError}
                </div>
              )}


              <div className="payment-actions">

                <button
                  type="button"
                  className="payment-back-btn"
                  onClick={() => {
                    setShowPaymentDetails(
                      false
                    );
                    setPlaceOrderError(
                      ""
                    );

                    window.scrollTo({
                      top: 0,
                      behavior:
                        "smooth",
                    });
                  }}
                >
                  ← Back to Checkout
                </button>


                <button
                  type="button"
                  className="final-pay-btn"
                  onClick={
                    handlePlaceOrder
                  }
                >
                  {paymentMethod ===
                  "COD"
                    ? "Place Order"
                    : `Pay ₹${grandTotal.toLocaleString(
                        "en-IN"
                      )}`}
                </button>

              </div>

            </div>

          </div>


          {/* PAYMENT SUMMARY */}

          <aside className="checkout-payment-summary">

            <h2>
              Order Summary
            </h2>

            <div className="payment-summary-items">

              {cart.map((item) => (
                <div
                  className="payment-summary-item"
                  key={item.id}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.quantity} × ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                </div>
              ))}

            </div>


            <div className="payment-summary-total">

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
                  ₹{handlingCharge}
                </strong>
              </div>


              {discount > 0 && (
                <div>
                  <span>
                    Discount
                  </span>

                  <strong className="checkout-discount">
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


              <div className="payment-grand-total">

                <span>
                  Total Amount
                </span>

                <strong>
                  ₹
                  {grandTotal.toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

            </div>

          </aside>

        </section>

      ) : (

        /* =================================================
           STEP 1 — NORMAL CHECKOUT
        ================================================= */

        <div className="checkout-grid">

          <main>

            {/* DELIVERY */}

            <section className="checkout-card">

              <h2>
                📍 Delivery Details
              </h2>

              <div className="checkout-form-grid">

                <label>
                  Full Name

                  <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your name"
                  />
                </label>


                <label>
                  Mobile Number

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                          .replace(
                            /\D/g,
                            ""
                          )
                          .slice(0, 10)
                      )
                    }
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </label>


                <label className="checkout-full-field">
                  Delivery Address

                  <textarea
                    value={address}
                    onChange={(event) =>
                      setAddress(
                        event.target.value
                      )
                    }
                    placeholder="House no., building, street, area..."
                    rows={4}
                  />
                </label>

              </div>

            </section>


            {/* PRODUCTS */}

            <section className="checkout-card">

              <div className="checkout-section-title">

                <div>
                  <h2>
                    🛍️ Your Products
                  </h2>

                  <p>
                    {cart.reduce(
                      (sum, item) =>
                        sum +
                        Number(
                          item.quantity ||
                            1
                        ),
                      0
                    )}{" "}
                    items in your cart
                  </p>
                </div>

              </div>


              <div className="checkout-products">

                {cart.map((item) => (
                  <div
                    className="checkout-product"
                    key={item.id}
                  >

                    <div className="checkout-product-image">
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    </div>


                    <div className="checkout-product-info">

                      <h3>
                        {item.name}
                      </h3>

                      <RatingStars
                        rating={
                          item.rating
                        }
                      />

                      <p>
                        {item.unit ||
                          "1 Piece"}
                      </p>

                      <span>
                        Qty:{" "}
                        {item.quantity ||
                          1}
                      </span>

                    </div>


                    <strong className="checkout-product-price">
                      ₹
                      {(
                        Number(
                          item.price ||
                            0
                        ) *
                        Number(
                          item.quantity ||
                            1
                        )
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </div>
                ))}

              </div>

            </section>

          </main>


          {/* BILL SUMMARY */}

          <aside className="checkout-order-summary">

            <h2>
              Bill Details
            </h2>


            <div className="checkout-bill-row">
              <span>
                Item Total
              </span>

              <strong>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>


            <div className="checkout-bill-row">
              <span>
                Delivery Fee
              </span>

              <strong>
                {deliveryCharge ===
                0
                  ? "FREE"
                  : `₹${deliveryCharge}`}
              </strong>
            </div>


            <div className="checkout-bill-row">
              <span>
                Handling Fee
              </span>

              <strong>
                ₹{handlingCharge}
              </strong>
            </div>


            {discount > 0 && (
              <div className="checkout-bill-row checkout-discount-row">
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


            <div className="checkout-bill-row">
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


            <div className="checkout-total-row">

              <span>
                To Pay
              </span>

              <strong>
                ₹
                {grandTotal.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>


            {placeOrderError && (
              <div className="checkout-error">
                {placeOrderError}
              </div>
            )}


            {/* IMPORTANT:
                Payment details are NOT shown here.
                Only Pay button is shown.
            */}

            <button
              type="button"
              className="checkout-pay-button"
              onClick={
                handleContinueToPayment
              }
            >
              <span>
                Continue to Payment
              </span>

              <strong>
                ₹
                {grandTotal.toLocaleString(
                  "en-IN"
                )}{" "}
                →
              </strong>
            </button>


            <div className="checkout-secure-note">
              🔒 Secure demo checkout
            </div>

          </aside>

        </div>
      )}

    </div>
  );
}


export default Checkout;