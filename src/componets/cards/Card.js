import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import authService from "../Services/authService";
import axiosInstance from "../../Axios/axios";
import "./Card.css";
import { IoInformationCircleOutline } from "react-icons/io5";
import RoomReviewCard from "./RoomReviewCard";
import { Dialog, DialogContent } from "@mui/material";

const Card = ({ filteredRooms }) => {
  const [error, setError] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [inptform, setInptForm] = useState([]);
  const [bookingsData, setBookingsData] = useState([]);
  const [canceledRoom, setCanceledRoom] = useState([])
  const [roomNames, setRoomNames] = useState([]);
  const [oneRoom, setOneRoom] = useState([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clickedRoom, setClickedRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [credentials, setCredentials] = useState({
    bookingID: "",
    purpose: ""
  })
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastAddedRoom, setLastAddedRoom] = useState([]);
  const [messageTimeout, setMessageTimeout] = useState(null);
  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };


  const cardContainerRef = useRef(null);

  const addRoom = (newRoom) => {
    setLastAddedRoom(newRoom);
  };

  useEffect(() => {
    if (roomNames.length > 0) {
      const lastRoom = roomNames[roomNames.length - 1];
      const bookingsForLastRoom = bookingsData.filter(booking => booking.roomId === lastRoom.roomID.roomID);
      if (bookingsForLastRoom.length > 0) {
        setLastAddedRoom(lastRoom);
      }
    }
  }, [roomNames, bookingsData]);

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = authService.getToken();
      console.log("Stored Token", storedToken)

      if (!storedToken) {
        setError("User not authenticated.");
        return;
      }
      try {
        const response = await axios.get(
          process.env.REACT_APP_FETCH_EVENTS, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            "Access-Control-Allow-Origin": "*",
          }
        }
        );
        const data = response.data;
        setBookingsData(data);
      } catch (error) {
        console.error("Error fetching bookings data:", error);
      }
    };

    fetchData();
  }, [successMessage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_GET_ROOMNAMES, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
        );

        setRoomNames(response.data);

        console.log("Room Names inside useEffect: ", response.data);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (myDate) => {
    const date = new Date(myDate)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return date.toLocaleString('en-US', options);
  }


  const HandleChanges = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const HandleSearchBook = () => {
    console.log("searched Term", parseInt(searchTerm))
    const result = roomData.find(room => {
      return room.roomId == parseInt(searchTerm),
        console.log("searched Result", typeof (room.roomId))
    });

    if (!result) {
      setError("Room ID not found.");
      setSearchResult(null);
      return;
    }
    setSearchTerm('');
    setClickedRoom(null); // Reset clicked room
    setSuccessMessage(null); // Reset success message
    setDeleteDialogOpen(false); // Close delete dialog if open
    setIsExpanded(false); // Collapse room information
    setSearchResult(result); // Update searchResult with the found room
  };





  const storedToken = authService.getToken();
  useEffect(() => {
    const fetchData = async () => {
      try {

        if (!storedToken) {
          setError("User not authenticated.");
          return;
        }

        const roomResponse = await axiosInstance.get(
          process.env.REACT_APP_FETCH_EVENTS
        );
        const roomData = roomResponse.data;

        setRoomData(roomData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data bgfghgf.");
      }
    };

    fetchData();
  }, [successMessage]);

  console.log("Room Booking Information", roomData);
  const openDeleteDialog = (room) => {
    if (room && room.booking && room.booking.bookingID) {
      setClickedRoom(room);
      setCredentials(prevCredentials => ({
        ...prevCredentials,
        bookingID: room.booking.bookingID
      }));
      setDeleteDialogOpen(true);
    } else {
      console.error("Booking information not found for the selected room.");
    }
  };



  const closeDeleteDialog = () => {
    console.log("Closing delete dialog");
    setDeleteDialogOpen(false);
    setSelectedRoom(null);
  };


  const collapseDisplay = () => {
    setIsExpanded(false);
  };



  const openDialogframe = async () => {
    if (!storedToken) {
      setError("User not authenticated.");
      return;
    }

    try {
      const response = await axios.delete(
        process.env.REACT_APP_CLIENT_CANCEL_BOOKING,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          data: {
            bookingID: credentials.bookingID,
            purpose: credentials.purpose
          }
        }
      );
      const data = response.data;
      setCanceledRoom(data);
      setSuccessMessage("Room Successfully Released");
      setMessageTimeout(setTimeout(clearMessages, 3000));
      setTimeout(() => {
        window.location.reload()
      }, 3000);

    } catch (error) {
      setError(error.response.data.message);
      setSuccessMessage(null);
      console.error("Error fetching bookings data:", error);
    }
  };



  console.log(clickedRoom, "sdfsdfClickedRoom")



  const foundRoom = roomNames.find(room => room.roomNameID);
  const roomName = foundRoom ? foundRoom.roomName : "Not Found";


  return (
    <div className="card" id="bookingForm">
      <div className="room-review-card-container">
        <RoomReviewCard
          roomData={roomData}
        />
      </div>
      {console.log("filtereds rooms", roomData)}
      {/* <div className="SearchBooked">
        <input type="number" style={{ width: 300, }} placeholder="search room Id" value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)} />
        <button onClick={HandleSearchBook}> Search</button>
      </div> */}
      <div className="cardContainer-main">

        {roomData.map((romm, index) => (
          <div key={index + 1} className="set">
            <div
              key={romm.roomId}
              className={`cardContainersz ${searchResult && romm.roomId === searchResult.roomId ? 'highlight' : ''} ${clickedRoom && romm.roomId === clickedRoom.roomId ? 'clicked' : ''}`}
              onClick={() => setClickedRoom(romm)}
              ref={cardContainerRef}
            >
              <div className="all-info" id="allInfo" onClick={() => setIsExpanded(!isExpanded)}>
                <h1>{romm.name}</h1>
                {isExpanded && clickedRoom && clickedRoom.roomId === romm.roomId ? (
                  <>
                    <div className="listInforoom" onClick={() => collapseDisplay()}>

                      <li> Start Time: {formatDate(clickedRoom.booking.startTime)}</li>
                      <li> Room ID: {clickedRoom.roomId}</li>
                      <li> End Time: {formatDate(clickedRoom.booking.endTime)}</li>
                      <li> Status: {romm.booking.status}</li>
                      <button onClick={() => openDeleteDialog(romm)}>Release Room</button>
                      <hr />
                    </div>
                  </>
                ) : (
                  <p className="parag-intro" id="para-header">
                    Booking information No. {index + 1}
                  </p>
                )}
              </div>
              <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogContent>
                  {console.log("Rendering delete dialog")}
                  <div>Are you sure you want to Release this Room?</div>
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <label htmlFor="exampleFormControlInput1" className="form-label">Booking ID</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Booking ID"
                      name="bookingID"
                      value={credentials.bookingID}
                      onChange={(e) => HandleChanges(e)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label" >Enter Reason</label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" rows="3" name='purpose' onChange={(e) => HandleChanges(e)}></textarea>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {error && <div className="error-message">{error.message}</div>}
                    {successMessage && <div className="success-message">{successMessage}</div>}
                    <button onClick={() => openDialogframe(romm.roomId)}>Free</button>
                    <button onClick={closeDeleteDialog} style={{ marginLeft: '10px' }}>Cancel</button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Card;