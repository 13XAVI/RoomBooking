import React, { useState } from "react";
import "./Landing.scss";
import SideBar from "../components/sidebarDash/SideBar";
import Widget from "../components/widget/WidgetApp";
import Table from "../components/table/Table";
import AddAuthority from "../components/authority/AddAuthority";
import Role from "../components/authority/Role";
import Signup from "../../signupFiles/signup";
import AddRoomName from "../new/AddRoomName";

function Landing() {
  const [showSignup, setShowSignup] = useState(false);
  const [showRoom, setShowRoom] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowRoom(false); // Close the room form if signup is clicked
  };

  const handleRoomClick = () => {
    setShowRoom(!showRoom); // Toggle the showRoom state
    setShowSignup(false);
  };

  const handleRoomFormClose = () => {
    setShowRoom(false);
  };

  return (
    <div className="Landing">
      <SideBar
        onSignupClick={handleSignupClick}
        onRoomClick={handleRoomClick}
      />
      <div className="homeContent">
        <div className="widgets">
          <Widget type="User" />
          <Widget type="ARoom" />
        </div>
        <div className="listContainer">
          <div className="auths">
            {!showRoom && !showSignup && (
              <>
                <AddAuthority />
                <Role />
              </>
            )}
            {showSignup && <Signup />}
            {showRoom && <AddRoomName onClose={handleRoomFormClose} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
