import React, { useState, useRef, useEffect } from 'react';
import '../../styles/css/Suscribe.css';
import emailjs from '@emailjs/browser';
import ErrorMessage from '../reusable/ErrorMessage';

const Main = () => {
  // Estado para el email ingresado por el usuario
  const [email, setEmail] = useState('');

  // Estado para guardar mensajes de error (por ejemplo, email inválido)
  const [errors, setErrors] = useState({});

  // Estado para mostrar mensaje de éxito después de enviar el correo
  const [success, setSuccess] = useState('');

  // Estado para controlar el índice del carousel (aunque no se usa aquí el array items)
  const [index, setIndex] = useState(0);

  // Referencia para el contenedor del carousel, para controlar scroll programático
  const carouselRef = useRef(null);

  // Estado para guardar las tendencias que se obtienen desde el backend
  const [tendencias, setTendencias] = useState([]);

  // Funciones para avanzar o retroceder en el carousel (no se usa aquí el array items)
  const prev = () => setIndex(index === 0 ? items.length - 1 : index - 1);
  const next = () => setIndex(index === items.length - 1 ? 0 : index + 1);

  // Componente para mostrar mensaje de éxito en el formulario
  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="success-message" style={{ color: 'green', fontSize: '15px', marginLeft: '10px' }}>
        {message}
      </div>
    );
  };

  // Función que valida el email ingresado por el usuario
  const validateEmail = (email) => {
    const emailStr = typeof email === 'string' ? email : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Si está vacío o no cumple con el formato, devuelve mensaje de error
    if (!emailStr.trim()) {
      return 'Ingresa un email válido.';
    } else if (!emailRegex.test(emailStr)) {
      return 'Ingresa un email con formato válido.';
    }

    // Si pasa la validación, retorna cadena vacía (sin error)
    return '';
  };

  // Función que se ejecuta al enviar el formulario para suscribirse
  const sendSubscribe = (e) => {
    e.preventDefault();

    // Validamos el email y seteamos el error si lo hay
    const errorMsg = validateEmail(email);
    setErrors({ email: errorMsg });

    // Limpiamos mensajes de éxito previos
    setSuccess('');

    // Link para usar en el correo (puede cambiar según ambiente)
    const signup_link = 'http://localhost:5173/signUp';

    // Si hay error en el email, no continúa con el envío
    if (errorMsg) return;

    // Usa emailjs para enviar el correo con la plantilla configurada
    emailjs.send(
      'service_t49mrtk',
      'template_hy4t1lo',
      { user_email: email, signup_link: signup_link },
      'PKIgV7RsnHTivu_i-'
    )
      .then(() => {
        // Si el correo se envía bien, mostrar mensaje de éxito
        setSuccess('¡Correo de recuperación enviado!');
      })
      .catch(() => {
        // Si hay error enviando el correo, mostrar mensaje de error
        setSuccess('Error al enviar el correo. Intenta de nuevo.');
      });
  };

  // Funciones para mover el scroll del carousel a la izquierda o derecha con animación suave
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Al montar el componente, se carga la lista de tendencias desde el backend
  useEffect(() => {
    fetch('http://localhost:3007/api/tendencias', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => response.json())
      .then(data => {
        // Guardamos las tendencias recibidas en el estado
        setTendencias(data);
      })
      .catch(error => {
        // Si falla la carga, mostrar error en consola y setear mensaje de error
        console.error('Error al obtener tendencias:', error);
        setErrors({ tendencias: 'Error de red' });
      });
  }, []);

  return (
    <>
      {/* Fondo con imagen y estilos */}
      <div className='img-background-suscribe'>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Texto principal */}
          <h1 style={{ height: "230px", width: "50%", fontWeight: "900", textAlign: "center", justifyContent: "center", fontSize: "55px", fontFamily: "'Roboto', sans-serif", color: "white", marginTop: "180px", marginBottom: "20px" }}>
            Películas y series ilimitadas y mucho más
          </h1>

          {/* Subtítulo */}
          <h2 style={{ textAlign: "center", justifyContent: "center", fontFamily: "'Roboto', sans-serif", color: "white", height: "60px", fontSize: "20px" }}>
            A partir de $ 5.999. Cancela cuando quieras.
          </h2>

          {/* Descripción */}
          <p style={{ textAlign: "center", justifyContent: "center", fontFamily: "'Roboto', sans-serif", color: "white", width: "45%", height: "100px" }}>
            ¿Quieres ver Netflix ya? Ingresa tu email para crear una cuenta o reiniciar tu membresía de Netflix.
          </p>

          {/* Formulario para ingresar email y suscribirse */}
          <div className='input-subscribe-container'>
            <form
              action="#"
              onSubmit={sendSubscribe}
              style={{ display: "flex", height: "100%", width: "100%" }}
              autoComplete="off"
              noValidate // Evita los mensajes por defecto del navegador
            >
              <input
                type="email"
                name="email"
                className="input-subscribe"
                placeholder=""
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete='on'
              />
              <label htmlFor="email" className="label-float-subscribe">Email</label>

              <button className="button-sendmail-subscribe" type="submit">
                Comenzar <i className="bi bi-caret-right"></i>
              </button>
            </form>
          </div>

          {/* Mostrar mensaje de éxito o error debajo del formulario */}
          <div style={{ display: "flex", alignItems: "start", height: "30px", width: "50%" }}>
            {success ? <SuccessMessage message={success} /> : <ErrorMessage message={errors.email} />}
          </div>

          {/* Línea curva decorativa tipo Netflix con degradado */}
          <div style={{ position: "relative", width: "100%" }}>
            <svg viewBox="0 0 1920 300" width="100%" height="300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="netflix-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#201018" />
                  <stop offset="15%" stopColor="#9b255c" />
                  <stop offset="40%" stopColor="#e32e2d" />
                  <stop offset="60%" stopColor="#e32e2d" />
                  <stop offset="85%" stopColor="#9b255c" />
                  <stop offset="100%" stopColor="#201018" />
                </linearGradient>
                <radialGradient id="blue-glow-curve" cx="50%" cy="0%" r="42%">
                  <stop offset="0%" stop-color="#111c46" stop-opacity="0.7" />
                  <stop offset="60%" stop-color="#111c46" stop-opacity="0.15" />
                  <stop offset="100%" stop-color="#000" stop-opacity="0" />
                </radialGradient>
              </defs>
              {/* Curva principal con degradado */}
              <path
                d="
                M0,56
                Q960,4 1920,56
                L1920,60
                Q960,8 0,60
                Z
                "
                fill="url(#netflix-gradient)"
              />
              {/* Fondo negro curvo */}
              <path
                d="
                M0,60
                Q960,8 1920,60
                L1920,300
                L0,300
                Z
                "
                fill="#000"
              />
              {/* Resplandor azul que sigue la curva */}
              <path
                d="
                M0,60
                Q960,8 1920,60
                L1920,340
                Q960,380 0,340
                Z
                "
                fill="url(#blue-glow-curve)"
                style={{ mixBlendMode: "screen" }}
              />
            </svg>
          </div>

          {/* Carrousel para mostrar las tendencias */}
          <div style={{ width: '80%', position: 'relative', marginTop: "-200px" }}>
            <h1 style={{ color: "#fff", marginLeft: 40 }}>Tendencias</h1>

            {/* Botón para mover carousel a la izquierda */}
            <button
              onClick={scrollLeft}
              style={{
                position: 'absolute',
                left: 0,
                top: '60%',
                zIndex: 2,
                transform: 'translateY(-50%)',
                background: '#111c',
                border: 'none',
                color: '#fff',
                fontSize: 32,
                cursor: 'pointer',
                borderRadius: '50%',
                width: 48,
                height: 48
              }}
            >
              &lt;
            </button>

            {/* Contenedor del carousel con scroll horizontal */}
            <div
              ref={carouselRef}
              style={{
                overflowX: 'auto',
                display: 'flex',
                scrollBehavior: 'smooth',
                gap: 24,
                padding: '24px 60px',
                scrollbarWidth: 'none'
              }}
              className="carousel-scroll"
            >
              {/* Tarjetas con cada tendencia */}
              {tendencias.map(item => (
                <div
                  key={item.id}
                  className="carousel-card"
                  style={{
                    width: "180px",
                    height: "260px",
                    background: '#222',
                    color: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    boxSizing: 'border-box',
                    flex: '0 0 auto',
                    boxShadow: '0 2px 12px #0008'
                  }}
                >
                  <h3>{item.titulo}</h3>
                  <p>{item.descripcion}</p>
                </div>
              ))}
            </div>

            {/* Botón para mover carousel a la derecha */}
            <button
              onClick={scrollRight}
              style={{
                position: 'absolute',
                right: 0,
                top: '60%',
                zIndex: 2,
                transform: 'translateY(-50%)',
                background: '#111c',
                border: 'none',
                color: '#fff',
                fontSize: 32,
                cursor: 'pointer',
                borderRadius: '50%',
                width: 48,
                height: 48
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
