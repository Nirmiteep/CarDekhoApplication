import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function ManageUsers() {
  let [users, setUsers] = useState([]);
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users`);
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading users...</p>;
  }

  if (error) {
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Manage Users</h2>

      {users.length === 0 ? (
        <p style={{ textAlign: "center" }}>No registered users.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "80%", margin: "20px auto", textAlign: "center" }}
        >
          <thead>
            <tr>
              
              <th>Email</th>
             
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
            
                <td>{user.email}</td>
              
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;
