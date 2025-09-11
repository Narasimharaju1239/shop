import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import API from "../utils/api";

const Landing = () => {
  const { currentTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    API.get("/products").then((res) => {
      setProducts(res.data);
      setFiltered(res.data);
    });
  }, []);

  useEffect(() => {
    if (!search) {
      setFiltered(products);
    } else {
      setFiltered(
        products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, products]);

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />
      <div
        style={{
          minHeight: "100vh",
          background: "#fafafa",
          color: currentTheme.text,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: "Segoe UI, Roboto, Arial, sans-serif",
          paddingBottom: "80px", // Added extra bottom padding for footer
        }}
      >
        {/* Hero Section */}
        <div
          style={{
            width: "100%",
            background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/aqua-bg.jpg') center/cover no-repeat`,
            padding: "50px 20px",
            textAlign: "center",
            boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
          }}
        >
          <h1
            style={{
              fontSize: "54px",
              fontWeight: "900",
              color: "#fff",
              marginBottom: "16px",
              letterSpacing: "2px",
              textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            Sri Santhoshimatha Aqua Bazar
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#eaeaea",
              marginBottom: "30px",
              fontWeight: "500",
            }}
          >
            Your trusted marketplace for Aqua Feeds & Fish Medicines
          </p>
        </div>

        {/* Quick Navigation */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            margin: "40px 0",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/customer/products"
            style={{
              padding: "14px 32px",
              background: currentTheme.button,
              color: currentTheme.buttonText,
              fontSize: "18px",
              fontWeight: "700",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            }}
          >
            🛒 Browse Products
          </Link>
          <Link
            to="/customer/companies"
            style={{
              padding: "14px 32px",
              background: "#fff",
              color: currentTheme.primary,
              fontSize: "18px",
              fontWeight: "700",
              border: `2px solid ${currentTheme.primary}`,
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            }}
          >
            🏢 View Companies
          </Link>
          <Link
            to="/customer/cart"
            style={{
              padding: "14px 32px",
              background: "#28a745",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "700",
              borderRadius: "12px",
              textDecoration: "none",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            }}
          >
            🛍️ View Cart
          </Link>
        </div>

        {/* Featured Products */}
        <div
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "28px",
              color: currentTheme.primary,
              textAlign: "center",
            }}
          >
            ⭐ Featured Products
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "24px",
            }}
          >
            {filtered.slice(0, 8).map((product) => (
              <div
                key={product._id}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  padding: "18px",
                  textAlign: "center",
                  transition: "transform 0.3s, boxShadow 0.3s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-6px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <img
                  src={product.images?.[0] || "/default-product.png"}
                  alt={product.name}
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginBottom: "12px",
                  }}
                />
                <div
                  style={{
                    fontWeight: "700",
                    fontSize: "18px",
                    marginBottom: "6px",
                  }}
                >
                  {product.name}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    marginBottom: "6px",
                    color: "#666",
                  }}
                >
                  {product.companyName || ""}
                </div>
                <div
                  style={{
                    fontWeight: "900",
                    fontSize: "24px",
                    color: currentTheme.primary,
                    marginBottom: "10px",
                    background: "#fff",
                    padding: "6px 0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                    letterSpacing: "1px",
                  }}
                >
                  ₹{product.price?.toLocaleString("en-IN") || "-"}
                </div>
                <Link
                  to={`/customer/products/${product._id}`}
                  style={{
                    padding: "10px 20px",
                    background: currentTheme.button,
                    color: currentTheme.buttonText,
                    fontWeight: "600",
                    borderRadius: "8px",
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Landing;
