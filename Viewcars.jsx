import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function Viewcars({ role }) { 
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/cars`);
      setCars(response.data || []);
    } catch (err) {
      console.error("Error fetching cars", err);
      setError("Unable to fetch cars.");
    } finally {
      setLoading(false);
    }
  };


  
  const handleAddToCart = async (car) => {
    console.log("Adding car:", car); 
    try {
      await axios.post(`${API_BASE_URL}/cart`, { car });

      let displayName = "Car";
      if (car.name && car.name !== "null") {
        displayName = car.name;
      } else if (car.brand) {
        displayName = car.brand;
      }

      alert(`${displayName} added to your cart!`);
    } catch (error) {
      console.error("Add to cart failed:", error);
      alert("Failed to add to cart.");
    }
  };
  const handleDeleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};
      
      await axios.delete(`${API_BASE_URL}/cars/${id}`, { headers });
      setCars(prev => prev.filter(car => car.id !== id)); 
      alert("Car deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete car");
    }
  };
  
  const handleEditCar = (id) => {
    navigate(`/admin/edit-car/${id}`);
  };
  const handleSortChange = (e) => setSort(e.target.value);
  
  const getSortedCars = () => {
    let sorted = [...cars];
    if (sort === "low") sorted.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "high") sorted.sort((a, b) => Number(b.price) - Number(a.price));
    return sorted;
  };

  if (loading) return <p style={{textAlign:'center', marginTop:'20px'}}>Loading...</p>;
  if (error) return <p style={{textAlign:'center', color:'red'}}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>{role === 'admin' ? "Manage Cars" : "Available Cars"}</h2>
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        Sort By Price: 
        <select onChange={handleSortChange} value={sort} style={{marginLeft: '10px', padding: '5px'}}>
          <option value="default">Default</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      <div className="cars-grid">
        {getSortedCars().map((car) => (
          <div key={car.id} className="car-card">
            <img
              src={car.image}
              alt={car.name}
              className="car-image"
              onError={(e) => { e.target.src = "https://placehold.co/300x200?text=No+Image"; }}
            />
            
            <h3>{car.brand} {car.name || ""}</h3>
            <p>Price: ₹ {Number(car.price).toLocaleString()}</p>
            
            <div className="car-actions">
              {role === 'user' && (
                <button className="btn-primary" onClick={() => handleAddToCart(car)}>
                  Add to Cart
                </button>
              )}
              {role === 'admin' && (
                <>
                  <button  style={{ backgroundColor: '#dc3545' }} onClick={() => handleDeleteCar(car.id)}>
                    Delete Car
                  </button>
                  <button  style={{ backgroundColor: '#56dc35' }} onClick={() => handleEditCar(car.id)}>
                    Edit Car
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Viewcars;