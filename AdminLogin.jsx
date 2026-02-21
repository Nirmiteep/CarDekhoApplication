import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function AdminLogin() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "admin@cardekho.com", 
    password: "" 
  });

  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ loading: false, error: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.token || (typeof data.message === 'string' && data.message.length > 20 ? data.message : null);

      if (!token) {
        throw new Error("Server verified password but didn't send a token.");
      }

      localStorage.setItem('token', token);
      
      alert("Admin Login Verified!");
      navigate("/admin/home");

    } catch (err) {
      console.error("Login Error:", err);
 
      if (err.message.includes("401") || err.message.includes("not found")) {
        setStatus({ loading: false, error: "Account not found. Go to /login and register 'admin@cardekho.com' first." });
      } else {
        setStatus({ loading: false, error: err.message });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{color: '#dc3545'}}>Admin Portal</h2>
        
        {status.error && <div style={styles.error}>{status.error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange} 
              required style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input 
              type="password" name="password" value={formData.password} onChange={handleChange} 
              required style={styles.input} placeholder="Enter your password"
            />
          </div>

          <button type="submit" style={styles.button} disabled={status.loading}>
            {status.loading ? "Verifying..." : "Login Securely"}
          </button>
        </form>

        <div style={styles.footer}>
          <p>Has the admin account been created?</p>
          <button onClick={() => navigate('/login')} style={styles.linkBtn}>
            No, Register Account Now
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f0f2f5" },
  formCard: { width: "350px", padding: "2rem", borderRadius: "8px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)", backgroundColor: "white", textAlign: "center", borderTop: "4px solid #dc3545" },
  form: { display: "flex", flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  inputGroup: { display: "flex", flexDirection: "column", textAlign: "left" },
  input: { padding: "0.8rem", borderRadius: '4px', border: '1px solid #ccc', marginTop: '0.25rem' },
  button: { padding: "0.8rem", borderRadius: '4px', border: 'none', backgroundColor: '#dc3545', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  error: { color: "#721c24", backgroundColor: "#f8d7da", padding: "10px", borderRadius: "4px", marginBottom: "10px", fontSize: "14px" },
  footer: { marginTop: '20px', fontSize: '14px', color: '#666' },
  linkBtn: { background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }
};

export default AdminLogin;