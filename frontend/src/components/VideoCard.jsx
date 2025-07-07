import { useState, useEffect } from 'react';

// Componente para representar visualmente una serie en forma de tarjeta interactiva
const VideoCard = ({ serie, agregarAmiLista, quitarDeMiLista, showAddButton = true }) => {
  const [hovered, setHovered] = useState(false); // Estado para saber si el mouse está sobre la tarjeta
  const [fullscreen, setFullscreen] = useState(false); // Estado para modo pantalla completa
  const isExpanded = hovered || fullscreen; // Determina si está expandido (hover o fullscreen)

  // Extrae el ID del video desde la URL del trailer (YouTube)
  const extraerVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extraerVideoId(serie.trailer); // ID del video
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; // Miniatura del video

  // Bloquea el scroll de fondo cuando está en fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  // Estilos dinámicos de la tarjeta según el estado
  const cardStyle = {
    width: fullscreen ? '50vw' : '215px',
    minWidth: fullscreen ? '100vw' : '215px',
    height: fullscreen ? '40vw' : '115px',
    transition: 'transform 0.4s ease, box-shadow 0.4s ease, opacity 0.3s ease',
    opacity: isExpanded ? 1 : 0.8,
    borderRadius: '1px',
    position: fullscreen ? 'fixed' : 'relative',
    top: fullscreen ? 0 : 'auto',
    left: fullscreen ? 0 : 'auto',
    cursor: 'pointer',
    boxShadow: hovered ? '0 8px 20px rgba(0,0,0,0.7)' : 'none',
    transformOrigin: 'center center',
    transform: hovered ? 'scale(1.4)' : 'scale(1)',
    zIndex: fullscreen ? 100 : hovered ? 10 : 1,
    backdropFilter: fullscreen ? 'blur(2px)' : 'none'
  };

  // Al hacer clic para ver el trailer, se registra la visualización como tendencia
  const registrarTendencia = async () => {
    try {
      await fetch('http://localhost:3007/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id_serie: serie.id_serie }),
      });
      console.log('Visualización registrada para serie:', serie.titulo);
    } catch (error) {
      console.error('Error al registrar tendencia:', error);
    }
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!fullscreen) setHovered(false); }}
    >
      {/* Si no hay hover, mostramos solo la miniatura */}
      {!hovered && (
        <img
          src={thumbnailUrl}
          alt={serie.titulo}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Si hay hover o fullscreen, mostramos el trailer y controles */}
      {hovered && (
        <>
          {/* Filtro oscuro detrás del contenido cuando está en fullscreen */}
          {fullscreen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(0, 0, 0, 0.6)',
              zIndex: 99
            }} />
          )}

          {/* Botón para salir del modo fullscreen */}
          {fullscreen && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreen(false);
                setHovered(false);
              }}
              style={{
                position: 'fixed',
                top: '5vw',
                right: '17vw',
                background: 'rgba(0,0,0,0.7)',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer',
                zIndex: 200
              }}
            >
              ✕
            </button>
          )}

          {/* Botón para entrar en modo fullscreen y registrar la visualización */}
          {!fullscreen && (
            <button
              onClick={(e) => {
                registrarTendencia();
                e.stopPropagation();
                setFullscreen(true);
              }}
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 10px',
                cursor: 'pointer',
                zIndex: 150
              }}
            >
              ⛶
            </button>
          )}

          {/* Trailer de YouTube embebido */}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
            title={serie.titulo}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ width: '100%', height: '100%', zIndex: 100 }}
          />

          {/* Parte inferior con título y botón de acción */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              color: 'white',
              background: 'rgba(0,0,0,0.6)',
              padding: '10px',
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <p style={{ margin: 0, fontWeight: 'bold' }}>{serie.titulo}</p>

            {/* Botón para agregar a la lista */}
            {showAddButton ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  agregarAmiLista(serie);
                }}
                style={{
                  backgroundColor: '#e50914',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                +
              </button>
            ) : (
              // Botón para quitar de la lista si ya está agregada
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  quitarDeMiLista(serie);
                }}
                style={{
                  backgroundColor: '#555',
                  border: 'none',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Quitar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VideoCard;
