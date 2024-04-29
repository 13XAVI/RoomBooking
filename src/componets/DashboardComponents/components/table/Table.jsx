import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt, faPrint } from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./Table.scss";
import useFetch from "../../../../hooks/useFetch";
import UserEditPopup from "./UserEditPopup";
import axiosInstance from "../../../../Axios/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../../Services/authService";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { Dialog, DialogContent } from "@mui/material";
import Card from "../../../cards/Card";
import CardForm from "../../../cards/CardForm";
import EditRoom from "../../../cards/Editroom";

function Table({ title, data }) {
  const [url, setUrl] = useState("");
  const { loading: fetchLoading, data: allData } = useFetch({ url });
  const [loading, setLoading] = useState(false);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userData, setUserData] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [allusers, setAllusers] = useState([]);
  const [storedToken, setStoredToken] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [bookRoomPopup, setBookRoomPopup] = useState(false);
  const [credentials, setCredentials] = useState({
    bookingID: "",
    purpose: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (allData) {
      const chunks = HandleList(allData);
      setAllusers(chunks);
    }
  }, [allData]);

  console.log("dataaaaaaa", allData);

  const HandleList = (array) => {
    const list = [];
    const chunkSize = 10;
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      list.push(chunk);
    }
    return list;
  };

  useEffect(() => {
    const token = authService.getToken();
    setStoredToken(token);

    switch (title) {
      case "ListAllusers":
        setUrl(process.env.REACT_APP_FETCH_USER_DATA_URL);
        break;
      case "Booking Rooms":
        setUrl(process.env.REACT_APP_FETCH_EVENTS);
        break;
      case "Available Some Rooms":
        setUrl(process.env.REACT_APP_FETCH_ROOMS);
        break;
      default:
        console.error("Invalid title:", title);
    }
  }, [title]);

  const HandleReturn = () => {
    try {
      const storedToken = authService.getToken();

      if (!storedToken) {
        console.error("Token is null or undefined");
        return;
      }

      const payLoad = jwt_decode(storedToken);

      if (payLoad) {
        payLoad?.authorities === "admin"
          ? navigate("/Dashboard")
          : navigate("/RequestRom");
      } else {
        console.error("Token is null");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const handleEditBook = (item) => {
    setBookRoomPopup(true);
    setCredentials((prevState) => ({
      ...prevState,
      bookingID: item.booking.bookingID,
    }));
  };

  const handleEditPopupUpdate = async (updatedData) => {
    try {
      const response = await axiosInstance.put(
        process.env.REACT_APP_BOOK_ROOM,
        updatedData
      );

      if (response.status === 200) {
        setError(null);
        setSuccessMessage("Booking successfully updated!");
      } else {
        setError("Failed to update booking.");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      setError("Error updating booking.");
    }
  };
  const scrollToBookingForm = () => {
    document.getElementById("formz").scrollIntoView();
  };
  const handleFormLoad = () => {
    setEditPopupVisible(!editPopupVisible);
    setBookRoomPopup(!bookRoomPopup);
    if (!editPopupVisible) {
      scrollToBookingForm();
    }
  };

  const handleDelete = async (item) => {
    try {
      let url = "";

      if (item.staffID) {
        url = `${process.env.REACT_APP_DELETE_USER}?staffID=${item.staffID}`;
      } else if (item.roomID) {
        url = `${process.env.REACT_APP_DELETE_ROOM}?roomID=${item.roomID}`;
      } else if (item.bookingID) {
        url = `${process.env.REACT_APP_CANCEL_BOOKING}?bookingID=${item.bookingID}`;
      }

      if (!url) {
        console.error("Invalid item for deletion:", item);
        return;
      }

      const response = await axiosInstance.delete(url);

      if (response.status === 200) {
        setError(null);

        setAllusers((prevAllUsers) => {
          const updatedAllUsers = prevAllUsers.map((chunk) =>
            chunk.filter((user) => user.staffID !== item.staffID)
          );
          return updatedAllUsers;
        });

        setTimeout(() => {
          setSuccessMessage(
            item.staffID
              ? "User deleted successfully!"
              : item.roomID
              ? "Room deleted successfully!"
              : "Booking canceled successfully!"
          );
        }, 4000);
      } else {
        setTimeout(() => {
          setError(
            item.staffID
              ? "Failed to delete user."
              : item.roomID
              ? "Failed to delete room."
              : "Failed to cancel booking."
          );
        }, 4000);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Error deleting item.");
    }
  };

  const HandleChanges = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const HandleSumitionForm = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
    console.log("Credentials:", credentials);
    console.log("Request config:", { data: credentials });

    try {
      const response = await axiosInstance.delete(
        process.env.REACT_APP_CANCEL_BOOKING,
        { data: credentials }
      );

      console.log("Response:", response);

      if (response.status === 200) {
        setTimeout(() => {
          setSuccessMessage(response.data.msg);
          window.location.reload();
        }, 4000);
        setError(null);
      } else {
        setTimeout(() => {
          setError("Failed to cancel booking.");
        }, 4000);
      }
    } catch (error) {
      console.error("Error canceling booking:", error);
      setTimeout(() => {
        setError(error.message);
      }, 4000);
    }
  };

  const handleSort = () => {
    const sortedData = [...allusers[page - 1]];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    setAllusers((prev) => {
      const newAllusers = [...prev];
      newAllusers[page - 1] = sortedData;
      return newAllusers;
    });
  };

  const renderTable = () => {
    if (
      !allusers ||
      !Array.isArray(allusers) ||
      allusers.length === 0 ||
      !allusers[page - 1]
    ) {
      return <p>No data available</p>;
    }

    const currentPageData = allusers[page - 1];

    if (!currentPageData || currentPageData.length === 0) {
      return <p>No data available for the current page</p>;
    }

    let columns;
    if (title === "Booking Rooms") {
      columns = Object.keys(currentPageData[0].booking);
    } else if (title === "ListAllusers") {
      columns = Object.keys(currentPageData[0]);
    } else {
      // Handle other cases if needed
    }

    const filteredColumns = columns.filter(
      (column) => column.toLowerCase() !== "password"
    );
    const newData = filteredColumns.filter(
      (booking) => booking.toLowerCase() !== "bookings"
    );

    return (
      <div className="table-container" id="formz">
        <>
          <table id="excelTable" className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                {newData.map((column) => (
                  <th key={column}>{column}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData
                .filter((item) => !item.isDeleted)
                .filter((item) =>
                  userData.trim() === ""
                    ? true
                    : Object.values(item).some(
                        (value) =>
                          typeof value === "string" &&
                          value.toLowerCase().includes(userData.toLowerCase())
                      )
                )
                .map((item, index) => (
                  <tr key={index}>
                    {newData.map((column) => (
                      <td key={column}>
                        {column === "room"
                          ? item.booking[column]?.roomLocation
                          : column === "user"
                          ? item.booking[column]?.fullnames
                          : column === "units" && item.booking[column]
                          ? item.booking[column].unitName
                          : column === "departments" && item.booking[column]
                          ? item.booking[column].departmentName
                          : typeof item.booking[column] === "object"
                          ? JSON.stringify(item.booking[column])
                          : item.booking[column]}
                      </td>
                    ))}

                    <td className="button-cell">
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => handleEditBook(item)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="s-icons" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="prev"
              onClick={() => setPage((prev) => prev - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="next"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={page === allusers.length}
            >
              Next
            </button>
          </div>
        </>
        {title === "Booking Rooms" && bookRoomPopup && (
          <Dialog
            open={bookRoomPopup}
            onClose={handleFormLoad}
            maxWidth="md"
            fullWidth
          >
            <DialogContent>
              <form onSubmit={HandleSumitionForm}>
                <div title={title}>
                  <div>
                    <div class="mb-3">
                      <label for="exampleFormControlInput1" class="form-label">
                        Booking ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Booking ID"
                        name="bookingID"
                        value={credentials.bookingID}
                        onChange={HandleChanges}
                      />
                    </div>
                    <div class="mb-3">
                      <label
                        for="exampleFormControlTextarea1"
                        class="form-label"
                      >
                        Enter Reason
                      </label>
                      <textarea
                        class="form-control"
                        id="exampleFormControlTextarea1"
                        rows="3"
                        name="purpose"
                        onChange={HandleChanges}
                      ></textarea>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {error && (
                        <div className="error-message">{error.message}</div>
                      )}
                      {successMessage && (
                        <div className="success-message">{successMessage}</div>
                      )}
                      <button>submit</button>
                    </div>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  const printList = () => {
    window.print();
  };

  return (
    <div className="card">
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "5px",
        }}
      >
        {title}
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <button type="button" className="sort-btn" onClick={handleSort}>
          Sort by Date
        </button>
        <button type="button" className="sort-btn" onClick={HandleReturn}>
          Return Home
        </button>
        <button type="button" className="sort-btn" onClick={printList}>
          <FontAwesomeIcon icon={faPrint} className="s-icons" /> Print
        </button>
        <button>
          <CSVLink data={allusers} filename={"users.csv"} className="sort-btn">
            Export to CSV
          </CSVLink>
        </button>
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button sort-btn"
          table="excelTable"
          filename="excelFile"
          sheet="tablexls"
          buttonText="Export to Excel"
        />
      </div>
      {fetchLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="table-responsive">
          <input
            type="search"
            name="Search"
            value={userData}
            onChange={(e) => setUserData(e.target.value)}
            placeholder="Type to search..."
            className="form-control form-control-sm mb-2"
            style={{
              width: "800px",
              marginLeft: "20px",
              padding: 10,
              borderRadius: 20,
              marginTop: 10,
            }}
          />
          {renderTable()}
        </div>
      )}
    </div>
  );
}

export default Table;
