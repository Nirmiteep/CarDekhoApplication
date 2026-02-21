import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function AdminNav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert("Admin Logged out");
    navigate('/'); 
  };

  return (
    <nav className="navbar" style={{backgroundColor: '#343a40'}}> 
      <div className="navbar-brand">CarDekho Admin</div>
      <div className="nav-links">
        <Link to="/admin/home" className="nav-link">Dashboard</Link>
        <Link to="/admin/cars" className="nav-link">Manage Cars</Link>
        <Link to="/admin/add-car" className="nav-link">Add New Car</Link>
        <Link to="/admin/users" className="nav-link">Manage Users</Link>
        <button 
          onClick={handleLogout} 
          className="nav-link" 
          style={{background:'none', border:'none', color:'white', cursor:'pointer', fontSize:'16px', fontWeight:'bold'}}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default AdminNav;