import React, { useState } from "react";
import Dashboard from "@mui/icons-material/Dashboard";
import "./SideBar.scss";
import { FaCircleUser } from "react-icons/fa6";
import { MdMeetingRoom } from "react-icons/md";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { CiSettings } from "react-icons/ci";
import { FaHands } from "react-icons/fa";
import { TbPower } from "react-icons/tb";
import { FaChartLine } from "react-icons/fa";
import { Link } from "react-router-dom";
import authService from "../../../Services/authService";

function SideBar({ onSignupClick, onRoomClick, onAddRoomClick }) {
  const [roomsExpanded, setRoomsExpanded] = useState(false);
  const [mytoken, setMytoken] = useState("");

  const toggleRoomsExpansion = () => {
    setMytoken(authService.getToken());
    setRoomsExpanded(!roomsExpanded);
  };

  return (
    <div className="sidebar">
      <strong className="logos">
        <span className="first">ROOM</span>
        <span className="second"> BOOKING</span>
        <span className="second"> SYSTEM</span>
      </strong>

      <div className="center">
        <ul>
          <p>MAIN</p>
          <li>
            <Link to="/Dashboard">
              <Dashboard className="icon" />
              <span className="Dashbord">Home</span>
            </Link>
          </li>
        </ul>
        <ul>
          <p className="title">List</p>
          <li>
            <a onClick={() => onSignupClick()}>
              <FaCircleUser className="icon" />
              <span className="Dashbord">Signup</span>
            </a>
          </li>
        </ul>
        <ul>
          <li className="roomdiv">
            <div onClick={toggleRoomsExpansion} className="expansion">
              <MdMeetingRoom className="icon" />
              <span className="Dashbord">Rooms</span>
            </div>
            {roomsExpanded && (
              <ul className="submenu">
                <li className="roomdiv-sub">
                  <Link
                    to="/Rooms/new-rooms"
                    onClick={() => onAddRoomClick && onAddRoomClick()}
                  >
                    <span className="submenu-item">Add Room </span>
                  </Link>
                  {/* <a onClick={() => onRoomClick()}>
                    <span className="submenu-item">Add Room Name</span>
                  </a> */}
                </li>
              </ul>
            )}
          </li>
        </ul>
        {/* <ul>
          <li>
            <Link to="/Bookings/new-bookings">
              <VscGitPullRequestNewChanges className="icon" />
              <span className="Dashbord">Book Request</span>
            </Link>
          </li>
        </ul> */}
        <ul>
          <li>
            <Link to="/Login" onClick={authService.logOut}>
              <TbPower className="icon" />
              <span className="Dashbord">Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
