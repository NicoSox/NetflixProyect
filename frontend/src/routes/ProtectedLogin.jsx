import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLogin = () => {
  useEffect(() => {
    localStorage.removeItem('usuarioCuenta');
    localStorage.removeItem('emailEnviado')
  }, []);

  return <Outlet />;
};

export default ProtectedLogin;
