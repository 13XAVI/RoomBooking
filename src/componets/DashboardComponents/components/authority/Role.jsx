// Inside the AddAuthority component
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AddAuthority.scss";
import axiosInstance from "../../../../Axios/axios";
import Signup from "../../../signupFiles/signup";

const Role = () => {
  const [credentials, setCredentials] = useState({
    authorityName: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAuthority = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        process.env.REACT_APP_ADD_ROLE,
        credentials
      );
      console.log(response?.data);

      if (response?.data === 200) {
        alert("Authority Added" + response.data.user);
        setSuccessMessage("Successfully Saved");
        setError(null);
      }
    } catch (err) {
      console.error("Error during login:", err);
      const errorMessage = err.response?.data?.message || "Bad Credentials";
      setError(errorMessage);
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className="Auth-form-container">
        <form className="form-container" onSubmit={handleAuthority}>
          <h2>Register Role</h2>
          <input
            type="text"
            placeholder="Role Name"
            name="authorityName"
            value={credentials.authority}
            required
            className="input-len"
            onChange={handleChange}
          />

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="green-btn">
            Add Authority
          </button>
        </form>
      </div>
    </div>
  );
};

export default Role;
