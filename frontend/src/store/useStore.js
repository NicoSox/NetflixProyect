import { create } from 'zustand';

const useStore = create((set, get) => ({
  series: [],
  todasLasSeries: [],
  miLista: [],
  peliculas: [],
  todasLasPeliculas: [],
  usuarioActual: null,

  setUsuarioActual: async (usuario) => {
  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  set({ usuarioActual: usuario, miLista: [] }); // limpio la lista al cambiar usuario

  if (usuario && usuario.id) {
    await get().obtenerFavoritos(); // recargo favoritos del usuario nuevo
  }
},



 cargarUsuarioActual: async () => {
  const usuarioString = localStorage.getItem('usuarioActivo');
  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    set({ usuarioActual: usuario, miLista: [] });
    await get().obtenerFavoritos();
  } else {
    set({ usuarioActual: null, miLista: [] });
  }
},



  obtenerSeries: async () => {
    try {
      const res = await fetch('http://localhost:3007/series');
      const data = await res.json();
      set({ series: data, todasLasSeries: data });
    } catch (error) {
      console.error('Error al obtener series:', error);
    }
  },

  buscarSeries: async (titulo) => {
    if (!titulo) {
      set((state) => ({ series: state.todasLasSeries }));
      return;
    }
    try {
      const res = await fetch(`http://localhost:3007/series/buscar/especifico?titulo=${encodeURIComponent(titulo)}`);
      const data = await res.json();
      set({ series: data });
    } catch (error) {
      console.error("Error al buscar series:", error);
    }
  },

obtenerFavoritos: async () => {
  const { usuarioActual } = get();
  if (!usuarioActual || !usuarioActual.id) {
    console.error('Usuario no autenticado');
    return;
  }

  try {
    const res = await fetch(`http://localhost:3007/favoritos/usuario/${usuarioActual.id}`);
    const favoritos = await res.json();

    const series = get().todasLasSeries;
    const peliculas = get().todasLasPeliculas;

    const favoritosConInfo = favoritos.map(fav => {
      // Si es una serie
      if (fav.id_serie) {
        const serieInfo = series.find(s => s.id_serie === fav.id_serie);
        return {
          ...fav,
          id: fav.id_favorito,
          titulo: serieInfo?.titulo || 'Sin título',
          trailer: serieInfo?.trailer || '',
        };
      }

      // Si es una película
      if (fav.id_pelicula) {
        const peliInfo = peliculas.find(p => p.id_pelicula === fav.id_pelicula);
        return {
          ...fav,
          id: fav.id_favorito,
          titulo: peliInfo?.titulo || 'Sin título',
          trailer: peliInfo?.trailer || '',
        };
      }

      // Si no es ni serie ni película (por alguna razón)
      return { ...fav, id: fav.id_favorito, titulo: 'Desconocido', trailer: '' };
    });

    set({ miLista: favoritosConInfo });
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
  }
},

agregarFavorito: async ({ id_pelicula = null, id_serie = null, fecha_agregado }) => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));

  if (!usuarioActivo || !usuarioActivo.id) {
    console.error('Usuario no autenticado');
    return;
  }

  if (
  (id_serie && get().miLista.some(fav => fav.id_serie === id_serie)) ||
  (id_pelicula && get().miLista.some(fav => fav.id_pelicula === id_pelicula))
) {
  console.warn('Este contenido ya está en favoritos');
  return;
}


  try {
    const res = await fetch('http://localhost:3007/favoritos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: usuarioActivo.id,
        id_pelicula,
        id_serie,
        fecha_agregado: fecha_agregado.split('T')[0],
      }),
    });

    if (!res.ok) throw new Error('Error al agregar favorito');
    const data = await res.json();
const serieInfo = get().todasLasSeries.find(s => s.id_serie === id_serie);
const peliInfo = get().todasLasPeliculas.find(p => p.id_pelicula === id_pelicula);

const titulo = serieInfo?.titulo || peliInfo?.titulo || 'Sin título';
const trailer = serieInfo?.trailer || peliInfo?.trailer || '';


    set((state) => ({
      miLista: [...state.miLista, {
        id_favorito: data.id_favorito,
        id_usuario: usuarioActivo.id,
        id_pelicula,
        id_serie,
        fecha_agregado,
        id: data.id_favorito,
        titulo,
        trailer,
      }],
    }));
  } catch (error) {
    console.error(error);
  }
},

  obtenerPeliculas: async () => {
    try {
      const res = await fetch('http://localhost:3007/peliculas');
      const data = await res.json();
      set({ peliculas: data, todasLasPeliculas: data });
    } catch (error) {
      console.error('Error al obtener películas:', error);
    }
  },

  buscarPeliculas: async (titulo) => {
    if (!titulo) {
      set((state) => ({ peliculas: state.todasLasPeliculas }));
      return;
    }
    try {
      const res = await fetch(`http://localhost:3007/peliculas/buscar/especifico?titulo=${encodeURIComponent(titulo)}`);
      const data = await res.json();
      set({ peliculas: data });
    } catch (error) {
      console.error("Error al buscar películas:", error);
    }
  },

quitarFavorito: async (id_favorito) => {
  try {
    const res = await fetch(`http://localhost:3007/favoritos/${id_favorito}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error al eliminar favorito');

    const usuarioActivo = get().usuarioActual;
    if (!usuarioActivo) return;

    set((state) => ({
      // Solo filtro los favoritos del usuario activo
      miLista: state.miLista.filter(fav => fav.id_favorito !== id_favorito),
    }));
  } catch (error) {
    console.error(error);
  }
},


  agregarAmiLista: (serie) =>
    set((state) => {
      const serieConId = { ...serie, id: serie.id || serie.id_serie };
      if (state.miLista.find(item => item.id === serieConId.id)) {
        return {};
      }
      return { miLista: [...state.miLista, serieConId] };
    }),

  quitarDeMiLista: (serie) =>
    set((state) => ({
      miLista: state.miLista.filter((item) => item.id !== serie.id),
    })),
}));

export default useStore;
