// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase';

const PrivateRoute = ({ children }) => {
  const user = auth.currentUser;

  if (!user) {
    // Si pas connecté, redirige vers login
    return <Navigate to="/login" />;
  }

  // Sinon affiche le composant enfant
  return children;
};

export default PrivateRoute;
