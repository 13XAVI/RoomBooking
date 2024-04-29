import React, { useState, useEffect } from "react";
import { FaFolderOpen } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Widget from "../widget/WidgetApp";
import { RoomInputs } from "../FormSource";
import axiosInstance from "../../../../Axios/axios";
import authService from "../../../Services/authService";

function RoomEditPopup({ title, clickedRoom }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [formInputs, setFormInputs] = useState({
    roomLocation: "",
    capacity: 0,
    roomDescription: "",
  });

  useEffect(() => {
    if (clickedRoom) {
      console.log(clickedRoom, "Clicked Rooomm");
      setFormInputs({
        roomLocation: clickedRoom.roomLocation,
        capacity: clickedRoom.capacity,
        roomDescription: clickedRoom.roomDescription,
      });
      setSelectedImage(clickedRoom.imagePath);
    }
  }, [clickedRoom]);

  const handleChanges = (e) => {
    setError(null);
    setFormInputs({ ...formInputs, [e.target.name]: e.target.value });
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const handleChangesImage = (e) => {
    const file = e.target.files[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formInputs.roomLocation || !formInputs.capacity || !formInputs.roomDescription) {
      setError("Please fill in all the fields and upload an image.");
      setMessageTimeout(setTimeout(clearMessages, 5000));
      return;
    }

    try {
      const formData = new FormData();

      // Add form inputs to the FormData object
      formData.append("roomLocation", formInputs.roomLocation);
      formData.append("capacity", formInputs.capacity);
      formData.append("roomDescription", formInputs.roomDescription);

      console.log("Form Data:", formData);

      const responseData = await fetch(
        `${process.env.REACT_APP_API_ENDPOINT_UPDATE_ROOM}?roomID=${clickedRoom.roomID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authService.getToken()}`,
          },
          body: formData,
        }
      );

      // Handle response data
      const jsonResponse = await responseData.json();
      console.log(jsonResponse);

      if (responseData.ok) {
        setSuccessMessage("Rooms updated successfully");
      } else {
        setError("Failed to update rooms. Please try again.");
      }

      // Clear error and success messages after a timeout
      setMessageTimeout(setTimeout(clearMessages, 5000));
    } catch (error) {
      setError("Failed to update rooms. Please try again.");
      setMessageTimeout(setTimeout(clearMessages, 5000));
    }
  };


  return (
    <div className="new">
      <div className="newcontainer">
        <div className="top">
          <h1 style={{ marginTop: "40px" }}>{title}</h1>
        </div>

        <div className="bottom">
          <div className="left">
            <img
              src={
                selectedImage ||
                "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""

            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="formInput">
                <label htmlFor="file">Image:</label>
                <input
                  type="file"
                  id="file"
                  style={{ display: "none" }}
                  name="file"

                  className="inputRoom"
                  disabled={true}
                // onChange={handleChangesImage}
                />
                <FaFolderOpen
                  className="icon"
                  onClick={() => document.getElementById("file").click()}
                />
              </div>

              {RoomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  {input.type === "Select" ? (
                    <select
                      name={input.name}
                      className="inputRoom"
                      value={formInputs[input.name]}
                      onChange={handleChanges}
                    >
                      <option value="">{input.placeholder}</option>
                      {input.options.map((option, index) => (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={input.type}
                      placeholder={input.placeholder}
                      name={input.name}
                      className="inputRoom"
                      value={formInputs[input.name]}
                      onChange={handleChanges}
                    />
                  )}
                </div>
              ))}
              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {error && <div className="error-message">{error}</div>}
              <button type="submit" onClick={handleSubmit}>
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomEditPopup;
