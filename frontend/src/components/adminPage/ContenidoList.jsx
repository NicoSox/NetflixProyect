import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../../styles/css/NavBarAdmin.css';
import NavBarAdmin from "../NavBarAdmin";

const ContenidoList = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [series, setSeries] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchContenido = async () => {
      try {
        const resPeliculas = await axios.get("http://localhost:3007/peliculas");
        const resSeries = await axios.get("http://localhost:3007/series");
        setPeliculas(resPeliculas.data);
        setSeries(resSeries.data);
      } catch (error) {
        console.error("Error al obtener contenido:", error);
      }
    };

    fetchContenido();
  }, []);

  const eliminarContenido = async (tipo, id) => {
    const url = tipo === "pelicula" ? "peliculas" : "series";
    const confirmacion = window.confirm(`¿Seguro que querés eliminar esta ${tipo}?`);
    if (!confirmacion) return;

    try {
      await axios.delete(`http://localhost:3007/${url}/${id}`);

      if (tipo === "pelicula") {
        setPeliculas(prev => prev.filter(p => p.id_pelicula !== id));
      } else {
        setSeries(prev => prev.filter(s => s.id_serie !== id));
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Hubo un error al intentar eliminar el contenido.");
    }
  };

  // Filtrado por búsqueda (insensible a mayúsculas/minúsculas)
  const peliculasFiltradas = peliculas.filter(p =>
    p.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );
  const seriesFiltradas = series.filter(s =>
    s.titulo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <NavBarAdmin />

      <div className="card-list-container">
        <h2 className="card-list-title">🎬 Películas y 📺 Series</h2>

        {/* Input búsqueda con lupa */}
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar películas y series..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
          <i className="bi bi-search icono-lupa" />
        </div>

        <Link className="card-list-create-link" to="/contenido/crear">
          Crear nuevo contenido
        </Link>

        {/* Películas filtradas */}
        <h3 className="subtitulo">Películas</h3>
        <ul className="card-list">
          {peliculasFiltradas.length === 0 ? (
            <li className="sin-resultados">No se encontraron películas</li>
          ) : (
            peliculasFiltradas.map(p => (
              <li key={`pelicula-${p.id_pelicula}`} className="card-list-item">
                <span className="card-list-item-title">🎞️ {p.titulo}</span>
                <Link
                  className="card-list-item-link"
                  to={`/contenido/editar/pelicula/${p.id_pelicula}`}
                >
                  ✏️ Editar
                </Link>
                <button
                  className="card-list-item-button"
                  onClick={() => eliminarContenido("pelicula", p.id_pelicula)}
                >
                  🗑️ Eliminar
                </button>
              </li>
            ))
          )}
        </ul>

        {/* Series filtradas */}
        <h3 className="subtitulo">Series</h3>
        <ul className="card-list">
          {seriesFiltradas.length === 0 ? (
            <li className="sin-resultados">No se encontraron series</li>
          ) : (
            seriesFiltradas.map(s => (
              <li key={`serie-${s.id_serie}`} className="card-list-item">
                <span className="card-list-item-title">📺 {s.titulo}</span>
                <Link
                  className="card-list-item-link"
                  to={`/contenido/editar/serie/${s.id_serie}`}
                >
                  ✏️ Editar
                </Link>
                <button
                  className="card-list-item-button"
                  onClick={() => eliminarContenido("serie", s.id_serie)}
                >
                  🗑️ Eliminar
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContenidoList;
