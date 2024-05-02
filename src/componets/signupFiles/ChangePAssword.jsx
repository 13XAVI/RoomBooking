import React, { useState } from "react";
import Navbar from "../navigationBar/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import { useEmail } from "../Services/EmailProvider";

function ChangePassword(props) {
  const navigate = useNavigate(); // Initialize navigate function
  const [credentials, setCredentials] = useState({
    password: "",
    confirmPassw: "",
  });
  const email = useEmail();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const changePassword = (e) => {
    e.preventDefault();

    axios
      .post(`${process.env.REACT_APP_CHANGE_PASSWORD}/${email}`, credentials)
      .then((response) => {
        if (response.data) {
          setSuccessMessage("Password changed successfully");
          navigate("/Login");
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <div>
      <Navbar />
      <div className="contact-container">
        <h1>Change Password</h1>
        <form className="contact-form" onSubmit={(e) => changePassword(e)}>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={(e) => handleChange(e)}
            required
          />

          <label htmlFor="confirmPassw">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassw"
            name="confirmPassw"
            value={credentials.confirmPassw}
            onChange={(e) => handleChange(e)}
            required
          />
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
          {error && <p className="error-message">{error.message}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
