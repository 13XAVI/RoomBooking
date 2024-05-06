import React, { useEffect, useState } from "react";
import axios from "axios";
import "./signup.scss";
import useFetch from "../../hooks/useFetch";
import "bootstrap/dist/css/bootstrap.min.css";
import authService from "../Services/authService";

function Signup() {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [credentials, setCredentials] = useState({
    fullnames: "",
    email: "",
    password: "",
    empNo: "",
    mobileNo: "",
    position: "",
    unitID: "",
    department: "",
  });

  const { data: units } = useFetch({
    url: process.env.REACT_APP_FETCH_UNITS,
  });

  console.log("units", units);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SIGNUP}`,
        credentials,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        setError(null);
        setSuccessMessage("Account successfully created!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);

        console.log("successfully saved");
        console.log(response.data, response.status);
      } else {
        if (response.data && response.data.msg) {
          setError(response.data.msg);

          // Clear error message after 3000 milliseconds (3 seconds)
          setTimeout(() => {
            setError(null);
          }, 4000);
        } else {
          throw new Error("Could not Post Data", error);
        }
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.message);

      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: name === "unitID" ? parseInt(value, 10) : value,
    }));
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <form
            action=""
            className="user-form p-3 border"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-4">Create Account</h2>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="fullnames" className="form-label">
                  Full Names
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Names"
                  name="fullnames"
                  value={credentials.fullnames}
                  required
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={credentials.email}
                  required
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="position" className="form-label">
                  Position
                </label>
                <input
                  type="text"
                  placeholder="Enter Position"
                  name="position"
                  value={credentials.position}
                  required
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="empNo" className="form-label">
                  Employee Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Employee Number"
                  name="empNo"
                  value={credentials.empNo}
                  required
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="mobileNo" className="form-label">
                  Mobile Number
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Mobile Number"
                  name="mobileNo"
                  value={credentials.mobileNo}
                  required
                  className="form-control"
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="unitID" className="form-label">
                  Unit
                </label>
                <select
                  id="selectBox"
                  onChange={handleChange}
                  name="unitID"
                  value={credentials.unitID}
                  className="form-select"
                >
                  <option value="">Select a Unit</option>
                  {units &&
                    units.map((unit) => (
                      <option key={unit.unitID} value={unit.unitID}>
                        {unit.unitName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={credentials.password}
                required
                className="form-control"
                onChange={handleChange}
              />
            </div>
            {successMessage && (
              <div className="alert alert-success">{successMessage}</div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="green-btn btn-success ">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
