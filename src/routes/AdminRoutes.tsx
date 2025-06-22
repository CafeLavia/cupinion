import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        {/* Add other admin routes here */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes; 