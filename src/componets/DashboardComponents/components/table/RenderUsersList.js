import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axiosInstance from '../../../../Axios/axios';
import useFetch from '../../../../hooks/useFetch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSVLink } from 'react-csv';
import authService from '../../../Services/authService';
import { faEdit, faPrint, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import UserEditPopup from './UserEditPopup';
import EditRoom from '../../../cards/Editroom';
import './Table.scss'
import { jwtDecode as jwt_decode } from 'jwt-decode';
import axios from 'axios';

function RenderUsers({ title }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [url, setUrl] = useState('');
  const [userData, setUserData] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [allusers, setAllusers] = useState([]);
  const [clickedUser, setClickedUser] = useState([])
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState([]);
  const [nonPaginateUSer, setNonPaginateUSer] = useState([])


  const navigate = useNavigate();

  const HandleList = (array) => {
    const list = [];
    const chunkSize = 10;
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      list.push(chunk);
    }
    return list;
  };
  const fetchData = useFetch({
    url: process.env.REACT_APP_FETCH_USER_DATA_URL,
  });
  useEffect(() => {

  }, [])

  useEffect(() => {
    if (fetchData.data) {
      setNonPaginateUSer(fetchData.data);
      const chunks = HandleList(fetchData.data);
      setAllusers(chunks);

    }
  }, [fetchData.data]);



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

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, allusers.length));
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
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

  const printList = () => {
    window.print();
  };

  const handleFormLoad = () => {
    setEditPopupVisible(!editPopupVisible);

  };

  const handleEdit = (item) => {
    console.log("user Item", item)
    setClickedUser(item);
    setEditPopupVisible(true)
  };

  const openDeleteDialog = (user) => {
    console.log("consoledUnitxcvbv", user)
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };


  const handleDelete = async (userToDelete) => {
    try {
      const deleteUrl = `${process.env.REACT_APP_DELETE_USER}/?staffID=${userToDelete.staffID}`;

      const response = await axiosInstance.delete(deleteUrl);

      if (response.status === 200) {
        setSuccessMessage('User deleted successfully.');

        const updatedUsers = nonPaginateUSer.filter((u) => u.staffID !== userToDelete.staffID);
        console.log(updatedUsers, "sdfas", userToDelete)
        setAllusers(HandleList(updatedUsers));
        setNonPaginateUSer(updatedUsers)



      } else {
        setError('An error occurred while trying to delete the user.');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message || 'An error occurred while trying to delete the user.');
    }
  };




  console.log("all user", allusers)

  return (

    <div>
      <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '5px' }}>{title}</h1>
      <div className='headingTable'>

        <div style={{ display: 'flex', alignItems: 'center', }}>
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
            <CSVLink data={allusers} filename={'users.csv'} className="sort-btn">
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
        <input
          type="search"
          name="Search"
          value={userData}
          onChange={(e) => setUserData(e.target.value)}
          placeholder="Type to search..."
          className="form-control form-control-sm mb-2"
          style={{ width: '500px', marginLeft: '20px', padding: 10, borderRadius: 20, marginTop: 10 }}
        />
      </div>
      <div className="card">


        <div className="table-responsive">

          <table id="excelTable" className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Staff ID</th>
                <th>Full Name</th>
                <th>Employee Number</th>
                <th>User Number</th>
                <th>Mobile Number</th>
                <th>Email</th>
                <th>User Status</th>
                <th>Unit</th>
                <th>Department</th>
                <th>Login Fail Count</th>
                <th>Position</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allusers[page - 1] && allusers[page - 1]
                .filter((item) => !item.isDeleted)
                .filter((item) =>
                  userData.trim() === ''
                    ? true
                    : Object.values(item).some(
                      (value) =>
                        typeof value === 'string' && value.toLowerCase().includes(userData.toLowerCase())
                    )
                )
                .map((item) => (


                  <tr key={item.staffID}>
                    <td>{item.staffID}</td>
                    <td>{item.fullnames}</td>
                    <td>{item.empNo}</td>
                    <td>{item.userNo}</td>
                    <td>{item.mobileNo}</td>
                    <td>{item.email}</td>
                    <td>{item.userStatus}</td>
                    <td>{item.units && item.units.unitName}</td>
                    <td>{item.position}</td>
                    <td>{item.loginFailCount}</td>
                    <td>{item.position}</td>
                    <td>{item.createdAt}</td>
                    <td>{item.updatedAt}</td>
                    <td>{item.username}</td>
                    <td className="button-cell">
                      <button type="button" className="btn btn-success" onClick={() => handleEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} className="s-icons" />
                      </button>
                      <button type="button" className="btn btn-danger" onClick={() => openDeleteDialog(item)}>
                        <FontAwesomeIcon icon={faTrashAlt} className="s-icons" />
                      </button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <button onClick={handlePreviousPage} disabled={page === 1}>
            Previous
          </button>
          <span style={{ marginTop: "20px" }}>Page {page} of {allusers.length}</span>
          <button onClick={handleNextPage} disabled={page === allusers.length}>
            Next
          </button>

          {editPopupVisible && (
            <Dialog open={editPopupVisible} onClose={handleFormLoad} maxWidth="80%" >
              <DialogContent>


                <div title={title}>

                  <UserEditPopup title="Edit Room" clickedUser={clickedUser} />


                </div>

              </DialogContent>
            </Dialog>
          )}

          <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
            <DialogContent>
              <div>Are you sure you want to delete this user?</div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => {
                  handleDelete(userToDelete);
                  closeDeleteDialog();
                }}>Delete</button>
                <button onClick={closeDeleteDialog} style={{ marginLeft: '10px' }}>Cancel</button>
              </div>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>


  );
}

export default RenderUsers;
