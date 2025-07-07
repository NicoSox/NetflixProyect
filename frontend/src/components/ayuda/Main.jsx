import React from "react";
import "../../styles/css/CentroDeAyuda.css";

const Main = () => {
  return (
    <>
    <div className="ayuda-container">
      <header className="ayuda-header">
        <h1>Centro de ayuda</h1>
        <p>¿En qué podemos ayudarte?</p>
        <input
          type="text"
          placeholder="Buscar temas, por ejemplo: 'facturación', 'cancelar cuenta'..."
          className="ayuda-busqueda"
        />
      </header>

      <main className="ayuda-main">
        <h2>Temas populares</h2>
        <ul className="ayuda-temas">
          <li>🛑 ¿Cómo cancelo mi suscripción?</li>
          <li>💳 Problemas con el método de pago</li>
          <li>📺 No puedo reproducir una serie o película</li>
          <li>🔐 Olvidé mi contraseña</li>
          <li>📱 Cómo descargar contenido para ver sin conexión</li>
        </ul>
      </main>

      <footer className="ayuda-footer">
        <p>¿Todavía necesitás ayuda?</p>
        <a href="/contacto" className="btn-contacto">
          Contactar con soporte
        </a>
      </footer>
    </div>
    </>
  );
};

export default Main;
