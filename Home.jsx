import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-hero">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70"
          alt="Car Hero"
        />

        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Drive What Defines You</h1>
          <p>
            Explore premium vehicles curated for performance, comfort, and style.
          </p>
          <button className="hero-btn" onClick={() => navigate("/user/cars")}>
            Browse Cars
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;