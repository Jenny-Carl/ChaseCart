import React from 'react';
import { Navigate } from 'react-router-dom';

const Admin = () => {
  return <Navigate to="/admin/dashboard" replace />;
};

export default Admin;