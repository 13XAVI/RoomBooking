import React from "react";
import "./home.css";
import { image0, image2, image3, image4, image5 } from "../images";
import Navbar from "../navigationBar/navbar";
import { Link } from "react-router-dom";

function Home({ image0 }) {
  return (
    <div className="content">
      <div className="landing-container">
        <Navbar />
        <div className="hero-section">
          <h1 className="hero-text"> Find Some Perfect Rooms </h1>
          <h3 className="hero-text2">
            Use our combined search bar to easily find rooms based on your
            preferences,
            <br /> such as location, date, and room type.
          </h3>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Type Here...."
              className="search-input"
            />
            <button className="search-button">
              <Link to="/Login" className="search-Link">
                Search Room
              </Link>
            </button>
          </div>

          <div className="image-container">
            <img src={image2} alt="Image 3" className="her0-image3" />
          </div>
        </div>

        <div className="features-section">
          <div className="feature">
            <img src={image4} alt="image 1" />
            <h2>Feature 1 Title</h2>
            <p>Feature 1 description goes here.</p>
          </div>
          <div className="feature">
            <img src={image5} alt="image 2" />
            <h2>Feature 2 Title</h2>
            <p>Feature 2 description goes here.</p>
          </div>
          <div className="feature">
            <img src={image2} alt="image 3" />
            <h2>Feature 3 Title</h2>
            <p>Feature 3 description goes here.</p>
          </div>
        </div>

        <div className="booking-section">
          <div className="booking-text">
            <div className="title">Looking For a Room to Book ? </div>
            <button className="book-now-button">Book Now</button>
          </div>
        </div>

        <div className="footers">
          <p>&copy; 2023 Rwanda Revenue Authority. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
