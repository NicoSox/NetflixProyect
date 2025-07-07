import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = ({ redirectPath = '/' }) => {
  const usuarioCuenta = JSON.parse(localStorage.getItem('usuarioCuenta'));

  // Si no hay usuario en localStorage, redirige al inicio
  if (!usuarioCuenta) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si el rol no es 1, redirige a otra ruta (por ejemplo, ContenidoList)
  if (usuarioCuenta.rol_id !== 1) {
    return <Navigate to={redirectPath} replace />;
  }

  // Si pasó las validaciones, renderiza la ruta protegida
  return <Outlet />;
};

export default PrivateRoutes;
