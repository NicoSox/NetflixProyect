import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '.././styles/css/NavBarAdmin.css';

const NavBarAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Función para cerrar sesión: limpia el localStorage y vuelve al login
  const cerrarSesion = () => {
    // Limpia todas las claves relacionadas con usuarios y cuenta
    const clavesAEliminar = [
      "token",
      "usuario",
      "usuarioCuenta",
      "usuarioActivo",
      "usuariosIds",
      "cuenta",
    ];

    clavesAEliminar.forEach((clave) => localStorage.removeItem(clave));

    navigate("/");
  };

  // Función para volver a la página anterior en el historial
  const volverAtras = () => {
    navigate('/contenidolist');
  };
  // Definimos cuál es la ruta "principal" o "de inicio"
  const primeraPantalla = '/contenidolist'; 

  // Aquí verificamos si estamos en otra ruta distinta a la principal
  // Solo entonces mostramos el botón de volver atrás
  const mostrarBotonVolver = location.pathname !== primeraPantalla;

  return (
    <nav className="admin-navbar">
      {/* Mostrar el botón "← Volver" solo si no estamos en la pantalla principal */}
      {mostrarBotonVolver && (
        <button
          className="btn-back"
          onClick={volverAtras}
          aria-label="Volver atrás"
          title="Volver atrás"
        >
          ← Volver
        </button>
      )}

      <h1 className="admin-title">Panel de Administrador</h1>

      {/* Botón para cerrar sesión */}
      <button className="btn-logout" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </nav>
  );
};

export default NavBarAdmin;
