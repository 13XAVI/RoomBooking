import React, { useEffect, useState } from "react";

import SideBar from "../components/sidebarDash/SideBar";
import NavbarDash from "../components/navbarDash/NavbarDash";
import { FaFolderOpen } from "react-icons/fa";
import "./New.scss";
import axios from "axios";
import axiosInstance from "../../../Axios/axios";
import { RoomInputs } from "../components/FormSource";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Signup from "../../signupFiles/signup";
import AddRoomName from "./AddRoomName";
import Widget from "../components/widget/WidgetApp";
import authService from "../../Services/authService";
import { Dialog, DialogContent } from "@mui/material";

function New({ title }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [showSignup, setShowSignup] = useState(false);
  const [showRoom, setShowRoom] = useState(false);
  const [disableButton, setDisableButton] = useState(false);
  const [showRoomName, setShowRoomName] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowRoom(false);
  };

  const handleRoomFormClose = () => {
    setShowRoom(false);
  };

  const handleRoomClick = () => {
    setShowRoom(!showRoom);
    setShowSignup(false);
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const [formInputs, setFormInputs] = useState({
    roomLocation: "",
    capacity: 0,
    roomDescription: "",
  });
  useEffect(() => {}, [successMessage]);

  const handleChanges = (e) => {
    setError(null);
    setFormInputs({
      ...formInputs,
      [e.target.name]:
        e.target.name === "capacity"
          ? parseInt(e.target.value, 10)
          : e.target.value,
    });
  };

  const handleChangesImage = (e) => {
    const file = e.target.files[0];
    const imgs = new Image();
    const fileReader = new FileReader();
    const newFormData = new FormData();

    const getDimensions = () => {
      return new Promise((resolve) => {
        imgs.onload = () => resolve({ width: imgs.width, height: imgs.height });
      });
    };

    fileReader.onload = async (e) => {
      imgs.src = e.target.result;

      const dimension = await getDimensions();

      if (dimension.width >= 2440 || dimension.height >= 1500) {
        setSelectedImage(null);
        setError("Image dimensions must be 1440x810 pixels or smaller.");
        return;
      } else {
        setSelectedImage(dimension);
        newFormData.append("file", file);
        setMessageTimeout(setTimeout(clearMessages, 6000));
      }

      // Set other form data fields
      setFormInputs({
        ...formInputs,
        file: newFormData,
        roomLocation: formInputs.roomLocation,
        capacity: formInputs.capacity,
        roomDescription: formInputs.roomDescription,
      });

      setSelectedImage(URL.createObjectURL(file));
    };

    if (file) {
      fileReader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
    }
  };

  const notify = () => {
    toast.success("Success", { position: toast.POSITION.TOP_CENTER });
    setDisableButton(!disableButton);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formInputs.roomLocation ||
      !formInputs.capacity ||
      !formInputs.roomDescription ||
      !selectedImage
    ) {
      setError("Please fill in all the fields and upload an image.");
      setMessageTimeout(setTimeout(clearMessages, 5000));
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", formInputs.file.get("file"));
      formData.append("roomLocation", formInputs.roomLocation);
      formData.append("capacity", formInputs.capacity);
      formData.append("roomDescription", formInputs.roomDescription);

      console.log("Form Data:", formData);

      const responseData = await axios.post(
        process.env.REACT_APP_API_ENDPOINT_ADDROOMS,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${authService.getToken()}`,
          },
        }
      );

      const roomId = responseData.data.roomId;

      setSuccessMessage(`Rooms added successfully with RoomId ${roomId}`);
      setDisableButton(true);
      setMessageTimeout(setTimeout(clearMessages, 5000));
    } catch (error) {
      setError("Failed to add rooms. Bad Credentials.");
      setMessageTimeout(setTimeout(clearMessages, 5000));
    }
  };

  const HandleClickedName = () => {
    setShowRoomName(true);
  };
  const HandleCloseName = () => {
    setShowRoomName(false);
  };

  return (
    <div className="new">
      <SideBar
        onSignupClick={handleSignupClick}
        onRoomClick={handleRoomClick}
        onAddRoomClick={() => {
          setShowRoom(false);
          setShowSignup(false);
        }}
      />
      <div className="newcontainer">
        {(showRoom || showSignup) && (
          <div className="widgets">
            <Widget type="User" />
            <Widget type="ARoom" />
          </div>
        )}
        {!showRoom && !showSignup && (
          <div className="top">
            <h1 style={{ marginTop: "40px" }}>{title}</h1>
          </div>
        )}

        {!showRoom && !showSignup && (
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
                  <label htmlFor="file">
                    Image:
                    <FaFolderOpen className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    style={{ display: "none" }}
                    name="file"
                    className="inputRoom"
                    onChange={handleChangesImage}
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
                <button type="submit">Send</button>
              </form>
              <button className="addRoomName" onClick={HandleClickedName}>
                + Give Name
              </button>
            </div>
          </div>
        )}

        {(showRoom || showSignup) && (
          <div className="listContainer">
            <div className="auths">
              {showSignup && <Signup />}
              {showRoom && <AddRoomName onClose={handleRoomFormClose} />}
            </div>
          </div>
        )}

        {showRoomName && (
          <Dialog open={showRoomName} onClose={HandleCloseName}>
            <DialogContent>{showRoomName && <AddRoomName />}</DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}

export default New;
