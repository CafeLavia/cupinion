import React from 'react';
import UserPermissionsPage from './UserPermissionsPage';

const SuperAdminsPage: React.FC = () => {
  // Render UserPermissionsPage with the super_admin tab selected by default
  // We'll use a prop or context if needed, but for now just render the same page
  return <UserPermissionsPage />;
};

export default SuperAdminsPage; 