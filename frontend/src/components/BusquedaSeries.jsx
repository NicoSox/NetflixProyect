import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BusquedaSeries = () => {
  // Estado para guardar el valor del input de búsqueda
  const [input, setInput] = useState('');

  // Hook para navegar programáticamente a otra ruta
  const navigate = useNavigate();

  // Maneja el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Si el input está vacío, no hace nada
    if (!input.trim()) return;

    // Redirige a la página de resultados con el título como query param
    navigate(`/series?titulo=${encodeURIComponent(input.trim())}`);
  };

  return (
    // Formulario de búsqueda
    <form onSubmit={handleSubmit} style={{ margin: '20px 40px' }}>
      
      {/* Campo de texto para ingresar el título de la serie */}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Buscar series por título..."
        style={{
          width: '280px',
          padding: '10px',
          fontSize: '16px',
          borderRadius: '6px',
          border: '1px solid #555',
          backgroundColor: '#1a1a1a',
          color: 'white',
        }}
      />

      {/* Botón para enviar el formulario */}
      <button
        type="submit"
        style={{
          marginLeft: '10px',
          padding: '10px 16px',
          fontSize: '16px',
          backgroundColor: '#e50914',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Buscar
      </button>
    </form>
  );
};

export default BusquedaSeries;
