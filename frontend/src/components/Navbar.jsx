import React, { useEffect, useState, useContext } from "react";
import Home from "./Home";
import axios from "axios";
import AppContext from "../Context/Context";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSelectCategory, onSearch }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme ? storedTheme : "light-theme";
  };
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isLoggedIn, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { isAdmin } = useContext(AppContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (value) => {
    try {
      const response = await axios.get("http://localhost:8080/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    window.location.reload();
  };
  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/search?keyword=${value}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
        console.log(response.data);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };
  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const fetchCategory = async () => {
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

        const uniqueCategories = data
          .map((item) => {
            const [name] = item.split(",");
            return name.trim();
          })
          .filter((value, index, self) => self.indexOf(value) === index);

        console.log("Unique Categories:", uniqueCategories);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategory();
  }, []);

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg fixed-top">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Game Store
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  {isAdmin && (
                    <a className="nav-link" href="/add_product">
                      Add Product
                    </a>
                  )}
                </li>

                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="/"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Categories
                  </a>

                  <ul className="dropdown-menu">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          className="dropdown-item"
                          onClick={() => handleCategorySelect(category)}
                        >
                          {category}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="nav-item"></li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="https://www.linkedin.com/in/mohsin-solangi-1a2b3c/"
                  >
                    Contact Me &nbsp;
                    <i className="bi bi-person-circle"></i>
                  </a>
                </li>
              </ul>
              {/* <a href="/Login" className="nav-link text-dark">
                <i className="bi bi-person-add fs-5"></i>
                &nbsp; Login
              </a> */}
              {isLoggedIn ? (
                <button className="login-btn" onClick={handleLogout}>
                  <i className="bi bi-person-add fs-5"></i>&nbsp;Logout
                </button>
              ) : (
                <button
                  className="login-btn"
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-person-add fs-5"></i>&nbsp; Login
                </button>
              )}

              <button className="theme-btn" onClick={() => toggleTheme()}>
                {theme === "dark-theme" ? (
                  <i className="bi bi-moon-fill"></i>
                ) : (
                  <i className="bi bi-sun-fill"></i>
                )}
              </button>
              <div className="d-flex align-items-center cart">
                <a href="/cart" className="nav-link text-dark">
                  <i
                    className="bi bi-cart me-2"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    Cart
                  </i>
                </a>

                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                {showSearchResults && (
                  <ul className="list-group">
                    {searchResults.length > 0
                      ? searchResults.map((result) => (
                          <li key={result.id} className="list-group-item">
                            <a
                              href={`/product/${result.id}`}
                              className="search-result-link"
                            >
                              <span>{result.name}</span>
                            </a>
                          </li>
                        ))
                      : noResults && (
                          <p className="no-results-message">
                            No Prouduct with such Name
                          </p>
                        )}
                  </ul>
                )}

                <div />
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
