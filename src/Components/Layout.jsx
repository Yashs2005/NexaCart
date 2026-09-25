import {
  Link,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";

function Layout({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // =========================
  // CUSTOMER VIEW CHECK
  // =========================
  const isCustomerView =
    location.pathname === "/customer-view";

  // =========================
  // SEARCH
  // =========================
  const [search, setSearch] = useState("");

  // =========================
  // CLEAR SEARCH WHEN
  // LEAVING CUSTOMER VIEW
  // =========================
  useEffect(() => {
    if (!isCustomerView) {
      setSearch("");
    }
  }, [isCustomerView]);

  // =========================
  // NOTIFICATIONS
  // =========================
  const [showNotifications, setShowNotifications] =
    useState(false);

  const [notifications] = useState([
    "📦 New product added",
    "🛒 New order received",
    "👤 New customer registered",
  ]);

  // =========================
  // CART
  // =========================
  const [cartItems, setCartItems] = useState([]);

  const loadCart = () => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem("cart")
      );

      setCartItems(
        Array.isArray(savedCart)
          ? savedCart
          : []
      );
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    loadCart();
  }, [location.pathname]);

  // =========================
  // KEEP CART COUNT UPDATED
  // =========================
  useEffect(() => {
    const handleStorageChange = () => {
      loadCart();
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    const interval = setInterval(
      loadCart,
      500
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      clearInterval(interval);
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    navigate("/login");
  };

  // =========================
  // CART COUNT
  // =========================
  const cartCount = cartItems.reduce(
    (total, item) =>
      total +
      Number(item.quantity || 1),
    0
  );

  // =========================
  // NAVIGATION
  // =========================
  const navItems = [
    {
      name: "Dashboard",
      icon: "🏠",
      path: "/",
    },
    {
      name: "Products",
      icon: "📦",
      path: "/products",
    },
    {
      name: "Orders",
      icon: "📋",
      path: "/orders",
    },
    {
      name: "Customers",
      icon: "👥",
      path: "/customers",
    },
    {
      name: "Customer View",
      icon: "🛍️",
      path: "/customer-view",
    },
    {
      name: "Analytics",
      icon: "📊",
      path: "/analytics",
    },
    {
      name: "Settings",
      icon: "⚙️",
      path: "/settings",
    },
  ];

  return (
    <div
      className={
        darkMode
          ? "app dark"
          : "app"
      }
    >

      {/* =====================================================
          PERMANENT TOP HEADER
      ===================================================== */}

      <header className="top-header">

        {/* =================================================
            FIRST ROW
        ================================================= */}

        <div className="header-main-row">

          {/* =========================
              NEXACART BRAND
          ========================= */}

          <div
            className="nexacart-brand"
            onClick={() =>
              navigate("/")
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (
                e.key === "Enter"
              ) {
                navigate("/");
              }
            }}
          >
            <span>
              NexaCart
            </span>
          </div>

          {/* =========================
              SEARCH BAR

              IMPORTANT:
              Search bar is visible
              ONLY on Customer View.
          ========================= */}

          {isCustomerView && (
            <div className="header-search">

              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />

                <path d="m20 20-4-4" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder='Search for "products"'
                aria-label="Search products"
              />

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() =>
                    setSearch("")
                  }
                  aria-label="Clear search"
                  title="Clear search"
                >
                  ×
                </button>
              )}

            </div>
          )}

          {/* =========================
              RIGHT HEADER ICONS
          ========================= */}

          <div className="header-actions">

            {/* =========================
                DARK MODE
            ========================= */}

            <button
              type="button"
              onClick={() =>
                setDarkMode(
                  !darkMode
                )
              }
              title={
                darkMode
                  ? "Light Mode"
                  : "Dark Mode"
              }
              aria-label={
                darkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              className="header-icon-btn"
            >
              {darkMode ? (
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                  />

                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8z" />
                </svg>
              )}
            </button>

            {/* =========================
                NOTIFICATION
            ========================= */}

            <div className="notification-wrapper">

              <button
                type="button"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                title="Notifications"
                aria-label="Notifications"
                className="header-icon-btn"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M10 21h4" />
                </svg>

                {notifications.length >
                  0 && (
                  <span className="header-badge">
                    {notifications.length}
                  </span>
                )}

              </button>

              {/* NOTIFICATION DROPDOWN */}

              {showNotifications && (
                <div className="notification-dropdown">

                  <h4>
                    Notifications
                  </h4>

                  {notifications.length >
                  0 ? (
                    notifications.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="notification-item"
                          key={index}
                        >
                          {item}
                        </div>
                      )
                    )
                  ) : (
                    <div className="notification-empty">
                      No new notifications
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* =========================
                LOGIN / PROFILE
            ========================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              title="Login"
              aria-label="Login"
              className="header-icon-btn"
            >
              <svg
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                />

                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {/* =========================
                CART
            ========================= */}

            <button
              type="button"
              onClick={() =>
                navigate("/cart")
              }
              title="Cart"
              aria-label={`Cart with ${cartCount} items`}
              className="header-icon-btn cart-icon-btn"
            >
              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle
                  cx="9"
                  cy="20"
                  r="1"
                />

                <circle
                  cx="19"
                  cy="20"
                  r="1"
                />

                <path d="M3 4h2l2.5 11h11L21 7H6" />
              </svg>

              {cartCount > 0 && (
                <span className="header-badge">
                  {cartCount}
                </span>
              )}

            </button>

            {/* =========================
                LOGOUT
            ========================= */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              title="Logout"
              aria-label="Logout"
              className="header-icon-btn"
            >
              <svg
                width="29"
                height="29"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M13 5H6.5A2.5 2.5 0 0 0 4 7.5v9A2.5 2.5 0 0 0 6.5 19H13" />
                <path d="M13 5v14" />
                <path d="M10 12h10" />
                <path d="m16 7 5 5-5 5" />
              </svg>
            </button>

          </div>
        </div>

        {/* =================================================
            SECOND ROW - HORIZONTAL NAVIGATION
        ================================================= */}

        <nav className="top-navigation">

          {navItems.map(
            (item) => {

              const isActive =
                location.pathname ===
                  item.path ||
                (
                  item.path !== "/" &&
                  location.pathname.startsWith(
                    item.path + "/"
                  )
                );

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={
                    isActive
                      ? "top-nav-link active"
                      : "top-nav-link"
                  }
                >
                  <span className="top-nav-icon">
                    {item.icon}
                  </span>

                  <span>
                    {item.name}
                  </span>
                </Link>
              );
            }
          )}

        </nav>

      </header>

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main className="content">
        <Outlet
          context={{
            darkMode,
            search,
            cartItems,
            cartCount,
            reloadCart:
              loadCart,
          }}
        />
      </main>

    </div>
  );
}

export default Layout;