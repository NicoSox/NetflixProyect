import '../../styles/css/Profiles.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
  const [editar, setEditar] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const maxPerfiles = 5;

  const handleEditar = () => {
    setEditar(prev => !prev);
  };

  const handleProfileClick = (usuario) => {
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    console.log('Usuario actual', usuario);
    if (editar) {
      navigate('/EditProfiles'); 
    } else {
      navigate('/Home');
    }
  };

  const handleCrearProfile = () => {
    navigate('/CreateProfiles');
  };

  useEffect(() => {
    // Cambio clave localStorage a 'usuarioCuenta'
    const cuenta = JSON.parse(localStorage.getItem('usuarioCuenta'));
    const idCuenta = cuenta?.id_cuenta;

    if (!idCuenta) return;

    localStorage.setItem('cuenta', JSON.stringify(cuenta)); // guardo cuenta completa

    fetch(`http://localhost:3007/cuentas/${idCuenta}/usuarios`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setUsuarios(data);

          const usuariosIds = data.map(u => u.id);
          localStorage.setItem('usuariosIds', JSON.stringify(usuariosIds));

          if (usuariosIds.length > 0) {
            localStorage.setItem('usuarioActivoId', usuariosIds[0].toString());
          }
        }
      })
      .catch(err => {
        console.error('Error al cargar los perfiles:', err);
      });
  }, []);

  return (
    <div className='card-principal-profiles'>
      {usuarios.length > 0 && (
      <h1 style={{ color: "white", fontSize: "50px", fontFamily: "'Roboto', sans-serif", fontWeight: "5px" }}>
        ¿Quién está viendo ahora?
      </h1>)}
      {!usuarios.length > 0 && (
      <h1 style={{ color: "white", fontSize: "50px", fontFamily: "'Roboto', sans-serif", fontWeight: "5px" }}>
        Aun no tienes perfiles, crea uno.
      </h1>)}
      <div className='card-profiles'>
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className='card-profile'
            onClick={() => handleProfileClick(usuario)}
          >
            <div className='card-img-profile'>
              <img src={usuario.foto || "/public/assets/profileimg.jpg"} alt={usuario.username} />
              {editar && <i className="bi bi-pencil"></i>}
            </div>
            <div className='card-name-profile'>
              <p className='text-profile'>{usuario.username}</p>
            </div>
          </div>
        ))}

        {usuarios.length < maxPerfiles && (
          <div className='card-profile' onClick={handleCrearProfile}>
            <div className='card-img-profile-plus'>
              <i className="bi bi-plus"></i>
            </div>
            <div className='card-name-profile'>
              <p className='text-profile'>Crear</p>
            </div>
          </div>
        )}
      </div>

      {usuarios.length > 0 && (
        <button className='button-profile' onClick={handleEditar}>
          {editar ? "Listo" : "Administrar perfiles"}
        </button>
      )}
    </div>
  );
};

export default Main;
