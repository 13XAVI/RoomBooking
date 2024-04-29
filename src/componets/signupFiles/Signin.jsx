import React, { createContext, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import authService from "../Services/authService";
import Navbar from "../navigationBar/navbar";
import { isExpired, decodeToken } from "react-jwt";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { Table } from "@mui/material";

const AuthContext = createContext();

const Signin = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [mytoken, setMyToken] = useState("");
  const [tokenPayLoad, setTokenPayLoad] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await authService.login(credentials);

      if (response?.data.accessToken) {
        const accessToken = response?.data?.accessToken;
        const setTokenResult = authService.setToken(accessToken);

        const payLoad = jwt_decode(accessToken);
        setTokenPayLoad(payLoad);
        console.log("Decoded token:", payLoad);
        payLoad?.authorities === "admin"
          ? navigate("/Dashboard")
          : navigate("/RequestRom");
      }

      setError(null);
    } catch (err) {
      console.error("Error during login:", err);
      const errorMessage =
        err.response?.data?.message || "Invalid User Account";
      setError(errorMessage);
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      <Navbar />
      <div className="login-form-container">
        <form className="form-container" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={credentials.email}
            required
            className="input"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={credentials.password}
            required
            className="input"
            onChange={handleChange}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="green-btn">
            Login
          </button>
          <div className="signup-link"></div>
        </form>
      </div>

      {tokenPayLoad && (
        <div>
          <Table tokenPayLoad={setTokenPayLoad} />
        </div>
      )}
    </div>
  );
};

export default Signin;
