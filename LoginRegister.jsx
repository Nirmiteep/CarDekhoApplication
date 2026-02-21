import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const LoginRegister = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ loading: false, error: null, success: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    const endpoint = isLogin ? `${API_BASE_URL}/login` : `${API_BASE_URL}/register`;

    try {
      const response = await fetch(endpoint, {
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

      if (response.ok) {
        setStatus({ loading: false, error: null, success: true });
        
        if (isLogin) {
          const token = data.token || (typeof data.message === 'string' && data.message.length > 20 ? data.message : null); 
          if(token) localStorage.setItem('token', token);
          alert("User Login Successful!");
          navigate('/user/home'); 
        } else {
          alert(data.message || "Registration Successful!");
          setIsLogin(true); 
        }
      } else {
        throw new Error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: false });
    }
  };

  function paste1(e){ e.preventDefault(); }

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2>{isLogin ? 'User Login' : 'User Register'}</h2>
        
        {status.error && <div style={styles.error}>{status.error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div style={styles.inputGroup}>
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required={!isLogin} style={styles.input} />
            </div>
          )}
          <div style={styles.inputGroup}>
            <label>Email</label>
            <input type="email" name="email" onPaste={paste1} value={formData.email} onChange={handleChange} required style={styles.input} />
          </div>
          <div style={styles.inputGroup}>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />
          </div>

          <button type="submit" style={styles.button} disabled={status.loading}>
            {status.loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.link}>
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
        <div style={styles.adminSwitch}>
          <p>Are you an Admin?</p>
          <button onClick={() => navigate('/admin-login')} style={styles.adminBtn}>
            Switch to Admin Login
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  formCard: { width: '300px', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', backgroundColor: 'white', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
  input: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', marginTop: '0.25rem' },
  button: { padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold' },
  error: { color: 'red', marginBottom: '10px' },
  toggleText: { marginTop: '1rem' },
  link: { color: '#007bff', cursor: 'pointer', textDecoration: 'underline' },
 
  adminSwitch: { marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #eee' },
  adminBtn: { padding: '8px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '5px', fontSize: '14px' }
};

export default LoginRegister;