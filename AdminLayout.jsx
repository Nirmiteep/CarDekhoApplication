import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNav from './AdminNav';

function AdminLayout() {
  return (
    <div>
      <AdminNav />
      <Outlet />
    </div>
  );
}

export default AdminLayout;