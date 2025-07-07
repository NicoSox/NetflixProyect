import { useState, useEffect } from 'react';

// Componente que representa una tarjeta de película, con funcionalidad de vista previa en video, fullscreen y botones para agregar o quitar de la lista
const PeliCard = ({ pelicula, agregarAmiLista, quitarDeMiLista, showAddButton = true }) => {
  // Estado para saber si el mouse está encima de la tarjeta
  const [hovered, setHovered] = useState(false);

  // Estado para saber si la tarjeta está en modo pantalla completa
  const [fullscreen, setFullscreen] = useState(false);

  // La tarjeta se considera expandida si está en fullscreen o con hover
  const isExpanded = hovered || fullscreen;

  // Extrae el ID del video de YouTube desde la URL del trailer
  const extraerVideoId = (url) => {
    const match = url.match(/(?:\?v=|\/embed\/|\.be\/)([\w\-]+)/);
    return match ? match[1] : null;
  };

  const videoId = extraerVideoId(pelicula.trailer);

  // URL del thumbnail de YouTube (imagen previa del video)
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // Efecto para bloquear el scroll del body cuando está en fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [fullscreen]);

  // Estilo dinámico de la tarjeta, que cambia según esté en fullscreen o no
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

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { if (!fullscreen) setHovered(false); }}
    >
      {/* Cuando no hay hover, solo se muestra la imagen miniatura */}
      {!hovered && (
        <img
          src={thumbnailUrl}
          alt={pelicula.titulo}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* Cuando hay hover o fullscreen, se muestra el contenido expandido */}
      {hovered && (
        <>
          {/* Capa oscura de fondo en modo fullscreen */}
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

          {/* Botón para cerrar fullscreen */}
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

          {/* Botón para abrir fullscreen (solo si no está en ese modo) */}
          {!fullscreen && (
            <button
              onClick={(e) => {
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

          {/* Iframe que reproduce el trailer automáticamente */}
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
            title={pelicula.titulo}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ width: '100%', height: '100%', zIndex: 100 }}
          />

          {/* Información inferior: título y botón de acción */}
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
            <p style={{ margin: 0, fontWeight: 'bold' }}>{pelicula.titulo}</p>

            {/* Botón para agregar a la lista si está habilitado */}
            {showAddButton ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  agregarAmiLista(pelicula);
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
              // Si no está habilitado, mostramos el botón para quitar de la lista
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  quitarDeMiLista(pelicula);
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

export default PeliCard;
