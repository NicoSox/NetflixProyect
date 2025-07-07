import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ redirectPath = '/' }) => {
  const usuarioCuenta = JSON.parse(localStorage.getItem('usuarioCuenta'));

  if (!usuarioCuenta || usuarioCuenta.rol_id !=2) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
