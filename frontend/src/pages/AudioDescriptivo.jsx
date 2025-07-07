import useStore from '../store/useStore.js';
import VideoCard from '../components/VideoCard';
import { useEffect } from 'react';

// Componente que muestra una sección con todas las series que tienen audio descriptivo
const AudioDescriptivo = () => {
  // Obtenemos la lista de series desde el store (estado global)
  const series = useStore((state) => state.series);

  // Acción para cargar las series desde el backend
  const obtenerSeries = useStore((state) => state.obtenerSeries);

  // Acción para agregar una serie a la lista personal del usuario
  const agregarAmiLista = useStore((state) => state.agregarAmiLista);

  // Normalizamos los objetos de series para asegurar que todas tengan una propiedad "id"
  // Esto es útil para React al usarlo como "key" y para uniformidad con VideoCard
  const seriesConAudio = series.map(s => ({
    ...s,
    id: s.id_serie,
  }));

  // Cuando se monta el componente, se hace la petición para obtener las series
  useEffect(() => {
    obtenerSeries();
  }, []);

  return (
    <div style={{ backgroundColor: '#141414', color: 'white', padding: '40px' }}>
      {/* Título de la sección */}
      <h1 style={{ marginBottom: '30px', fontSize: '2rem' }}>Series con Audio Descriptivo</h1>

      {/* Si no hay series disponibles, se muestra un mensaje amigable */}
      {seriesConAudio.length === 0 ? (
        <p style={{ color: '#aaa', fontSize: '1.2rem', textAlign: 'center', marginTop: '30px' }}>
          Aún no hay series con audio descriptivo disponibles 🎧
        </p>
      ) : (
        // Si hay series, se muestran en forma de tarjetas usando VideoCard
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center',
          }}
        >
          {seriesConAudio.map((serie) => (
            <VideoCard
              key={serie.id} // Clave única para React
              serie={serie} // Pasamos los datos de la serie a la tarjeta
              agregarAmiLista={agregarAmiLista} // Pasamos la función para poder agregar desde la tarjeta
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AudioDescriptivo;
