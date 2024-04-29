import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAuthority.scss";
import axiosInstance from "../../../../Axios/axios";
import useFetch from "../../../../hooks/useFetch";
import authService from "../../../Services/authService";
import { UserInputs } from "../FormSource";

const AddAuthority = ({ data, url }) => {
  const [credentials, setCredentials] = useState({
    authority: "",
  });
  const [userInp, setUserInp] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isUserListVisible, setIsUserListVisible] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [hideMessageTimeout, setHideMessageTimeout] = useState(null);
  const [hasReloaded, setHasReloaded] = useState(false);
  const navigate = useNavigate();

  const { data: userAuthority } = useFetch({
    url: process.env.REACT_APP_AUTHORITY_LIST,
  });
  const { data: UserList } = useFetch({
    url: process.env.REACT_APP_FETCH_USER_DATA_URL,
  });

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUserSuggestions("");
  }, []);

  const fetchUserSuggestions = async (input) => {
    try {
      const response = await axiosInstance.get(
        `${process.env.REACT_APP_USER_SUGGESTIONS_URL}?input=${input}`
      );
      if (response.status === 200) {
        setSuggestedUsers(response.data.users);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (err) {
      console.error("Error fetching user suggestions:", err);
    }
  };

  const handleUserSelect = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserInp(selectedUser.fullnames);
    setIsUserListVisible(false);
  };

  useEffect(() => {
    if (hasReloaded) {
      window.location.reload();
      setHasReloaded(false);
    }
  }, [hasReloaded]);

  const handleAuthority = async (e) => {
    e.preventDefault();

    try {
      if (selectedUser) {
        const response = await axiosInstance.post(
          process.env.REACT_APP_ADD_ROLE,
          {
            authority: parseInt(credentials.authority, 10),
            user: selectedUser.userNo,
          }
        );

        if (response.status === 200) {
          setSuccessMessage("Successfully saved");
          setHideMessageTimeout(
            setTimeout(() => {
              setSuccessMessage(null);
            }, 3000)
          );
          setHideMessageTimeout(
            setTimeout(() => {
              setSelectedUser(null);
            }, 3000)
          );
        } else {
          console.error("Unexpected response:", response);
        }
      } else {
        console.error("No user selected");
      }
    } catch (err) {
      console.error("Error during login:", err);
      const errorMessage = err.response?.data?.message || "Bad Credentials";
      setError(errorMessage);
    }

    if (hideMessageTimeout) {
      clearTimeout(hideMessageTimeout);
    }
  };

  const handleChange = async (e) => {
    const inputValue = e.target.value;
    setUserInp(inputValue);
    if (inputValue.trim() !== "") {
      await fetchUserSuggestions(inputValue);
      setIsUserListVisible(true);
    } else {
      setIsUserListVisible(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="Auth-form-container">
        <form className="form-container" onSubmit={handleAuthority}>
          <h2>Map Auth to users</h2>
          <select
            name="authority"
            onChange={(e) =>
              setCredentials({ ...credentials, authority: e.target.value })
            }
          >
            <option>Select Authority</option>
            {userAuthority &&
              userAuthority.map((item) => (
                <option key={item.authorityNo} value={item.authorityNo}>
                  {item.authorityName}
                </option>
              ))}
          </select>

          <input
            name="user"
            placeholder="Enter user name"
            value={userInp}
            onChange={handleChange}
          />
          {isUserListVisible && suggestedUsers.length > 0 && (
            <div>
              {suggestedUsers.map((user) => (
                <div key={user.userNo} onClick={() => handleUserSelect(user)}>
                  <div>{user.fullnames}</div>
                </div>
              ))}
            </div>
          )}
          {isUserListVisible &&
            UserList &&
            UserList.length > 0 &&
            UserList.filter((item) =>
              userInp.trim() === ""
                ? true
                : Object.values(item).some(
                    (value) =>
                      typeof value === "string" &&
                      value.toLowerCase().includes(userInp.toLowerCase())
                  )
            ).length > 0 && (
              <div>
                {UserList.filter((item) =>
                  userInp.trim() === ""
                    ? true
                    : Object.values(item).some(
                        (value) =>
                          typeof value === "string" &&
                          value.toLowerCase().includes(userInp.toLowerCase())
                      )
                ).map((user) => (
                  <div key={user.userNo} onClick={() => handleUserSelect(user)}>
                    <div>{user.fullnames}</div>
                  </div>
                ))}
              </div>
            )}
          {selectedUser && (
            <div>
              <div>{selectedUser.fullnames}</div>
            </div>
          )}
          {UserList &&
            UserList.length > 0 &&
            UserList.filter((item) =>
              userInp.trim() === ""
                ? true
                : Object.values(item).some(
                    (value) =>
                      typeof value === "string" &&
                      value.toLowerCase().includes(userInp.toLowerCase())
                  )
            ).length === 0 && <div>No user found</div>}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="green-btn"
            disabled={
              UserList &&
              UserList.length > 0 &&
              UserList.filter((item) =>
                userInp.trim() === ""
                  ? true
                  : Object.values(item).some(
                      (value) =>
                        typeof value === "string" &&
                        value.toLowerCase().includes(userInp.toLowerCase())
                    )
              ).length === 0
            }
          >
            Add Authority
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddAuthority;
