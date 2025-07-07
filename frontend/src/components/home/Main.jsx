import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore.js';
import MainSeries from '../MainSeries.jsx';
import MainPeliculas from '../MainPeliculas.jsx';
import Footer from '../Footer.jsx';
const Main = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const searchParam = params.get('titulo') || '';

  const [searchValue, setSearchValue] = useState(searchParam);

  const peliculas = useStore((state) => state.peliculas);
  const series = useStore((state) => state.series);
  const obtenerPeliculas = useStore((state) => state.obtenerPeliculas);
  const obtenerSeries = useStore((state) => state.obtenerSeries);
  const buscarSeries = useStore((state) => state.buscarSeries);
  const buscarPeliculas = useStore((state) => state.buscarPeliculas);
  const usuario = useStore((state) => state.usuarioActual);
  const agregarFavorito = useStore((state) => state.agregarFavorito);
  const quitarFavorito = useStore((state) => state.quitarFavorito);

  const ITEMS_PER_PAGE = 6;
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

  const [startIndexMap, setStartIndexMap] = useState(() =>
    Object.values(generos).reduce((acc, nombre) => {
      acc[nombre.toLowerCase()] = 0;
      return acc;
    }, {})
  );
  const [hoveredCarrusel, setHoveredCarrusel] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchParam) {
      buscarSeries(searchParam);
      buscarPeliculas(searchParam);
    } else {
      obtenerSeries();
      obtenerPeliculas();
    }
  }, [searchParam]);

  const peliculasConCategoria = peliculas.map((p) => ({
    ...p,
    id: p.id_pelicula,
    categoria: generos[p.id_genero] || 'Otros',
  }));

  const seriesConCategoria = series.map((s) => ({
    ...s,
    id: s.id_serie,
    categoria: generos[s.id_genero] || 'Otros',
  }));

  const seriesFiltradas = seriesConCategoria.filter((s) =>
    s.titulo.toLowerCase().includes(searchParam.toLowerCase())
  );

  const peliculasFiltradas = peliculasConCategoria.filter((p) =>
    p.titulo.toLowerCase().includes(searchParam.toLowerCase())
  );

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

  const categoriasSeries = Object.entries(generos).map(([id, nombre]) => {
    const idNum = parseInt(id);
    return {
      id: nombre.toLowerCase(),
      titulo: nombre,
      series: seriesConCategoria.filter((s) => s.id_genero === idNum),
    };
  });

  const categoriasPeliculas = Object.entries(generos).map(([id, nombre]) => {
    const idNum = parseInt(id);
    return {
      id: nombre.toLowerCase(),
      titulo: nombre,
      peliculas: peliculasConCategoria.filter((p) => p.id_genero === idNum),
    };
  });

  return (
    <>
    
    
    <div style={{ position: 'relative', backgroundColor: '#141414', minHeight: '100vh', overflowX: 'hidden', paddingTop: '0px',  margin: '0',padding: '0' }}>
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
        
      </div>
      

      <div
        style={{
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
        }}
      >
        Inicio
        <label htmlFor="titulobuscado" style={{ color: 'white', marginLeft: '30px' }}>🔍</label>
        <input
          type="text"
          name="titulobuscado"
          id="titulobuscado"
          placeholder="Buscar series o películas..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              navigate(`/series?titulo=${encodeURIComponent(searchValue.trim())}`);
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
        {searchParam && (
          <h2 style={{ color: 'white', marginLeft: '40px', zIndex: 10 }}>
            Resultados para: <em>"{searchParam}"</em>
          </h2>
        )}
      </div>
      

      <div style={{ height: '490px' }} />
      <div style={{ maxWidth: '1550px' }}>
        {(searchParam ? (
          <MainSeries
            titulo="Resultados"
            visibleSeries={seriesFiltradas}
            handleNext={() => {}}
            handlePrev={() => {}}
            agregarAmiLista={(serie) =>
              agregarFavorito({
                id_usuario: usuario?.id,
                id_serie: serie.id_serie || serie.id,
                fecha_agregado: new Date().toISOString(),
              })
            }
            quitarDeMiLista={(serie) => quitarFavorito(serie.id_favorito)}
            isHovered={hoveredCarrusel === 'resultados'}
            setIsHovered={(hover) => setHoveredCarrusel(hover ? 'resultados' : null)}
            startIndex={0}
            seriesLength={seriesFiltradas.length}
            previewSerie={seriesFiltradas[1] || null}
          />
        ) : (
          categoriasSeries.map(({ id, titulo, series }) => {
            const start = startIndexMap[id];
            const visible = series.slice(start, start + ITEMS_PER_PAGE);
            const previewSerie = visible[1] || null;
            return (
              <MainSeries
                key={id}
                titulo={titulo}
                visibleSeries={visible}
                handleNext={() => handleNext(id, series.length)}
                handlePrev={() => handlePrev(id, series.length)}
                agregarAmiLista={(serie) =>
                  agregarFavorito({
                    id_usuario: usuario?.id,
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
        ))}

        {(searchParam ? (
          <MainPeliculas
            titulo="Resultados"
            visiblePeliculas={peliculasFiltradas}
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
            peliculasLength={peliculasFiltradas.length}
            previewPelicula={peliculasFiltradas[1] || null}
          />
        ) : (
          categoriasPeliculas.map(({ id, titulo, peliculas }) => {
            const start = startIndexMap[id];
            const visible = peliculas.slice(start, start + ITEMS_PER_PAGE);
            const previewPelicula = visible[1] || null;
            return (
              <MainPeliculas
                key={id}
                titulo={titulo}
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
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default Main;