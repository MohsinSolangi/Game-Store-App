import React, { useState } from "react";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const notyf = new Notyf({
      duration: 1500,
      position: { x: "center", y: "top" },
    });

    console.log("Sending formData:", formData);

    try {
      const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Registration successful:", data);
        notyf.success({
          message: "Registration successful! 😉",
        });
        setFormData({
          username: "",
          password: "",
        });
        // Reset form data after successful registration
      } else {
        const errorData = await response.text();
        console.error("Registration failed:", errorData);
        notyf.error({
          message: `Registration failed: ${errorData}`,
          errorData,
        });
        // alert("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      notyf.error({
        message: `An error occurred: ${error.message}`,
      });
    }
  };

  return (
    <div className="register-container">
      <h1>Welcome to Game Store</h1>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
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
        <button className="submitbtn" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
