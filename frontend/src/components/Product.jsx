import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import UpdateProduct from "./UpdateProduct";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const Product = () => {
  const { id } = useParams();
  const { data, addToCart, removeFromCart, cart, refreshData } =
    useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useContext(AppContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProduct(response.data);

        if (response.data.imageName) {
          fetchImage(token);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async (token) => {
      const response = await axios.get(
        `http://localhost:8080/api/product/${id}/image`,
        {
          responseType: "blob",
        }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/api/deleteProduct/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      removeFromCart(id);
      console.log("Product deleted successfully");
      productedDeleted(product.name);
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };
  const notyf = new Notyf({
    duration: 1500,
    position: { x: "center", y: "top" },
  });

  const showAddToCartToast = (productName) => {
    notyf.success({
      message: `${productName} added to cart!`,
    });
  };
  const productedDeleted = (productName) => {
    notyf.success({
      message: `${productName} product is deleted!`,
    });
  };

  const handlAddToCart = () => {
    addToCart(product);
    showAddToCartToast(product.name);
  };
  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }
  return (
    <>
      <div className="containers" style={{ display: "flex" }}>
        <img
          className="left-column-img"
          src={imageUrl}
          alt={product.imageName}
          style={{ width: "50%", height: "auto" }}
        />

        <div className="right-column" style={{ width: "50%" }}>
          <div className="product-description">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "lighter" }}>
                {product.category}
              </span>
              <p className="release-date" style={{ marginBottom: "2rem" }}></p>
            </div>

            <h1
              style={{
                fontSize: "2rem",
                marginBottom: "0.5rem",
                textTransform: "capitalize",
                letterSpacing: "1px",
              }}
            >
              {product.name}
            </h1>
            <i style={{ marginBottom: "3rem" }}>{product.brand}</i>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1rem",
                margin: "10px 0px 0px",
              }}
            >
              PRODUCT DESCRIPTION :
            </p>
            <p style={{ marginBottom: "1rem" }}>{product.description}</p>
          </div>

          <div className="product-price">
            <span style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {"$" + product.price}
            </span>
            <button
              className={`cart-btn ${
                !product.productAvailable ? "disabled-btn" : ""
              }`}
              onClick={handlAddToCart}
              disabled={!product.productAvailable}
              style={{
                padding: "1rem 2rem",
                fontSize: "1rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginBottom: "1rem",
              }}
            >
              {product.productAvailable ? "Add to cart" : "Out of Stock"}
            </button>
          </div>
          <div
            className="update-button"
            style={{ display: "flex", gap: "1rem" }}
          >
            {isAdmin && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={handleEditClick}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Update
              </button>
            )}

            {isAdmin && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={deleteProduct}
                style={{
                  padding: "1rem 2rem",
                  fontSize: "1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
