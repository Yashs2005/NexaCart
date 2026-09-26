import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Analytics() {
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = () => {
      try {
        const savedOrders =
          JSON.parse(localStorage.getItem("orders")) || [];

        setOrders(
          Array.isArray(savedOrders)
            ? savedOrders
            : []
        );
      } catch (error) {
        console.error("Orders load failed:", error);
        setOrders([]);
      }
    };

    loadOrders();

    window.addEventListener("storage", loadOrders);

    return () => {
      window.removeEventListener("storage", loadOrders);
    };
  }, []);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // =========================================================
  // OLD DEMO PRODUCTS
  // =========================================================

  const OLD_DEMO_PRODUCTS = [
    "Essence Mascara Lash Princess",
    "Eyeshadow Palette with Mirror",
    "Gucci Bloom Eau de",
    "Red Lipstick",
  ];

  const normalizeProductName = (name) =>
    String(name || "")
      .trim()
      .toLowerCase();

  // =========================================================
  // VALID ORDERS
  //
  // Old demo products are removed.
  // Glass Cleaner is NOT removed.
  // Any newly purchased product will automatically remain.
  // =========================================================

  const validOrders = orders.filter((order) => {
    const productName = normalizeProductName(
      order.product
    );

    if (!productName) {
      return false;
    }

    return !OLD_DEMO_PRODUCTS.some(
      (oldProduct) =>
        normalizeProductName(oldProduct) === productName
    );
  });

  // -----------------------------
  // Monthly Sales Data
  // -----------------------------

  const sales = months.map((month, index) => {
    const monthOrders = validOrders.filter((order) => {
      if (!order.orderDate) return false;

      const date = new Date(order.orderDate);

      return date.getMonth() === index;
    });

    const revenue = monthOrders.reduce(
      (sum, order) =>
        sum + Number(order.amount || 0),
      0
    );

    return {
      month,
      revenue,
      orders: monthOrders.length,
    };
  });

  // -----------------------------
  // Filter Orders
  // -----------------------------

  const filteredOrders =
    selectedMonth === "All"
      ? validOrders
      : validOrders.filter((order) => {
          if (!order.orderDate) return false;

          const date = new Date(order.orderDate);

          return (
            date.getMonth() ===
            months.indexOf(selectedMonth)
          );
        });

  // -----------------------------
  // Total Sales
  // -----------------------------

  const totalSales = filteredOrders.reduce(
    (sum, order) =>
      sum + Number(order.amount || 0),
    0
  );

  // -----------------------------
  // Total Orders
  // -----------------------------

  const totalOrders = filteredOrders.length;

  // -----------------------------
  // Average Order Value
  // -----------------------------

  const averageOrderValue =
    totalOrders > 0
      ? Math.round(totalSales / totalOrders)
      : 0;

  // -----------------------------
  // Product Sales
  // -----------------------------

  const productCounts = {};

  filteredOrders.forEach((order) => {
    const productName = String(
      order.product || ""
    ).trim();

    if (!productName) {
      return;
    }

    productCounts[productName] =
      (productCounts[productName] || 0) + 1;
  });

  // -----------------------------
  // Top Product
  // -----------------------------

  const topProduct =
    Object.keys(productCounts).length > 0
      ? Object.keys(productCounts).reduce((a, b) =>
          productCounts[a] > productCounts[b]
            ? a
            : b
        )
      : "No orders";

  // -----------------------------
  // Product Chart Data
  // -----------------------------

  const productData = Object.keys(productCounts).map(
    (product) => ({
      name: product,
      value: productCounts[product],
    })
  );

  // -----------------------------
  // Current Month Revenue
  // -----------------------------

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const currentMonthRevenue = validOrders
    .filter((order) => {
      if (!order.orderDate) return false;

      const date = new Date(order.orderDate);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce(
      (sum, order) =>
        sum + Number(order.amount || 0),
      0
    );

  // -----------------------------
  // Chart Data
  // -----------------------------

  const filteredSales =
    selectedMonth === "All"
      ? sales
      : sales.filter(
          (item) =>
            item.month === selectedMonth
        );

  // -----------------------------
  // Chart Colors
  // -----------------------------

  const COLORS = [
    "#008060",
    "#36A2EB",
    "#FFCE56",
    "#FF6384",
    "#9966FF",
    "#FF9F40",
  ];

  // -----------------------------
  // Export CSV
  // -----------------------------

  const exportReport = () => {
    const csvRows = [
      ["Month", "Revenue", "Orders"],
      ...filteredSales.map((item) => [
        item.month,
        item.revenue,
        item.orders,
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download =
      selectedMonth === "All"
        ? "NexaCart-Sales-Report.csv"
        : `${selectedMonth}-Sales-Report.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <h1>📊 Analytics Dashboard</h1>

      <p>
        Sales, Orders and Product Performance Overview
      </p>

      {/* Month Selection */}

      <div
        style={{
          margin: "20px 0",
          background: "white",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <label
          style={{
            marginRight: "10px",
            fontWeight: "bold",
          }}
        >
          Select Month:
        </label>

        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
          style={{
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        >
          <option value="All">All Months</option>

          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Analytics Cards */}

      <div className="cards">
        <div className="card">
          <h3>💰 Total Sales</h3>

          <h2>
            ₹{totalSales.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>📅 Current Month Revenue</h3>

          <h2>
            ₹{currentMonthRevenue.toLocaleString()}
          </h2>
        </div>

        <div className="card">
          <h3>🛒 Total Orders</h3>

          <h2>{totalOrders}</h2>
        </div>

        <div className="card">
          <h3>🏆 Top Product</h3>

          <h2
            style={{
              fontSize: "18px",
            }}
          >
            {topProduct}
          </h2>
        </div>

        <div className="card">
          <h3>📦 Average Order Value</h3>

          <h2>
            ₹{averageOrderValue.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* No Orders Message */}

      {validOrders.length === 0 && (
        <div
          style={{
            background: "#fff3cd",
            padding: "20px",
            borderRadius: "10px",
            marginTop: "20px",
          }}
        >
          <h3>📊 No sales data available</h3>

          <p>
            Orders place hone ke baad Analytics
            automatically update ho jayega.
          </p>
        </div>
      )}

      {/* Revenue Chart */}

      <h2 style={{ marginTop: "40px" }}>
        💰 Revenue Chart
      </h2>

      <div
        style={{
          width: "100%",
          height: 350,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={filteredSales}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `₹${Number(value).toLocaleString()}`
              }
            />

            <Bar
              dataKey="revenue"
              fill="#008060"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Orders Trend */}

      <h2>📈 Orders Trend</h2>

      <div
        style={{
          width: "100%",
          height: 350,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={filteredSales}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="orders"
              stroke="#008060"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product Distribution */}

      <h2>🥇 Product Sales Distribution</h2>

      <div
        style={{
          width: "100%",
          height: 350,
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        {productData.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              paddingTop: "100px",
            }}
          >
            <h3>No product sales yet</h3>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={productData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {productData.map(
                  (entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Sales Report */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h2>📋 Monthly Sales Report</h2>

        <button
          onClick={exportReport}
          style={{
            background: "#008060",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          📥 Export Report
        </button>
      </div>

      {/* Sales Table */}

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
        }}
      >
        <thead>
          <tr>
            <th>Month</th>
            <th>Revenue</th>
            <th>Orders</th>
          </tr>
        </thead>

        <tbody>
          {filteredSales.map((item, index) => (
            <tr key={index}>
              <td>{item.month}</td>

              <td>
                ₹{item.revenue.toLocaleString()}
              </td>

              <td>{item.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =====================================================
          RECENT SALES
          ===================================================== */}

      {filteredOrders.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h2>🧾 Recent Sales</h2>

          <table
            border="1"
            cellPadding="10"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders
                .slice()
                .reverse()
                .slice(0, 10)
                .map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>

                    <td>{order.product}</td>

                    <td>
                      ₹
                      {Number(
                        order.amount || 0
                      ).toLocaleString()}
                    </td>

                    <td>{order.status}</td>

                    <td>
                      {order.orderDate
                        ? new Date(
                            order.orderDate
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Analytics;