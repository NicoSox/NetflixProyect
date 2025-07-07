import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useStore from '../store/useStore.js';
import MainSeries from '../components/MainSeries';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

const Series = () => {
  // Traigo los estados y acciones necesarios del store
  const series = useStore((state) => state.series);
  const agregarAmiLista = useStore((state) => state.agregarAmiLista);
  const usuario = useStore((state) => state.usuarioActual);
  const agregarFavorito = useStore((state) => state.agregarFavorito);
  const quitarFavorito = useStore((state) => state.quitarFavorito);
  const obtenerSeries = useStore((state) => state.obtenerSeries);
  const buscarSeries = useStore((state) => state.buscarSeries);

  const ITEMS_PER_PAGE = 6;

  // Defino los géneros con sus nombres
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

  // Control del carrusel por categoría
  const [startIndexMap, setStartIndexMap] = useState(() =>
    Object.values(generos).reduce((acc, nombre) => {
      acc[nombre.toLowerCase()] = 0;
      return acc;
    }, {})
  );

  const [hoveredCarrusel, setHoveredCarrusel] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  // Cambio de estilo en el header cuando hago scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Me fijo si hay una búsqueda por query param
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const titulo = params.get('titulo');

  // Si hay título, hago una búsqueda. Si no, cargo todas las series.
  useEffect(() => {
    if (titulo) {
      buscarSeries(titulo);
    } else {
      obtenerSeries();
    }
  }, [location.search]);

  // Aseguro que cada serie tenga una propiedad 'id' y le agrego el nombre del género
  const seriesConCategoria = series.map((s) => ({
    ...s,
    id: s.id_serie,
    categoria: generos[s.id_genero] || 'Otros',
  }));

  // Organizo las series por categoría
  const categorias = Object.entries(generos).map(([id, nombre]) => {
    const idNum = parseInt(id);
    return {
      id: nombre.toLowerCase(),
      titulo: nombre,
      series: seriesConCategoria.filter(s => s.id_genero === idNum),
    };
  });

  // Manejadores para el paginado de cada carrusel
  const handleNext = (id, length) => {
    const maxIndex = Math.max(length - ITEMS_PER_PAGE, 0);
    setStartIndexMap(prev => ({
      ...prev,
      [id]: prev[id] + ITEMS_PER_PAGE > maxIndex ? 0 : prev[id] + ITEMS_PER_PAGE
    }));
  };

  const handlePrev = (id, length) => {
    const maxIndex = Math.max(length - ITEMS_PER_PAGE, 0);
    setStartIndexMap(prev => ({
      ...prev,
      [id]: prev[id] - ITEMS_PER_PAGE < 0 ? maxIndex : prev[id] - ITEMS_PER_PAGE
    }));
  };

  return (
    <>
      <NavBar />
      <div style={{
        position: 'relative',
        backgroundColor: '#141414',
        paddingTop: '0px',
        minHeight: '100vh',
        width: '100%',
        margin: '0',
        padding: '0',
        overflowX: 'hidden',
      }}>
        {/* Banner superior fijo */}
        <div style={{ position: 'relative' }}>
          <img
            src="https://static1.srcdn.com/wordpress/wp-content/uploads/2023/12/squid-game_-the-challenge-season-2_-latest-news-cast-everything-we-know.jpg"
            alt="Banner"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '682px',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(20,20,20,1) 100%)'
          }} />
        </div>

        {/* Header fijo con input de búsqueda */}
        <div style={{
          position: 'fixed',
          top: 60,
          left: 0,
          right: 0,
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: '20px',
          color: 'white',
          fontSize: '38px',
          fontWeight: 500,
          zIndex: 99,
          backdropFilter: scrolled ? 'blur(4px)' : 'none',
          backgroundColor: scrolled ? '#141414' : 'transparent',
          transition: 'background-color 0.3s ease',
        }}>
          Series
          <label htmlFor="titulobuscado" style={{ color: 'white', marginLeft: '30px' }}>🔍</label>
          <input
            type="text"
            name="titulobuscado"
            id="titulobuscado"
            placeholder="Buscar series..."
            autoComplete="on"
            defaultValue={titulo || ''}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                window.location.href = `/series?titulo=${encodeURIComponent(e.target.value.trim())}`;
              }
            }}
            style={{
              margin: '10px 40px',
              padding: '10px 16px',
              fontSize: '16px',
              borderRadius: '6px',
              border: '1px solid #777',
              backgroundColor: '#1e1e1e',
              color: 'white',
              width: '300px',
            }}
          />
          {titulo && (
            <h2 style={{ color: 'white', marginLeft: '40px', zIndex: 10 }}>
              Resultados para: <em>"{titulo}"</em>
            </h2>
          )}
        </div>

        {/* Espacio para no tapar con el fixed */}
        <div style={{ height: '490px' }} />

        <div style={{ maxWidth: '1550px' }}>
          {/* Si hay búsqueda, muestro todas las series encontradas juntas */}
          {titulo ? (
            <MainSeries
              titulo="Resultados"
              visibleSeries={seriesConCategoria}
              handleNext={() => {}}
              handlePrev={() => {}}
              agregarAmiLista={(serie) =>
                agregarFavorito({
                  id_usuario: usuario?.id,
                  id_serie: serie.id_serie || serie.id,
                  fecha_agregado: null,
                })
              }
              quitarDeMiLista={(serie) => quitarFavorito(serie.id_favorito)}
              isHovered={hoveredCarrusel === 'resultados'}
              setIsHovered={(hover) => setHoveredCarrusel(hover ? 'resultados' : null)}
              startIndex={0}
              seriesLength={seriesConCategoria.length}
              previewSerie={seriesConCategoria[1] || null}
            />
          ) : (
            // Si no hay búsqueda, muestro por categoría
            categorias.map(({ id, titulo: nombreCategoria, series }) => {
              const start = startIndexMap[id];
              const visible = series.slice(start, start + ITEMS_PER_PAGE);
              const previewSerie = series[start + ITEMS_PER_PAGE] || null;

              return (
                <MainSeries
                  key={id}
                  titulo={nombreCategoria}
                  visibleSeries={visible}
                  handleNext={() => handleNext(id, series.length)}
                  handlePrev={() => handlePrev(id, series.length)}
                  agregarAmiLista={(serie) =>
                    agregarFavorito({
                      id_usuario: usuario?.id || 1,
                      id_serie: serie.id_serie || serie.id,
                      fecha_agregado: new Date().toISOString(),
                    })
                  }
                  quitarDeMiLista={(serie) => quitarFavorito(serie.id_favorito)}
                  isHovered={hoveredCarrusel === id}
                  setIsHovered={(hover) => setHoveredCarrusel(hover ? id : null)}
                  startIndex={start}
                  seriesLength={series.length}
                  previewSerie={previewSerie}
                />
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Series;
