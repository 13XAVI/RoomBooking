import React, { useEffect, useState } from "react";
import axios from "axios";
import authService from "../Services/authService";
import axiosInstance from "../../Axios/axios";
import "./Card.css";
import { Calendar, TimeGrid, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import * as bootstrap from "bootstrap";

const CardForm = ({ roomNames, closeRoom, clickedRoom }) => {
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState("dayGridMonth");
  const [selectedRoom, setSelectedRoom] = useState({
    roomID: clickedRoom.roomID,
    userID: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });
  const [successMessage, setSuccessMessage] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [inptform, setInptForm] = useState([]);
  const userInfo = authService.getUserInfo();
  const [selectedRoomImage, setSelectedRoomImage] = useState("");
  const [messageTimeout, setMessageTimeout] = useState(null);
  const [isBookingDisabled, setIsBookingDisabled] = useState(false);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);

  //   return () => {};
  // }, []);

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = authService.getToken();

        if (!storedToken) {
          setError("User not authenticated.");
          return;
        }

        const roomResponse = await axios.get(process.env.REACT_APP_FETCH_ROOMS);

        const roomData = roomResponse.data;

        setRoomData(roomData);
        console.log("room Data Correctly", roomData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data. fetch 2");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = authService.getToken();

        console.log("My Stored Token", storedToken);

        if (!storedToken) {
          setError("User not authenticated.");
          return;
        }
        const response = await axiosInstance.get(
          process.env.REACT_APP_FETCH_EVENTS
        );

        setInptForm(response.data);
        console.log("Booked Room", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const userId = authService.getUserInfo().userId;
    setSelectedRoom((prevSelectedRoom) => ({
      ...prevSelectedRoom,
      userID: userId,
    }));
  }, []);

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setSelectedRoom((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleBooking = async () => {
    setIsBookingDisabled(true);
    const currentDate = moment();

    try {
      const storedToken = authService.getToken();

      if (!storedToken) {
        setError("User not authenticated.");
        setTimeout(() => setIsBookingDisabled(false), 2000);
        return;
      }

      const userAuthorities = authService.getUserRole();

      if (!userAuthorities || !userAuthorities.includes("user")) {
        setError("You do not have the authority to book.");
        setMessageTimeout(setTimeout(clearMessages, 3000));
        setTimeout(() => setIsBookingDisabled(false), 2000);
        return;
      }

      const selectedStartTime = moment(selectedRoom.startTime);

      if (selectedStartTime <= currentDate) {
        setError("Please select a start time after the current date and time.");
        setMessageTimeout(setTimeout(clearMessages, 5000));
        setTimeout(() => setIsBookingDisabled(false), 2000);
        setIsBookingDisabled(false);
        return;
      }

      const selectedEndTime = moment(selectedRoom.endTime);
      if (selectedEndTime <= selectedStartTime) {
        setError("End time must be after start time.");
        setMessageTimeout(setTimeout(clearMessages, 5000));
        setTimeout(() => setIsBookingDisabled(false), 2000);
        setIsBookingDisabled(false);
        return;
      }

      if (
        !selectedRoom.roomID ||
        !selectedRoom.userID ||
        !selectedRoom.startTime ||
        !selectedRoom.endTime ||
        !selectedRoom.purpose
      ) {
        setError("Please fill in all required fields.");
        setMessageTimeout(setTimeout(clearMessages, 5000));
        setTimeout(() => setIsBookingDisabled(false), 2000);
        return;
      }

      console.log("Inputs", inptform);

      // Check for overlapping bookings
      const overlappingBookings = inptform.filter((booking) => {
        const existingStartTime = moment(booking.booking.startTime);
        const existingEndTime = moment(booking.booking.endTime);

        return (
          selectedStartTime.isBefore(existingEndTime) &&
          selectedEndTime.isAfter(existingStartTime)
        );
      });

      if (overlappingBookings.length > 0) {
        setError("Selected time range overlaps with existing booking.");
        setMessageTimeout(setTimeout(clearMessages, 4000));
        return;
      }

      // If no overlapping bookings, proceed with booking
      const bookingPayload = {
        room: {
          roomID: selectedRoom.roomID,
        },
        user: {
          staffID: parseInt(selectedRoom.userID),
        },
        startTime: selectedRoom.startTime,
        endTime: selectedRoom.endTime,
        purpose: selectedRoom.purpose,
      };

      const response = await axios.post(
        process.env.REACT_APP_BOOK_ENDPOINT,
        bookingPayload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Booking successful!");
        setMessageTimeout(setTimeout(clearMessages, 5000));

        const updatedResponse = await axiosInstance.get(
          process.env.REACT_APP_FETCH_EVENTS
        );

        setTimeout(() => setIsBookingDisabled(false), 2000);
        setInptForm(updatedResponse.data);
        setTimeout(() => closeRoom(), 2000);
      } else {
        setError("Booking failed. Please try again later.");
        setMessageTimeout(setTimeout(clearMessages, 5000));
        setTimeout(() => setIsBookingDisabled(false), 2000);
      }
    } catch (error) {
      if (error.response) {
        setError(`Server Error: ${error.response.data}`);
      } else if (error.request) {
        setError("No response from the server. It can be another issue.");
      } else {
        setError(`Error: ${error.message}`);
      }
      setTimeout(() => setIsBookingDisabled(false), 2000);
      setMessageTimeout(setTimeout(clearMessages, 5000));
    }
  };

  useEffect(() => {
    const overlappingBookingsForSameUser = inptform.filter((booking) => {
      const existingStartTime = new Date(booking.startTime);
      const existingEndTime = new Date(booking.endTime);
      const newStartTime = new Date(selectedRoom.startTime);
      const newEndTime = new Date(selectedRoom.endTime);

      const isOverlap =
        existingStartTime < newEndTime && existingEndTime > newStartTime;

      return isOverlap;
    });
    if (overlappingBookingsForSameUser.length > 0) {
      setError(
        "Booking overlaps with existing booking(s). Please select a different time range."
      );
      setMessageTimeout(setTimeout(clearMessages, 5000));
      setIsBookingDisabled(false);
      return;
    }
  }, [
    selectedRoom.startTime,
    selectedRoom.endTime,
    inptform,
    selectedRoom.userID,
  ]);

  const scrollToBookingForm = () => {
    document
      .getElementById("bookingForm")
      .scrollIntoView({ behavior: "smooth" });
  };

  const bookedEvents = roomData.reduce((events, room) => {
    const roomLocation = room.roomLocation || "Unknown Room";

    if (room.bookings && room.bookings.length > 0) {
      const roomEvents = room.bookings.map((booking) => {
        const start = booking.startTime
          ? new Date(booking.startTime)
          : undefined;
        const end = booking.endTime ? new Date(booking.endTime) : undefined;

        return {
          title: roomLocation,
          start: start,
          end: end,
        };
      });

      return events.concat(roomEvents);
    } else {
      return events;
    }
  }, []);

  console.log("bookedEvents", bookedEvents);
  console.log("room", roomNames);

  return (
    <div className="cardContainer row">
      <h3
        style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}
      >
        Room Request
      </h3>
      <div className="desc col-md-10">
        <div className="row">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="roomID" className="form-label">
                  {" "}
                  Room:
                </label>
                <input
                  id="roomID"
                  onChange={handleChanges}
                  name="roomID"
                  value={selectedRoom.roomID}
                  className="form-select"
                  placeholder={selectedRoom.roomID}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="userID" className="form-label">
                  Logged User:
                </label>
                <input
                  id="userID"
                  name="userID"
                  onChange={handleChanges}
                  placeholder={userInfo.sub}
                  readOnly
                  className="form-control"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label htmlFor="startTime" className="form-label">
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={selectedRoom.startTime}
                  onChange={handleChanges}
                  className="form-control"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="endTime" className="form-label">
                  End Time
                </label>
                <input
                  type="datetime-local"
                  id="endTime"
                  name="endTime"
                  value={selectedRoom.endTime}
                  onChange={handleChanges}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <label htmlFor="purpose" className="form-label">
                  Purpose
                </label>
                <textarea
                  id="purpose"
                  name="purpose"
                  value={selectedRoom.purpose}
                  onChange={handleChanges}
                  className="form-control"
                  rows="2"
                />
              </div>
            </div>
          </div>
          <div>
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            {error && <div className="error-message">{error}</div>}
            <button
              className="green-btn"
              onClick={handleBooking}
              disabled={isBookingDisabled}
            >
              Book the Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm;
