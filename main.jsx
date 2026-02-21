import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import App from './App.jsx'; 
import AdminLayout from './Admin/AdminLayout.jsx'; 
import LoginChoice from './components/LoginChoice.jsx';
import LoginRegister from './components/LoginRegister.jsx';
import Home from './components/Home.jsx';
import Viewcars from './components/Viewcars.jsx';
import Cart from './components/Cart.jsx';
import AdminLogin from './Admin/AdminLogin.jsx';
import AdminHome from './Admin/AdminHome.jsx';
import AddCar from './components/AddCar.jsx'; 
import AdminEdit from './Admin/AdminEdit.jsx';
import ManageUsers from './Admin/ManageUsers.jsx';

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <LoginChoice />,
  },
  {
    path: "login",
    element: <LoginRegister />,
  },
  {
    path: "admin-login",
    element: <AdminLogin />,
  },

  {
    path: "user",
    element: <App />, 
    children: [
      { index: true, element: <Navigate to="home" replace /> }, 
      { path: "home", element: <Home /> },
      { path: "cars", element: <Viewcars role="user" /> }, 
      { path: "cart", element: <Cart /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />, 
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: "home", element: <AdminHome /> },
      { path: "cars", element: <Viewcars role="admin" /> }, 
      { path: "add-car", element: <AddCar /> },
      { path: "users", element: <ManageUsers /> },
      {path: "edit-car/:id", element: <AdminEdit />}
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);