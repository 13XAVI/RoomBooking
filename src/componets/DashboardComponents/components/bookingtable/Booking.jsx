import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../Axios/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "../table/Table.scss";

function Booking(props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          process.env.REACT_APP_FETCH_USER_DATA_URL,
          data
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="table-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr className="">
                <th>Emp No</th>
                <th>FullNames</th>
                <th>MobileNo</th>
                <th>Email</th>
                <th>FailCount</th>
                <th>Position</th>
                <th>CreatedAt</th>
                <th>UpdatedAt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((data) => (
                  <tr key={data.user.userNo}>
                    <td>{data.user.empNo}</td>
                    <td>{data.user.fullnames}</td>
                    <td>{data.user.mobileNo}</td>
                    <td>{data.user.email}</td>
                    <td>{data.user.loginFailCount}</td>
                    <td>{data.user.position}</td>
                    <td>{data.user.createdAt}</td>
                    <td>{data.user.updatedAt}</td>
                    <td>{data.user.status}</td>
                    <td className="button-cell">
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon icon={faEye} className="s-icons" />
                      </button>
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon icon={faEdit} className="s-icons" />
                      </button>
                      <button type="button" className="btn btn-danger">
                        <FontAwesomeIcon
                          icon={faTrashAlt}
                          className="s-icons"
                        />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Booking;
