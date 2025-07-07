import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/css/NavBarAdmin.css";
import NavBarAdmin from "../NavBarAdmin";

const CrearContenido = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState("pelicula"); // Por defecto se crea una película

  // Estado para guardar los datos del contenido que se va a crear
  const [contenido, setContenido] = useState({
    id_genero: "",
    titulo: "",
    descripcion: "",
    clasificacion_edad: "",
    duracion: "",
    fecha_lanzamiento: "",
    foto: "",
    trailer: ""
  });

  // Cada vez que cambia un input, actualizo el estado
  const handleChange = (e) => {
    setContenido({ ...contenido, [e.target.name]: e.target.value });
  };

  // Formateo la fecha para que coincida con el formato que espera la base de datos
  const formatFecha = (fecha) => {
    const d = new Date(fecha);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Armo el objeto con el contenido ya formateado
    const datos = {
      ...contenido,
      fecha_lanzamiento: formatFecha(contenido.fecha_lanzamiento),
    };

    // Según el tipo, armo la URL correspondiente
    const url = tipo === "pelicula" ? "http://localhost:3007/peliculas" : "http://localhost:3007/series";

    try {
      await axios.post(url, datos); // Envío el POST
      navigate("/ContenidoList"); // Redirijo a la lista una vez creado
    } catch (err) {
      console.error("Error al crear contenido:", err); // Si falla, lo muestro en consola
    }
  };

  return (
    <>
      <div>
        <NavBarAdmin />
        <div className="crear-contenido-container">
          <h2 className="crear-contenido-titulo">🎬 Crear Contenido</h2>
          <form onSubmit={handleSubmit} className="crear-contenido-form">
            
            {/* Tipo de contenido: película o serie */}
            <label className="crear-contenido-label">Tipo:</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="crear-contenido-select">
              <option value="pelicula">Película</option>
              <option value="serie">Serie</option>
            </select>

            {/* Campos del formulario */}
            <input name="id_genero" placeholder="ID Género" onChange={handleChange} className="crear-contenido-input" required />
            <input name="titulo" placeholder="Título" onChange={handleChange} className="crear-contenido-input" required />
            <input name="descripcion" placeholder="Descripción" onChange={handleChange} className="crear-contenido-input" required />
            <input name="clasificacion_edad" placeholder="Clasificación Edad" onChange={handleChange} className="crear-contenido-input" required />
            <input name="duracion" type="number" placeholder="Duración (min)" onChange={handleChange} className="crear-contenido-input" required />
            <input name="fecha_lanzamiento" type="datetime-local" onChange={handleChange} className="crear-contenido-input" required />
            <input name="foto" placeholder="URL Imagen" onChange={handleChange} className="crear-contenido-input" />
            <input name="trailer" placeholder="URL Trailer" onChange={handleChange} className="crear-contenido-input" />

            {/* Botón para enviar */}
            <button type="submit" className="crear-contenido-boton">Crear</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CrearContenido;
