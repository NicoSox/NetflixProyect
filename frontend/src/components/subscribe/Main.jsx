import React, { useState } from 'react';
import '../../styles/css/Suscribe.css';
import emailjs from '@emailjs/browser';
import ErrorMessage from '../reusable/ErrorMessage';

const Main = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Componente para mostrar mensajes de éxito
  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="success-message" style={{ color: 'green', fontSize: '15px', marginLeft: '10px' }}>
        {message}
      </div>
    );
  };

  // Validación de email personalizada
  const validateEmail = (email) => {
    const emailStr = typeof email === 'string' ? email : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr.trim()) {
      return 'Ingresa un email válido.';
    } else if (!emailRegex.test(emailStr)) {
      return 'Ingresa un email con formato válido.';
    }
    return '';
  };

  // Submit del formulario
  const sendSubscribe = (e) => {
    e.preventDefault();
    const errorMsg = validateEmail(email);
    setErrors({ email: errorMsg });
    setSuccess('');
    if (errorMsg) return;

    emailjs.send(
      'service_zfzerkk',
      'template_3gf0bpd',
      { user_email: email },
      'PKIgV7RsnHTivu_i-'
    )
      .then(() => {
        setSuccess('¡Correo de recuperación enviado!');
      })
      .catch(() => {
        setSuccess('Error al enviar el correo. Intenta de nuevo.');
      });
  };

  return (
    <>
      <div className='img-background-suscribe'>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ height: "230px", width: "50%", fontWeight: "900", textAlign: "center", justifyContent: "center", fontSize: "55px", fontFamily: "'Roboto', sans-serif", color: "white", marginTop: "180px", marginBottom: "20px" }}>
            Películas y series ilimitadas y mucho más
          </h1>
          <h2 style={{ textAlign: "center", justifyContent: "center", fontFamily: "'Roboto', sans-serif", color: "white", height: "60px", fontSize: "20px" }}>
            A partir de $ 5.999. Cancela cuando quieras.
          </h2>
          <p style={{ textAlign: "center", justifyContent: "center", fontFamily: "'Roboto', sans-serif", color: "white", width: "45%", height: "100px" }}>
            ¿Quieres ver Netflix ya? Ingresa tu email para crear una cuenta o reiniciar tu membresía de Netflix.
          </p>

          <div className='input-subscribe-container'>
            <form action="#" onSubmit={sendSubscribe} style={{ display: "flex", height: "100%", width: "100%" }} autoComplete="off" noValidate // <-- Esto evita el mensaje por defecto del navegador
            >
              <input type="email" name="email" className="input-subscribe" placeholder="" value={email} onChange={e => setEmail(e.target.value)} autoComplete='on' />
              <label htmlFor="email" className="label-float-subscribe">Email</label>
              <button className="button-sendmail-subscribe" type="submit">
                Comenzar <i className="bi bi-caret-right"></i>
              </button>
            </form>
          </div>
          <div style={{ display: "flex", alignItems: "start", height: "30px", width: "50%" }}>
            {success ? <SuccessMessage message={success} /> : <ErrorMessage message={errors.email} />}
          </div>


          {/* Línea divisoria curva estilo Netflix, grosor constante */}
          <div style={{ position: "relative", width: "100%"}}>
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
              {/* Línea curva */}
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
              {/* Fondo negro curvo debajo de la línea */}
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
              {/* Resplandor azul siguiendo la curva */}
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
            <div><h1>Tendencias</h1></div>
            <div style={{position: "absolute",top: "150px", left: "50%",transform: "translateX(-50%)",zIndex: 2,width: "195px",height: "245px",background: "#222",borderRadius: "8px",display: "flex",alignItems: "center",justifyContent: "center",color: "#fff",fontSize: "1.5rem"}}>
              Card de ejemplo
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;