import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [image, setImage] = useState();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [updateProduct, setUpdateProduct] = useState({
    id: null,
    name: "",
    description: "",
    company: "",
    price: "",
    category: "",
    releaseDate: "",
    productAvailable: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setProduct(response.data);

        const responseImage = await axios.get(
          `http://localhost:8080/api/product/${id}/image`,
          {
            responseType: "blob",
          }
        );
        const imageFile = await converUrlToFile(
          responseImage.data,
          response.data.imageName
        );
        setImage(imageFile);
        setUpdateProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
        s;
      }
    };

    fetchProduct();
  }, [id]);

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

  const productupdate = (productName) => {
    notyf.success({
      message: `${productName} The product is updated!`,
    });
  };

  const updatedProductUnsucessfull = (productName) => {
    notyf.error({
      message: `${productName} The product is not updated !`,
    });
  };

  useEffect(() => {
    console.log("image Updated", image);
  }, [image]);

  const converUrlToFile = async (blobData, fileName) => {
    const file = new File([blobData], fileName, { type: blobData.type });
    return file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = new FormData();
    updatedProduct.append("imageFile", image);
    updatedProduct.append(
      "product",
      new Blob([JSON.stringify(updateProduct)], { type: "application/json" })
    );

    console.log("formData : ", updatedProduct);
    axios
      .put(`http://localhost:8080/api/updateProduct/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log("Product updated successfully:", updatedProduct);
        productupdate(product.name);
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          notyf.error("You are not authorized to update this product.");
          navigate(-1);
          updatedProductUnsucessfull(product.name);
        } else {
          console.error("Error updating product:", error);
        }
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateProduct({
      ...updateProduct,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="update-product-container">
      <div className="center-container" style={{ marginTop: "7rem" }}>
        <h1>Update Product</h1>
        <form className="row g-3 pt-1" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label className="form-label">
              <h6>Name</h6>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder={product.name}
              value={updateProduct.name}
              onChange={handleChange}
              name="name"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">
              <h6>company</h6>
            </label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder={product.company}
              value={updateProduct.company}
              onChange={handleChange}
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
              placeholder={product.description}
              name="description"
              onChange={handleChange}
              value={updateProduct.description}
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
              onChange={handleChange}
              value={updateProduct.price}
              placeholder={product.price}
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
              onChange={handleChange}
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

          <div className="col-md-8">
            <label className="form-label">
              <h6>Image</h6>
            </label>
            <img
              src={image ? URL.createObjectURL(image) : "Image unavailable"}
              alt={product.imageName}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                padding: "5px",
                margin: "0",
              }}
            />
            <input
              className="form-control"
              type="file"
              onChange={handleImageChange}
              placeholder="Upload image"
              name="imageUrl"
              id="imageUrl"
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="productAvailable"
                id="gridCheck"
                checked={updateProduct.productAvailable}
                onChange={(e) =>
                  setUpdateProduct({
                    ...updateProduct,
                    productAvailable: e.target.checked,
                  })
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

export default UpdateProduct;
