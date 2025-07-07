import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/css/NavBar.css'

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => setShowSearch((prev) => !prev);
  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);

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

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/Home" className="navbar-logo-link">
          <img src="/assets/logo.png" alt="Logo" className="navbar-logo" />
        </Link>
        <Link to="/Home" className="nav-link">Inicio</Link>
        <Link to="/series" className="nav-link">Series</Link>
        <Link to="/peliculas" className="nav-link">Peliculas</Link>
        <Link to="/milista" className="nav-link">Mi lista</Link>
      </div>

      <div className="navbar-right">
        <button onClick={toggleSearch} aria-label="Buscar" className="icon-button">
          <i className="bi bi-search"></i>
        </button>
        {showSearch && (
          <div className="search-wrapper">
            <input type="text" className="search-input" placeholder="Buscar..." autoFocus />
          </div>
        )}

        <button className="icon-button" aria-label="Notificaciones">
          <i className="bi bi-bell"></i>
        </button>

        <div className="user-menu-wrapper">
          <button
            onClick={toggleUserMenu}
            className="icon-button user-icon-button"
            aria-haspopup="true"
            aria-expanded={showUserMenu}
          >
            <i className="bi bi-person-circle"></i>
          </button>
          {showUserMenu && (
            <div className="user-menu-dropdown" role="menu">
              <Link to="/cuenta" className="dropdown-item" role="menuitem">
                Cuenta
              </Link>
              <Link to="/Profiles" className="dropdown-item" role="menuitem">
                Perfiles
              </Link>
              <Link to="/CentroDeAyuda" className="dropdown-item" role="menuitem">
                Centro de ayuda
              </Link>
              <hr className="dropdown-divider" />
              <button onClick={cerrarSesion} className="dropdown-item logout-button" role="menuitem">
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
