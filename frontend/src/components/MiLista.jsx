import React from 'react';
import useStore from '../store/useStore.js';
import VideoCard from './VideoCard';
import Navbar from './NavBar.jsx';
import Footer from './Footer.jsx'; 
import PeliCard from '../components/PeliCard.jsx'
import  { useEffect } from 'react';

// Componente que muestra las series o películas que el usuario guardó en su lista personal
const MiLista = () => {
  // Obtenemos la lista de favoritos desde el estado global (Zustand)
  const miLista = useStore((state) => state.miLista);

  // Función del store para quitar un elemento de favoritos
  const quitarFavorito = useStore((state) => state.quitarFavorito);
  useEffect(() => {
    useStore.getState().cargarUsuarioActual();
  }, []);
  return (
    <>
      {/* Barra de navegación principal */}
      <Navbar/>

      {/* Contenedor principal de la sección "Mi Lista" */}
      <div style={{ backgroundColor: '#141414', color: 'white', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px' }}>Mi Lista</h2>

        {/* Si la lista está vacía, mostramos un mensaje */}
        {miLista.length === 0 ? (
          <p>La lista está vacía</p>
        ) : (
          // Si hay elementos, los mostramos en forma de tarjetas
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
           {miLista.map((fav) => {
  const esSerie = !!fav.id_serie;

  return esSerie ? (
    <VideoCard
      key={fav.id}
      serie={fav}
      quitarDeMiLista={() => quitarFavorito(fav.id)}
      showAddButton={false}
    />
  ) : (
    <PeliCard
      key={fav.id}
      pelicula={fav}
      quitarDeMiLista={() => quitarFavorito(fav.id)}
      showAddButton={false}
    />
  );
})}

          </div>
        )}
      </div>

      {/* Pie de página */}
      <Footer/>
    </>
  );
};

export default MiLista;
