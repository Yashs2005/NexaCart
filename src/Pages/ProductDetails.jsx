import { Link, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productsData } from "../data";

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
// PRODUCT DETAILS
// =========================================================

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // =======================================================
  // LOAD PRODUCT
  // =======================================================

  useEffect(() => {
    try {
      const foundProduct = productsData.find(
        (item) => Number(item.id) === Number(id)
      );

      setProduct(foundProduct || null);
      setQuantity(1);
    } catch (error) {
      console.error("Product loading error:", error);
      setProduct(null);
    }
  }, [id]);

  // =======================================================
  // PRODUCT NOT FOUND
  // =======================================================

  if (!product) {
    return (
      <div className="product-details-not-found">
        <h2>Product not found</h2>

        <Link to="/customer-view">
          <button type="button">
            ⬅ Back to Customer View
          </button>
        </Link>
      </div>
    );
  }

  // =======================================================
  // RATING
  // =======================================================

  let rating = product.rating;

  if (typeof rating === "object" && rating !== null) {
    rating =
      rating.rate ??
      rating.value ??
      rating.rating;
  }

  if (
    rating === undefined ||
    rating === null
  ) {
    rating =
      product.rate ??
      product.ratingValue ??
      product.reviewRating;
  }

  rating =
    rating !== undefined &&
    rating !== null &&
    !isNaN(Number(rating))
      ? Number(rating)
      : null;

  // =======================================================
  // RATING STARS
  // =======================================================

  function RatingStars({ rating }) {
    if (!Number.isFinite(Number(rating))) {
      return (
        <span className="product-detail-no-rating">
          No rating
        </span>
      );
    }

    const numeric = Number(rating);

    return (
      <div className="product-detail-rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          // FULL STAR
          if (numeric >= star) {
            return (
              <span
                key={star}
                className="product-detail-star full"
              >
                ★
              </span>
            );
          }

          // HALF STAR
          if (numeric >= star - 0.5) {
            return (
              <span
                key={star}
                className="product-detail-star half"
              >
                <span className="product-detail-star-empty">
                  ★
                </span>

                <span className="product-detail-star-filled">
                  ★
                </span>
              </span>
            );
          }

          // EMPTY STAR
          return (
            <span
              key={star}
              className="product-detail-star empty"
            >
              ★
            </span>
          );
        })}
      </div>
    );
  }

  // =======================================================
  // ADD TO CART
  // =======================================================

  const handleAddToCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      const cart = Array.isArray(savedCart)
        ? savedCart
        : [];

      const existingProduct = cart.find(
        (item) =>
          Number(item.id) === Number(product.id)
      );

      let updatedCart;

      if (existingProduct) {
        updatedCart = cart.map((item) =>
          Number(item.id) === Number(product.id)
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 1) +
                  quantity,
              }
            : item
        );
      } else {
        updatedCart = [
          ...cart,
          {
            ...product,
            quantity,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      alert("✅ Product added to Cart");

      navigate("/cart");
    } catch (error) {
      console.error(
        "Cart update failed:",
        error
      );
    }
  };

  // =======================================================
  // BUY NOW
  // =======================================================

  const handleBuyNow = () => {
    if (stock <= 0) {
      return;
    }

    const buyNowCart = [
      {
        ...product,
        quantity,
      },
    ];

    localStorage.setItem(
      "cart",
      JSON.stringify(buyNowCart)
    );

    navigate("/checkout", {
      state: {
        cart: buyNowCart,
      },
    });
  };

  // =======================================================
  // SAFE VALUES
  // =======================================================

  const price = Number(product.price || 0);

  const stock = Number(product.stock || 0);

  const image = getProductImage(product);

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="product-details-page">

      {/* ===================================================
          LEFT IMAGE
      =================================================== */}

      <div className="product-details-image-card">

        <div className="product-details-image-wrap">

          {image ? (
            <img
              src={image}
              alt={product.name}
              className="product-details-image"
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";

                event.currentTarget.parentElement?.classList.add(
                  "image-error"
                );
              }}
            />
          ) : (
            <div className="product-details-no-image">
              <span className="product-details-no-image-icon">
                🛍️
              </span>

              <strong>
                {product.name}
              </strong>

              <small>
                Image not available
              </small>
            </div>
          )}

        </div>

      </div>

      {/* ===================================================
          RIGHT DETAILS
      =================================================== */}

      <div className="product-details-info">

        {/* PRODUCT NAME */}

        <h1 className="product-details-title">
          {product.name}
        </h1>

        {/* RATING */}

        <div className="product-details-rating-row">

          {rating !== null ? (
            <>
              <RatingStars
                rating={rating}
              />

              <span className="product-details-rating-number">
                {rating.toFixed(1)}
              </span>
            </>
          ) : (
            <span className="product-detail-no-rating">
              No rating
            </span>
          )}

        </div>

        <hr />

        {/* PRICE */}

        <h2 className="product-details-price">
          ₹{price.toLocaleString("en-IN")}
        </h2>

        {/* UNIT */}

        <p className="product-details-unit">
          📦 Price: ₹
          {price.toLocaleString("en-IN")} /{" "}
          {product.unit || "1 Piece"}
        </p>

        <p className="product-details-tax">
          Inclusive of all taxes
        </p>

        {/* STOCK */}

        <p
          className={
            stock > 0
              ? "product-details-stock in-stock"
              : "product-details-stock out-stock"
          }
        >
          {stock > 0
            ? `✅ In Stock (${stock} available)`
            : "❌ Out of Stock"}
        </p>

        <hr />

        {/* QUANTITY */}

        <h3 className="product-details-quantity-title">
          Quantity
        </h3>

        <div className="product-details-quantity">

          <button
            type="button"
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
            disabled={quantity <= 1}
          >
            ➖
          </button>

          <span>
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => {
              if (quantity < stock) {
                setQuantity(quantity + 1);
              }
            }}
            disabled={
              stock <= 0 ||
              quantity >= stock
            }
          >
            ➕
          </button>

        </div>

        {/* TOTAL */}

        <h2 className="product-details-total">
          Total: ₹
          {(price * quantity).toLocaleString(
            "en-IN"
          )}
        </h2>

        <p className="product-details-total-unit">
          {quantity} ×{" "}
          {product.unit || "1 Piece"}
        </p>

        {/* ACTION BUTTONS */}

        <div className="product-details-actions">

          <button
            type="button"
            className="product-details-cart-btn"
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            🛒 Add to Cart
          </button>

          <button
            type="button"
            className="product-details-buy-btn"
            onClick={handleBuyNow}
            disabled={stock <= 0}
          >
            ⚡ Buy Now
          </button>

        </div>

        {/* BACK */}

        <Link
          to="/customer-view"
          className="product-details-back-link"
        >
          ⬅ Back to Customer View
        </Link>

      </div>
    </div>
  );
}

export default ProductDetails;