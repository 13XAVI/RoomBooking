import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../Axios/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPrint, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import RoomEditPopup from './RoomEditPopup';
import { Dialog, DialogContent } from '@mui/material';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import { CSVLink } from 'react-csv';
import authService from '../../../Services/authService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import useFetch from '../../../../hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function RenderRoom({ title }) {
  const [successMessage, setSuccessMessage] = useState(null);
  const [roomData, setRoomData] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [clickedRoom, setClickedRoom] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);


  const navigate = useNavigate();


  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, roomData.length));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_FETCH_ROOMS);
        setRoomData(response.data);
        console.log("Rooms dataa", response.data)
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, []);

  const openDeleteDialog = (room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRoomToDelete(null);
  };


  const handleFormLoad = () => {
    setEditPopupVisible(!editPopupVisible);

  };

  const handleEditPopupUpdate = () => {

  };

  const HandleSumitionForm = () => {


  };


  const HandleReturn = () => {
    try {
      const storedToken = authService.getToken();

      if (!storedToken) {
        console.error('Token is null or undefined');
        return;
      }

      const payLoad = jwt_decode(storedToken);

      if (payLoad) {
        payLoad?.authorities === 'admin' ? navigate('/Dashboard') : navigate('/RequestRom');
      } else {
        console.error('Token is null');
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const handleSort = () => {
    const sortedData = [...roomData[page - 1]];
    sortedData.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });
    setRoomData((prev) => {
      const newroomData = [...prev];
      newroomData[page - 1] = sortedData;
      return newroomData;
    });
  };

  const printList = () => {
    window.print();
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setClickedRoom(item)
    setRoomId(item.roomID);
    setEditPopupVisible(true);

  };

  const handleDelete = async (clickedRoom) => {
    console.log("tem ", clickedRoom)
    // setSelectedItem(item);
    //   setClickedRoom(item)
    //   setRoomId(item.roomID);
    const deleteUrl = `${process.env.REACT_APP_DELETE_ROOM}/?roomID=${clickedRoom.roomId}`;
    try {
      const response = await fetch(deleteUrl, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getToken()}`
        },
      });

      if (response.status === 200) {
        setSuccessMessage('User deleted successfully.');
      } else {
        setError('An error occurred while trying to delete the user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'An error occurred while trying to delete the user.');
    }
  };


  return (
    <div className="container mt-4">
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
        <CSVLink data={roomData} filename={'users.csv'} className="sort-btn">
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
      <div className="row">
        <div className="col">
          <h2>Room Data</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-striped" id="excelTable">
              <thead className="thead-dark">
                <tr>
                  <th>Room Location</th>
                  <th>Description</th>
                  <th>Capacity</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {roomData.map(room => (
                  <tr key={room.roomID}>
                    <td>{room.roomLocation}</td>
                    <td>{room.roomDescription}</td>
                    <td>{room.capacity}</td>
                    <td><img src={room.imagePath} alt="Room" className="img-fluid" style={{ maxWidth: '100px' }} /></td>
                    <td>{room.status === 1 ? "Active" : "Inactive"}</td>
                    <td className="button-cell">
                      {/* <button type="button" className="btn btn-success mr-2" onClick={() => handleEdit(room)}>
                        <FontAwesomeIcon icon={faEdit} className="s-icons" />
                      </button> */}
                      <button type="button" className="btn btn-danger" onClick={() => openDeleteDialog(room)}>

                        <FontAwesomeIcon icon={faTrashAlt} className="s-icons" />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {editPopupVisible && (
              <Dialog open={editPopupVisible} onClose={handleFormLoad} maxWidth="60%" >
                <DialogContent>

                  <form onSubmit={HandleSumitionForm} onLoad={(e) => e.target}>
                    <div title={title}>
                      {console.log("Room ID", roomId)}
                      <RoomEditPopup title="Edit Room" roomId={roomId} onUpdate={handleEditPopupUpdate} clickedRoom={clickedRoom} />

                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        {/* <span style={{ marginTop:"20px"}}>Page {page} of {roomData.length}</span> */}
        <button onClick={handleNextPage} disabled={page === roomData.length}>
          Next
        </button>
      </div>
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogContent>
          <div>Are you sure you want to delete this Room?</div>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => {
              handleDelete(clickedRoom);
              closeDeleteDialog();
            }}>Delete</button>
            <button onClick={closeDeleteDialog} style={{ marginLeft: '10px' }}>Cancel</button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default RenderRoom;
