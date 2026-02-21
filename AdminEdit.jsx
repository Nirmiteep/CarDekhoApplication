import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x360?text=Car+Preview";

const INITIAL_FORM = {
  name: "",
  brand: "",
  category: "",
  color: "",
  price: "",
  year: String(new Date().getFullYear()),
  imageUrl: "",
};

const VEHICLE_CATEGORIES = [
  "Sedan",
  "SUV",
  "Hatchback",
  "Coupe",
  "Convertible",
  "Pickup",
];

function AdminEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [initialValues, setInitialValues] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [previewError, setPreviewError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch car details
  useEffect(() => {
    if (!id) {
      setStatus({
        loading: false,
        error: "Missing car identifier.",
        success: false,
      });
      setIsFetching(false);
      return;
    }

    const controller = new AbortController();

    async function fetchCar() {
      try {
        const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            res.status === 404
              ? "Car not found."
              : "Unable to load car details."
          );
        }

        const car = await res.json();

        const nextForm = {
          name: car.name ?? "",
          brand: car.brand ?? "",
          category: car.category ?? "",
          color: car.color ?? "",
          price: car.price ? String(car.price) : "",
          year: car.year ? String(car.year) : INITIAL_FORM.year,
          imageUrl: car.image ?? "",
        };

        setFormData(nextForm);
        setInitialValues(nextForm);
      } catch (err) {
        if (err.name !== "AbortError") {
          setStatus({
            loading: false,
            error: err.message,
            success: false,
          });
        }
      } finally {
        setIsFetching(false);
      }
    }

    fetchCar();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!status.success) return;
    const timer = setTimeout(() => navigate("/admin/cars"), 1200);
    return () => clearTimeout(timer);
  }, [status.success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStatus((prev) => ({ ...prev, error: null, success: false }));

    if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        price: value.replace(/[^0-9]/g, ""),
      }));
      return;
    }

    if (name === "year") {
      setFormData((prev) => ({
        ...prev,
        year: value.replace(/[^0-9]/g, "").slice(0, 4),
      }));
      return;
    }

    if (name === "imageUrl") {
      setPreviewError(null);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateForm = () => {
    if (!formData.name.trim() || !formData.brand.trim())
      return "Car name and brand are required.";

    if (!formData.category)
      return "Please choose a category.";

    if (!formData.color.trim())
      return "Please enter a color.";

    const price = Number(formData.price);
    if (!price || price <= 0)
      return "Price must be a positive number.";

    const year = Number(formData.year);
    const currentYear = new Date().getFullYear();
    if (year < 1990 || year > currentYear + 1)
      return `Model year must be between 1990 and ${currentYear + 1}.`;

    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setStatus({ loading: false, error, success: false });
      return;
    }

    setStatus({ loading: true, error: null, success: false });

    const payload = {
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      category: formData.category.trim(),
      color: formData.color.trim(),
      price: String(formData.price),
      image: formData.imageUrl.trim() || PLACEHOLDER_IMAGE,
      year: Number(formData.year),
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/cars/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Update failed");
      }

      const updated = await res.json();

      const normalized = {
        name: updated.name ?? payload.name,
        brand: updated.brand ?? payload.brand,
        category: updated.category ?? payload.category,
        color: updated.color ?? payload.color,
        price: String(updated.price ?? payload.price),
        year: String(updated.year ?? payload.year),
        imageUrl: updated.image ?? payload.image,
      };

      setFormData(normalized);
      setInitialValues(normalized);
      setStatus({ loading: false, error: null, success: true });
    } catch (err) {
      setStatus({
        loading: false,
        error: err.message,
        success: false,
      });
    }
  };

  const handleReset = () => {
    setFormData(initialValues);
    setStatus({ loading: false, error: null, success: false });
    setPreviewError(null);
  };

  if (isFetching) {
    return <div className="form-container">Loading car details...</div>;
  }

  return (
    <div className="form-container">
      <h2>Edit Car</h2>

      {status.error && <div className="error">{status.error}</div>}
      {status.success && (
        <div className="success">Car updated successfully.</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Model Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="brand"
          placeholder="Brand"
          value={formData.brand}
          onChange={handleChange}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">Select category</option>
          {VEHICLE_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
        />

        <input
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
        />

        <input
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />

        <input
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />

        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            onError={() =>
              setPreviewError("Image could not be loaded.")
            }
          />
        )}
        {previewError && <p>{previewError}</p>}

        <button type="button" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" disabled={status.loading}>
          {status.loading ? "Saving..." : "Update"}
        </button>
      </form>
    </div>
  );
}

export default AdminEdit;

