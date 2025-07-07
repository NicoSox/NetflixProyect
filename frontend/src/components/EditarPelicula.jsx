import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditarPelicula = () => {
  // Obtiene el ID de la película desde la URL
  const { id } = useParams();

  // Hook para redireccionar al terminar
  const navigate = useNavigate();

  // Estado para almacenar los datos de la película
  const [pelicula, setPelicula] = useState({
    id_genero: "",
    titulo: "",
    descripcion: "",
    clasificacion_edad: "",
    duracion: "",
    fecha_lanzamiento: "",
    foto: "",
    trailer: ""
  });

  // Formatea fecha desde formato SQL (ej: 2025-06-30 13:00:00) a datetime-local (ej: 2025-06-30T13:00)
  const formatDatetimeLocal = (fechaSQL) => {
    const date = new Date(fechaSQL);
    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Convierte datetime-local (del input) a formato MySQL
  const parseFechaLanzamiento = (fecha) => {
    const date = new Date(fecha);
    const pad = (n) => String(n).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  // Al cargar el componente, se pide la película por ID
  useEffect(() => {
    axios.get(`http://localhost:3007/peliculas/${id}`)
      .then(res => {
        const peliculaData = res.data;

        // Se formatea la fecha antes de cargar en el formulario
        setPelicula({
          ...peliculaData,
          fecha_lanzamiento: formatDatetimeLocal(peliculaData.fecha_lanzamiento)
        });
      })
      .catch(err => {
        console.error("Error al obtener película:", err);
      });
  }, [id]);

  // Maneja el cambio en cualquier input del formulario
  const handleChange = (e) => {
    setPelicula({ ...pelicula, [e.target.name]: e.target.value });
  };

  // Al enviar el formulario, se actualiza la película
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Se convierte la fecha al formato esperado por MySQL
    const data = {
      ...pelicula,
      fecha_lanzamiento: parseFechaLanzamiento(pelicula.fecha_lanzamiento)
    };

    try {
      // Envío de la actualización al backend
      await axios.put(`http://localhost:3007/peliculas/${id}`, data);

      // Redirecciona a la lista de películas luego de guardar
      navigate("/peliculas");
    } catch (err) {
      console.error("Error al actualizar película:", err);
    }
  };

  return (
    <div>
      <h2>Editar Película</h2>

      {/* Formulario para editar los campos de la película */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="id_genero"
          value={pelicula.id_genero}
          onChange={handleChange}
          placeholder="ID Género"
          required
        />
        <input
          type="text"
          name="titulo"
          value={pelicula.titulo}
          onChange={handleChange}
          placeholder="Título"
          required
        />
        <input
          type="text"
          name="descripcion"
          value={pelicula.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          required
        />
        <input
          type="text"
          name="clasificacion_edad"
          value={pelicula.clasificacion_edad}
          onChange={handleChange}
          placeholder="Clasificación edad"
          required
        />
        <input
          type="number"
          name="duracion"
          value={pelicula.duracion}
          onChange={handleChange}
          placeholder="Duración (minutos)"
          required
        />

        {/* Input con tipo datetime-local para elegir fecha y hora */}
        <input
          type="datetime-local"
          name="fecha_lanzamiento"
          value={pelicula.fecha_lanzamiento}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="foto"
          value={pelicula.foto}
          onChange={handleChange}
          placeholder="URL imagen"
        />
        <input
          type="text"
          name="trailer"
          value={pelicula.trailer}
          onChange={handleChange}
          placeholder="URL trailer"
        />

        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default EditarPelicula;
