import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/css/NavBarAdmin.css";
import NavBarAdmin from "../NavBarAdmin";

const EditarContenido = () => {
  const { tipo, id } = useParams();
  const navigate = useNavigate();
  const [contenido, setContenido] = useState(null);

  // Formateo para que el campo datetime-local reciba la fecha en formato adecuado
  const formatInputFecha = (fechaSQL) => {
    const date = new Date(fechaSQL);
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Formateo para guardar la fecha en formato que acepta la base de datos
  const parseFecha = (fecha) => {
    const d = new Date(fecha);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Al cargar, traigo el contenido según el tipo y el id que vienen por params
  useEffect(() => {
    const url = tipo === "pelicula" ? "peliculas" : "series";
    axios.get(`http://localhost:3007/${url}/${id}`).then(res => {
      const datos = res.data;
      // Ajusto la fecha para mostrarla en el input
      datos.fecha_lanzamiento = formatInputFecha(datos.fecha_lanzamiento);
      setContenido(datos);
    });
  }, [id, tipo]);

  // Cada vez que cambio un input, actualizo el estado local
  const handleChange = (e) => {
    setContenido({ ...contenido, [e.target.name]: e.target.value });
  };

  // Al enviar, formateo la fecha para la DB y mando los datos actualizados
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = tipo === "pelicula" ? "peliculas" : "series";
    const datos = {
      ...contenido,
      fecha_lanzamiento: parseFecha(contenido.fecha_lanzamiento)
    };

    try {
      await axios.put(`http://localhost:3007/${url}/${id}`, datos);
      navigate("/contenido");
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  // Mientras llega la data, muestro cargando
  if (!contenido) return <div className="editar-contenido-cargando">Cargando...</div>;

  return (
    <>
    <NavBarAdmin/>
    <div className="editar-contenido-container">
      <h2 className="editar-contenido-title">
        Editar {tipo === "pelicula" ? "Película" : "Serie"}
      </h2>
      <form className="editar-contenido-form" onSubmit={handleSubmit}>
        <input
          name="id_genero"
          placeholder="ID Género"
          value={contenido.id_genero}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="titulo"
          placeholder="Título"
          value={contenido.titulo}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={contenido.descripcion}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="clasificacion_edad"
          placeholder="Clasificación Edad"
          value={contenido.clasificacion_edad}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="duracion"
          type="number"
          placeholder="Duración"
          value={contenido.duracion}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="fecha_lanzamiento"
          type="datetime-local"
          value={contenido.fecha_lanzamiento}
          onChange={handleChange}
          required
          className="editar-contenido-input"
        />
        <input
          name="foto"
          placeholder="URL Imagen"
          value={contenido.foto}
          onChange={handleChange}
          className="editar-contenido-input"
        />
        <input
          name="trailer"
          placeholder="URL Trailer"
          value={contenido.trailer}
          onChange={handleChange}
          className="editar-contenido-input"
        />
        <button type="submit" className="editar-contenido-button">Actualizar</button>
      </form>
    </div>
    </>
  );
};

export default EditarContenido;

