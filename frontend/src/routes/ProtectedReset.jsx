import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedReset = ({ redirectPath = '/' }) => {
  const emailEnviado = JSON.parse(localStorage.getItem('emailEnviado'));
  const usuarioCuenta = JSON.parse(localStorage.getItem('usuarioCuenta'));
  localStorage.removeItem('usuarioCuenta');
  if (!emailEnviado) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si está el email, renderiza el contenido protegido
  return <Outlet />;
};

export default ProtectedReset;
