import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css"; 
import { Notyf } from "notyf"; 

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login data:", formData);
    const notyf = new Notyf({
      duration: 1500,
      position: { x: "center", y: "top" },
    });
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Store the token in local storage
        localStorage.setItem("token", token);

        notyf.success("Login successful! 😎");
        setFormData({ username: "", password: "" });

        navigate("/");
        window.location.reload();
      } else {
        const error = await response.text();
        notyf.error(`Login failed: ${error}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      notyf.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="login-container" style={{ marginTop: "200px" }}>
      <h1>Welcome to Game Store</h1>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Not registered? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
