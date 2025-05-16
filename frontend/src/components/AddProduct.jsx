import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    company: "",
    description: "",
    price: "",
    category: "",
    productAvailable: false,
  });
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    console.log("inside useeffect");
    const fecthCatogry = async () => {
      console.log("inside fetch category");
      try {
        const response = await axios.get(
          "http://localhost:8080/api/product/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data;
        console.log("Categories:", data);
        const categories = data.map((item) => {
          const [valueName, name] = item.split(",");
          return { valueName, name };
        });
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      console.log(categories);
    };
    fecthCatogry();
  }, []);

  const notyf = new Notyf({
    duration: 1500,
    position: { x: "center", y: "top" },
  });

  const productAdded = (productName) => {
    notyf.success({
      message: `${productName} The product is added!`,
    });
  };

  const productNotAdded = (productName) => {
    notyf.error({
      message: `${productName} The product is not added !`,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(product)], { type: "application/json" })
    );

    axios
      .post("http://localhost:8080/api/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Product added successfully:", response.data);
        productAdded(product.name);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        productNotAdded(product.name);
      });
  };

  return (
    <div className="container">
      <div className="center-container">
        <form className="row g-3 pt-5" onSubmit={submitHandler}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Product Name"
              onChange={handleInputChange}
              value={product.name}
              name="name"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Company</h6>
            </label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="Enter your Company Name"
              value={product.company}
              onChange={handleInputChange}
              id="company"
            />
          </div>
          <div className="col-12">
            <label className="form-label">
              <h6>Description</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Add product description"
              value={product.description}
              name="description"
              onChange={handleInputChange}
              id="description"
            />
          </div>
          <div className="col-5">
            <label className="form-label">
              <h6>Price</h6>
            </label>
            <input
              type="number"
              className="form-control"
              placeholder="Eg: $1000"
              onChange={handleInputChange}
              value={product.price}
              name="price"
              id="price"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>Category</h6>
            </label>
            <select
              className="form-select"
              value={product.category}
              onChange={handleInputChange}
              name="category"
              id="category"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option value={category.valueName} key={category.valueName}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={product.productAvailable}
                onChange={(e) =>
                  setProduct({ ...product, productAvailable: e.target.checked })
                }
              />
              <label className="form-check-label">Product Available</label>
            </div>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
