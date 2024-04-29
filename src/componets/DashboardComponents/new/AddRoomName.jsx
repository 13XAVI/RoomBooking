import React, { useEffect, useState } from "react";
import axiosInstance from "../../../Axios/axios";
import { TbError404 } from "react-icons/tb";
import "./New.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function AddRoomName({ title }) {
  const [RoomNames, setRoomName] = useState([]);
  const [data, setData] = useState({ roomName: "", roomID: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [messageTimeout, setMessageTimeout] = useState(null);
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_FETCH_ROOMS)
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setRoomName(res.data);
          console.log("These are my data", res.data);
        }
      })
      .catch((error) => {
        setError(
          error.response ? error.response.data.message : "An error occurred"
        );
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "roomID" || name === "staffID" ? parseInt(value) : value;
    setData({ ...data, [name]: parsedValue });
  };

  const handleClickEve = (e) => {
    e.preventDefault();

    axiosInstance
      .post(process.env.REACT_APP_ROOM_NAME, data)
      .then((res) => {
        if (res.data && res.data.msg) {
          setSuccessMessage(res.data.msg);
          console.log("res", res);

          setSuccessMessage("Successfully added");
          setMessageTimeout(setTimeout(clearMessages, 5000));
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setError("Duplicated Name");
          setMessageTimeout(setTimeout(clearMessages, 5000));
        } else {
          setError(
            error.response ? error.response.data.message : "An error occurred"
          );
        }
      });
  };

  if (RoomNames.length === 0) {
    return <p>Loading...</p>;
  }

  console.log("Room Names", RoomNames);

  return (
    <div>
      <form className="" onSubmit={handleClickEve}>
        <select
          name="roomID"
          id=""
          className="form-select"
          aria-label="Default select example"
          onChange={handleChange}
        >
          <option value="">Select a Room ID</option>
          {RoomNames.map((room) => (
            <option key={room.roomID} value={room.roomID}>
              {room.roomID}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter the Room Name"
          onChange={handleChange}
          name="roomName"
        />
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {error && <div className="error-message">{error}</div>}
        <button className="green-btn btn-success">Submit</button>
      </form>
    </div>
  );
}

export default AddRoomName;
