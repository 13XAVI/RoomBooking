import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../../../../hooks/useFetch";
import axios from "axios";
import authService from "../../../Services/authService";

const UserEditPopup = ({ title, clickedUser }) => {
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [credentials, setCredentials] = useState({
    fullnames: clickedUser.fullnames,
    email: clickedUser.email,
    password: clickedUser.password,
    empNo: clickedUser.empNo,
    mobileNo: clickedUser.mobileNo,
    position: clickedUser.position,
    units: clickedUser.units,
  });

  const { data: units } = useFetch({
    url: process.env.REACT_APP_FETCH_UNITS,
  });
  const { data: departments } = useFetch({
    url: process.env.REACT_APP_FETCH_DEPARTMENT,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "unitID") {
      const selectedUnit = units.find(
        (unit) => unit.unitID.toString() === value
      );
      if (selectedUnit) {
        setCredentials((prevCredentials) => ({
          ...prevCredentials,
          units: {
            unitID: selectedUnit.unitID,
            unitName: selectedUnit.unitName,
          },
        }));
      }
    } else {
      setCredentials((prevCredentials) => ({
        ...prevCredentials,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      staffID: clickedUser.staffID,
      fullnames: credentials.fullnames,
      password: credentials.password,
      empNo: credentials.empNo,
      userNo: clickedUser.userNo,
      mobileNo: credentials.mobileNo,
      email: credentials.email,
      position: credentials.position,
      unitID: credentials.units.unitID,
    };

    try {
      const response = await axios.put(
        process.env.REACT_APP_USER_UPDATE,
        dataToSend, // Send the adjusted data
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Account successfully updated!");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 4000);
      } else {
        throw new Error("Could not update the data");
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 4000);
    }
  };

  return (
    <div className="container mt-5" style={{ width: 900 }}>
      <div className="row justify-content-center">
        <div className="col-lg-8" style={{}}>
          <form
            action=""
            className="user-form p-3 border"
            onSubmit={handleSubmit}
          >
            <h2 className="text-center mb-4">Update Account</h2>
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
                  disabled
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
                  onChange={handleChange}
                  name="unitID"
                  value={credentials.units.unitID}
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
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditPopup;
