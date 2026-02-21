import React from 'react';
import { useNavigate } from 'react-router-dom';

function LoginChoice() {
  const navigate = useNavigate();

  const styles = {
    container: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      textAlign: 'center',
      maxWidth: '400px',
      width: '100%'
    },
    title: { marginBottom: '30px', color: '#333' },
    btn: {
      display: 'block',
      width: '100%',
      padding: '15px',
      margin: '10px 0',
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      transition: 'transform 0.2s',
    },
    userBtn: { backgroundColor: '#007bff', color: 'white' },
    adminBtn: { backgroundColor: '#dc3545', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>CarDekho Portal</h1>
        <p style={{marginBottom: '20px', color: '#666'}}>Select your login type:</p>
        
        <button 
          style={{...styles.btn, ...styles.userBtn}} 
          onClick={() => navigate('/login')}
        >
          Customer Login
        </button>
        
        <button 
          style={{...styles.btn, ...styles.adminBtn}} 
          onClick={() => navigate('/admin-login')}
        >
          Admin Login
        </button>
      </div>
    </div>
  );
}

export default LoginChoice;