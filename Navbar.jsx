import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Navbar() {
  const navigate = useNavigate();
 
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Logged out successfully");
   
    navigate('/'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">CarDekho</div>
      <div className="nav-links">
        <Link to="/user/home" className="nav-link">Home</Link>
        <Link to="/user/cars" className="nav-link">Cars</Link>
        <Link to="/user/cart" className="nav-link">Cart</Link>
        
        {isLoggedIn ? (
           <button 
             onClick={handleLogout} 
             className="nav-link" 
             style={{background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'16px', fontWeight:'bold'}}
           >
             Logout
           </button>
        ) : (
           <Link to="/" className="nav-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;