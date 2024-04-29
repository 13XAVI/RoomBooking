import React, { useState } from 'react';
import axios from 'axios'; 
import useFetch from '../../hooks/useFetch'; 

const EditPopup = ({ onClose, onSave, data }) => {
  const [editedData, setEditedData] = useState(
    {
        fullnames: "",
        email: "",
        password: "",
        empNo: "",
        mobileNo: "",
        position: ""
    }
  );
  const { data: units } = useFetch({ url: process.env.REACT_APP_FETCH_UNITS });
  const { data: departments } = useFetch({ url: process.env.REACT_APP_FETCH_DEPARTMENT });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();

    try {
    
      const response = await axios.post(
        `${process.env.REACT_APP_SIGNUP}`,
        editedData, // Send editedData instead of credentials
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      if (response.status === 200) {
        setError(null);
        setSuccessMessage("Account successfully Updated!");
        console.log(response.data, response.status);
      } else {
        if (response.data && response.data.msg) {
          setError(response.data.msg);
        } else {
          throw new Error("Could not Post Data", error);
        }
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(err.message);
    }

    onSave(editedData);
    onClose();
  };

  const handleChange = (e) => {
    setEditedData({ ...editedData, [e.target.name]: e.target.value });
  };

  return (
    <div className="edit-popup">
      <h2>Edit Item</h2>
      <form action="" className="user-form" onSubmit={handleSave}>
      <h2>Update Account</h2>
            <div className="user-inp">
              <input
                type="text"
                placeholder="Enter Full Names"
                name="fullnames"
                value={editedData.fullnames}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="user-inp">
              <input
                type="email"
                placeholder="Your Email"
                name="email"
                value={editedData.email}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="user-inp">
              <input
                type="text"
                placeholder="Enter Position"
                name="position"
                value={editedData.position}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="user-inp">
              <input
                type="text"
                placeholder="Enter Employee Number"
                name="empNo"
                value={editedData.empNo}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="user-inp">
              <input
                type="text"
                placeholder="Enter Your Mobile Number"
                name="mobileNo"
                value={editedData.mobileNo}
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="user-inp">
              <div className="info-mode">
                <select id="selectBox" onChange={handleChange} name="unit">
                  <option value="">Select a Unit</option>
                  {units &&
                    units.map((unit) => (
                      <option key={unit.unitID} value={unit.unitName}>
                        {unit.unitName}
                      </option>
                    ))}
                </select>
              </div>
              <div className="info-mode">
                <select
                  id="selectBox"
                  onChange={handleChange}
                  name="department"
                >
                  <option value="">Select a Department</option>
                  {departments &&
                    departments.map((department) => (
                      <option
                        key={department.departmentID}
                        value={department.departmentName}
                      >
                        {department.departmentName}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="user-inp">
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={editedData.password} 
                required
                className="input"
                onChange={handleChange}
              />
            </div>
            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="green-btn">
              Register
            </button>
      </form>
      <input
        type="text"
        value={editedData.name} 
        onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
      />
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditPopup;
