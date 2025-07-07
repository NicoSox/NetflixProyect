import '../../styles/css/Login.css'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ErrorMessage from '../reusable/ErrorMessage';
import { useRememberCredentials } from '../../utils/hooks/useRememberCredentials';
import { handleLoginSubmit } from '../../utils/handlers/handleLoginSubmit';
import { handleFieldBlur } from '../../utils/handlers/handleFieldBlur';
import useStore from '../../store/useStore.js';

const Main = () => {
  // Guardamos la función para actualizar el usuario actual en el store global
  const setUsuarioActual = useStore(state => state.setUsuarioActual);

  // Estado para controlar los inputs y algunos estados UI
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [expanded, setExpanded] = useState(false); // Para mostrar info extra de reCAPTCHA
  const [remember, setRemember] = useState(false); // Checkbox "Recordarme"
  const [errors, setErrors] = useState({}); // Errores de validación local
  const [modoCodigo, setModoCodigo] = useState(false); // Si se usa código en lugar de contraseña
  const [errorLog, setErrorLog] = useState({}); // Error recibido del backend al loguear
  const [visible, setVisible] = useState(false); // Para mostrar/ocultar contraseña

  const navigate = useNavigate();

  // Cargar credenciales recordadas (si las hay) del localStorage y ponerlas en inputs
  useRememberCredentials(setEmail, setPassword, setRemember);

  // Abre la info extra cuando hacen click en "Más info."
  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };

  // Valida un campo cuando pierde el foco
  const handleBlur = (field) => {
    handleFieldBlur({ field, email, password, modoCodigo, setErrors });
  };

  // Alterna el checkbox "Recordarme" y guarda o borra las credenciales en localStorage
  const handleRememberAccount = () => {
    const updated = !remember;
    setRemember(updated);

    if (updated) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
      localStorage.setItem('remember', 'true');
    } else {
      ['email', 'password', 'remember'].forEach(key => localStorage.removeItem(key));
    }
  }

  // Enviar el formulario para iniciar sesión
  const handleSubmit = async (e) => {
  e.preventDefault();

  handleLoginSubmit({
    e,
    email,
    password,
    remember,
    modoCodigo,
    setErrors
  });

  const hasErrors = !email || (!modoCodigo && !password);
  if (hasErrors) return;

  try {
    const response = await fetch('http://localhost:3007/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail: email,
        pass: password
      })
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Guardar token y cuenta en localStorage
      localStorage.setItem('token', data.token);
      setUsuarioActual(data.cuenta); // Aquí usás .cuenta
      localStorage.setItem('usuarioCuenta', JSON.stringify(data.cuenta));

      // Redirigir según el rol
      if (data.cuenta.rol_id === 2) {
        navigate('/Profiles');
      } else if (data.cuenta.rol_id === 1) {
        navigate('/ContenidoList');
      }
    } else {
      setErrorLog({ login: data.error || 'Error en las credenciales' });
    }
  } catch (error) {
    setErrors({ login: 'Error al intentar loguear' });
  }
};

  // Toggle para mostrar u ocultar la contraseña
  const handleEye = () => {
    setVisible(prev => !prev);
  }

  return (
    <>
      <div className='img-background'>
        <img className="img img-logo" src="/assets/logo.png" alt="Logo" />

        <div className="card card-login-main">
          <div className="card card-login">

            <div><h1 className='title-login'>Iniciar sesión</h1></div>

            <form onSubmit={handleSubmit}>
              {/* Email / Celular */}
              <div className="input-container">
                <input
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  onFocus={() => { if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                  placeholder=''
                />
                <label htmlFor="email" className="label-float">Email o número de celular</label>
                <ErrorMessage message={errors.email} />
              </div>

              {/* Contraseña (solo si no está en modo código) */}
              {!modoCodigo && (
                <div className="input-container">
                  <input
                    className={`input ${errors.password ? 'input-error' : ''}`}
                    type={visible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onFocus={() => { if (errors.password) setErrors(prev => ({ ...prev, password: '' })); }}
                    onBlur={() => handleBlur('password')}
                    placeholder=''
                  />
                  <label htmlFor="password" className="label-float">Contraseña</label>
                  <i
                    onClick={handleEye}
                    className={visible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "40%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "1.3em",
                      color: "#888"
                    }}
                  ></i>
                  <ErrorMessage message={errors.password} />
                </div>
              )}

              {/* Error general de login */}
              <ErrorMessage message={errorLog.login} />

              {/* Texto informativo cuando está en modo código */}
              {modoCodigo && (
                <p style={{
                  marginTop: '-30px',
                  marginBottom: "40px",
                  color: '#8c8c8c',
                  fontSize: '14px',
                  textAlign: "center"
                }}>
                  Pueden aplicar tarifas de SMS y datos
                </p>
              )}

              {/* Botón para enviar */}
              <div>
                <button className='button button-login'>
                  {modoCodigo ? 'Enviar codigo de inicio de sesión' : 'Iniciar sesión'}
                </button>
              </div>

              {/* Separador */}
              <p style={{ fontSize: "15px", textAlign: "center", marginTop: "15px" }}>O</p>

              {/* Botón para cambiar modo de ingreso */}
              <div>
                <button
                  type="button"
                  className='button button-login-code'
                  onClick={() => setModoCodigo(!modoCodigo)}
                >
                  {modoCodigo ? 'Ingresar con contraseña' : 'Usar un código de inicio de sesión'}
                </button>
              </div>
            </form>

            {/* Link para recuperar contraseña */}
            <div className='forgot-password-card'>
              <Link to="/LoginHelp" className="forgot-password-link">¿Olvidaste la contraseña?</Link>
            </div>

            {/* Checkbox recordarme */}
            <div>
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="aceptar"
                  checked={remember}
                  onChange={handleRememberAccount}
                />
                <span className="checkmark"></span>
                Recordarme
              </label>
            </div>

            {/* Texto para suscribirse */}
            <div className='card card-subscribe'>
              <p style={{ color: "#bbbbbb" }}>
                ¿Primera vez en netflix? <Link to="/Subscribe" className='link-to-suscribe'>Suscribete ya.</Link>
              </p>
              <p style={{ marginTop: "10px", fontSize: "12px", color: "#8c8c8c" }}>
                Esta página está protegida por Google reCAPTCHA para comprobar que no eres un robot.
              </p>
            </div>

            {/* Info adicional reCAPTCHA */}
            <div className={`card-info ${expanded ? 'expanded' : ''}`} onClick={handleExpand}>
              {!expanded && (
                <p style={{
                  textDecoration: "Underline",
                  marginLeft: "-15px",
                  color: "#0071eb",
                  fontSize: "14px"
                }}>Más info.</p>
              )}
              {expanded && (
                <div
                  className="extra-info"
                  style={{
                    cursor: "text",
                    fontSize: "13px",
                    color: "#8c8c8c"
                  }}
                >
                  La información recopilada por Google reCAPTCHA está sujeta a la{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noreferrer"
                    style={{ cursor: "pointer", color: "#0071eb" }}
                  >
                    Política de privacidad
                  </a>{" "}
                  y a las{" "}
                  <a
                    href="https://policies.google.com/terms"
                    target="_blank"
                    rel="noreferrer"
                    style={{ cursor: "pointer", color: "#0071eb" }}
                  >
                    Condiciones de servicio de Google
                  </a>
                  , y se utiliza para proporcionar, mantener y mejorar el servicio de reCAPTCHA, así como para fines generales de seguridad (Google no la utiliza para personalizar publicidad).
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
