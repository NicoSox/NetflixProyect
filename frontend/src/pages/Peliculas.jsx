import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore';
import MainPeliculas from '../components/MainPeliculas';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

const Peliculas = () => {
  // Traigo las películas del store y las funciones para manejarlas
  const peliculas = useStore((state) => state.peliculas);
  const agregarFavorito = useStore((state) => state.agregarFavorito);
  const quitarFavorito = useStore((state) => state.quitarFavorito);
  const obtenerPeliculas = useStore((state) => state.obtenerPeliculas);
  const buscarPeliculas = useStore((state) => state.buscarPeliculas);
  const usuario = useStore((state) => state.usuarioActual);

  const ITEMS_PER_PAGE = 6;

  // Mapeo de IDs de género a su nombre
  const generos = {
    1: 'terror',
    2: 'comedia',
    3: 'drama',
    4: 'Accion',
    5: 'romance',
    6: 'ciencia ficción',
    7: 'Fantasia',
    8: 'documental',
    9: 'animación',
    10: 'suspenso',
  };

  // Para llevar el control de en qué parte del carrusel estamos en cada categoría
  const [startIndexMap, setStartIndexMap] = useState(() =>
    Object.values(generos).reduce((acc, nombre) => {
      acc[nombre.toLowerCase()] = 0;
      return acc;
    }, {})
  );

  const [hoveredCarrusel, setHoveredCarrusel] = useState(null);

  // Uso el search param para saber si se está buscando algo
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const titulo = params.get('titulo');

  // Si hay título, busco; si no, cargo todas las pelis
  useEffect(() => {
    if (titulo) {
      buscarPeliculas(titulo);
    } else {
      obtenerPeliculas();
    }
  }, [location.search]);

  // Aseguro que cada peli tenga un ID y agrego el nombre del género como categoría
  const peliculasConCategoria = peliculas.map((p) => ({
    ...p,
    id: p.id_pelicula,
    categoria: generos[p.id_genero] || 'Otros',
  }));

  // Armo las categorías con sus pelis ya filtradas por género
  const categorias = Object.entries(generos).map(([id, nombre]) => {
    const idNum = parseInt(id);
    return {
      id: nombre.toLowerCase(),
      titulo: nombre,
      peliculas: peliculasConCategoria.filter((p) => p.id_genero === idNum),
    };
  });

  // Manejadores para avanzar o retroceder el carrusel
  const handleNext = (id, length) => {
    const maxIndex = Math.max(length - ITEMS_PER_PAGE, 0);
    setStartIndexMap((prev) => ({
      ...prev,
      [id]: prev[id] + ITEMS_PER_PAGE > maxIndex ? 0 : prev[id] + ITEMS_PER_PAGE,
    }));
  };

  const handlePrev = (id, length) => {
    const maxIndex = Math.max(length - ITEMS_PER_PAGE, 0);
    setStartIndexMap((prev) => ({
      ...prev,
      [id]: prev[id] - ITEMS_PER_PAGE < 0 ? maxIndex : prev[id] - ITEMS_PER_PAGE,
    }));
  };

  return (
    <>
      <Navbar />

      {/* Input de búsqueda (presiona Enter para redirigir con query param) */}
      <input
        type="text"
        name="titulobuscado"
        id="titulobuscado"
        placeholder="Buscar peliculas..."
        autoComplete="on"
        defaultValue={titulo || ''}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            window.location.href = `/peliculas?titulo=${encodeURIComponent(
              e.target.value.trim()
            )}`;
          }
        }}
      />

      {/* Si hay búsqueda, muestro mensaje con el término */}
      {titulo && <h2>Resultados para: <em>"{titulo}"</em></h2>}

      {titulo ? (
        // Si hay búsqueda, muestro todas las pelis encontradas en una sola categoría
        <MainPeliculas
          titulo="Resultados"
          visiblePeliculas={peliculasConCategoria}
          handleNext={() => {}}
          handlePrev={() => {}}
          agregarAmiLista={(pelicula) =>
            agregarFavorito({
              id_usuario: usuario?.id,
              id_pelicula: pelicula.id_pelicula || pelicula.id,
              fecha_agregado: new Date().toISOString(),
            })
          }
          quitarDeMiLista={(pelicula) => quitarFavorito(pelicula.id_favorito)}
          isHovered={hoveredCarrusel === 'resultados'}
          setIsHovered={(hover) => setHoveredCarrusel(hover ? 'resultados' : null)}
          startIndex={0}
          peliculasLength={peliculasConCategoria.length}
          previewPelicula={peliculasConCategoria[1] || null}
        />
      ) : (
        // Si no hay búsqueda, muestro todas las categorías con sus carruseles
        categorias.map(({ id, titulo: nombreCategoria, peliculas }) => {
          const start = startIndexMap[id];
          const visible = peliculas.slice(start, start + ITEMS_PER_PAGE);
          const previewPelicula = visible[1] || null;

          return (
            <MainPeliculas
              key={id}
              titulo={nombreCategoria}
              visiblePeliculas={visible}
              handleNext={() => handleNext(id, peliculas.length)}
              handlePrev={() => handlePrev(id, peliculas.length)}
              agregarAmiLista={(pelicula) =>
                agregarFavorito({
                  id_usuario: usuario?.id,
                  id_pelicula: pelicula.id_pelicula || pelicula.id,
                  fecha_agregado: new Date().toISOString(),
                })
              }
              quitarDeMiLista={(pelicula) => quitarFavorito(pelicula.id_favorito)}
              isHovered={hoveredCarrusel === id}
              setIsHovered={(hover) => setHoveredCarrusel(hover ? id : null)}
              startIndex={start}
              peliculasLength={peliculas.length}
              previewPelicula={previewPelicula}
            />
          );
        })
      )}
      <Footer />
    </>
  );
};

export default Peliculas;
