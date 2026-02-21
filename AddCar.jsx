import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
let PLACEHOLDER_IMAGE = "https://placehold.co/600x360?text=Car+Preview";

let INITIAL_FORM = {
  name: "",
  brand: "",
  category: "",
  color: "",
  price: "",
  year: "",
  imageUrl: "",
};

const VEHICLE_CATEGORIES = ["Sedan", "SUV", "Hatchback", "Coupe", "Convertible", "Pickup"];

function AddCar() {
  let navigate = useNavigate();
  let [formData, setFormData] = useState(INITIAL_FORM);
  let [status, setStatus] = useState({ loading: false, error: null, success: false });

  let handleChange = (event) => {
    let { name, value } = event.target;
    setStatus((prev) => ({ ...prev, error: null, success: false }));

    if (name === "price" || name === "year") {
      let digitsOnly = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }));
      return;
    }


    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let validateForm = () => {
    if (!formData.name.trim() || !formData.brand.trim()) {
      return "Name and brand are required.";
    }
    if (!formData.category) {
      return "Please choose a category.";
    }
    if (!formData.color.trim()) {
      return "Please enter a color.";
    }
    if (!formData.price) {
      return "Price is required.";
    }

    let numericPrice = Number(formData.price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return "Price must be a positive number.";
    }

    let numericYear = Number(formData.year);
    let currentYear = new Date().getFullYear();
    if (!Number.isFinite(numericYear) || numericYear < 1990 || numericYear > currentYear + 1) {
      return `Model year must be between 1990 and ${currentYear + 1}.`;
    }

    return null;
  };

  let handleSubmit = async (event) => {
    event.preventDefault();
    let validationError = validateForm();
    if (validationError) {
      setStatus({ loading: false, error: validationError, success: false });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    let payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category.trim(),
      color: formData.color.trim(),
      price: String(formData.price),
      imageurl: formData.imageUrl.trim() || PLACEHOLDER_IMAGE,
      year: Number(formData.year),
    };

    try {
      let token = localStorage.getItem("token");
      let headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      let response = await fetch(`${API_BASE_URL}/cars`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message = await response.text();
        throw new Error(message || `Unable to add car`);
      }

      setStatus({ loading: false, error: null, success: true });
      setFormData(INITIAL_FORM);
    } catch (error) {
      setStatus({ loading: false, error: error.message || "Unexpected error", success: false });
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setStatus({ loading: false, error: null, success: false });
  };

  return (
    <>
      <style>{`
        body {
          background: linear-gradient(to right, #f8fafc, #eef2ff);
          font-family: "Inter", sans-serif;
        }

        .form-container {
          max-width: 720px;
          margin: 60px auto;
          padding: 40px;
          background: #ffffff;
          border-radius: 18px;
          box-shadow: 0 20px 45px rgba(0,0,0,0.08);
        }

        .form-container h2 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .form-container p {
          font-size: 14px;
          color: #666;
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: #333;
        }

        .form-input {
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid #ddd;
          font-size: 14px;
          transition: 0.2s ease;
          background: #fafafa;
        }

        .form-input:focus {
          outline: none;
          border-color: #2563eb;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .car-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .btn-primary:hover {
          background: #1e4fd8;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #333;
          padding: 10px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .btn-link {
          background: none;
          border: none;
          color: #2563eb;
          font-weight: 500;
          cursor: pointer;
        }

        .btn-link:hover {
          text-decoration: underline;
        }

        .message-error {
          background: #fee2e2;
          color: #991b1b;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .message-success {
          background: #dcfce7;
          color: #000000;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .preview-img {
          width: 100%;
          border-radius: 12px;
          border: 1px solid #eee;
          height: 220px;
          object-fit: cover;
          margin-top: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
      `}</style>

      <div className="form-container">
        <h2>Add a New Car</h2>
        <p>Provide the details of the car you want to publish.</p>

        {status.error && <div className="message-error">{status.error}</div>}
        {status.success && <div className="message-success">Car added successfully!</div>}

        <form onSubmit={handleSubmit}>
          {["name", "brand", "color"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
              <input
                name={field}
                className="form-input"
                value={formData[field]}
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              className="form-input"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {VEHICLE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Price *</label>
            <input
              name="price"
              className="form-input"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Model Year *</label>
            <input
              name="year"
              className="form-input"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              name="imageUrl"
              className="form-input"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="preview-img"
              />
            )}
          </div>

          <div className="car-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Clear
            </button>
            <button type="submit" className="btn-primary">
              {status.loading ? "Saving..." : "Add Car"}
            </button>
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <button className="btn-link" onClick={() => navigate("/admin/cars")}>
            Go to Manage Cars
          </button>
        </div>
      </div>
    </>
  );
}

export default AddCar;