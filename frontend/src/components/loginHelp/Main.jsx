import '../../styles/css/NavbarLoginHelp.css'
import ErrorMessage from '../reusable/ErrorMessage';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

const Main = () => {
  // Estados para inputs, errores, éxito y control de UI
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [metodo, setMetodo] = useState('email'); // 'email' o 'sms'
  const [formrec, setFormrec] = useState(true); // true: formulario recuperación, false: búsqueda usuario
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [foundUser, setFoundUser] = useState(null); // usuario encontrado en búsqueda avanzada
  const [loading, setLoading] = useState(false);

  // Componente interno para mostrar mensaje de éxito
  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div
        className="success-message"
        style={{ color: 'green', fontSize: '15px', marginLeft: '10px' }}
      >
        {message}
      </div>
    );
  };

  // Validar email con regex simple
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

  // Validación de campos nombre y apellido (básico)
  const validateSearch = (nombre, apellido) => {
    const nombreStr = typeof nombre === 'string' ? nombre.trim() : '';
    const apellidoStr = typeof apellido === 'string' ? apellido.trim() : '';

    if (!nombreStr) {
      return 'Ingresa tu nombre.';
    }
    if (!apellidoStr) {
      return 'Ingresa tu apellido.';
    }
    return '';
  };

  // Validación de número de tarjeta
  const validateTarjeta = (tarjeta) => {
    const tarjetaStr = typeof tarjeta === 'string' ? tarjeta.trim() : '';
    const soloNumeros = /^\d+$/;
    if (!tarjetaStr) {
      return 'Ingresa el número de tarjeta.';
    }
    if (!soloNumeros.test(tarjetaStr)) {
      return 'El número de tarjeta debe contener solo números.';
    }
    if (tarjetaStr.length !== 16) {
      return 'El número de tarjeta debe tener 16 dígitos.';
    }
    return '';
  };

  // Validación general de formulario búsqueda avanzada
  const validateFields = () => {
    let newErrors = {};
    if (!nombre.trim()) newErrors.nombre = 'Nombre es obligatorio';
    if (!apellido.trim()) newErrors.apellido = 'Apellido es obligatorio';
    if (!tarjeta.trim()) newErrors.tarjeta = 'Tarjeta es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar correo de recuperación usando emailjs (solo email por ahora)
  const sendRecoveryEmail = async (e) => {
    e.preventDefault();

    // Validar email localmente
    const errorMsg = validateEmail(email);
    setErrors({ email: errorMsg });
    setSuccess('');
    if (errorMsg) return;

    try {
      // Consultar backend si el email existe
      const response = await fetch('http://localhost:3007/cuentas/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: email }),
      });

      const data = await response.json();

      if (!response.ok || !data.exists) {
        setErrors({ email: 'El email no está registrado' });
        return;
      }

      // Link para resetear contraseña
      const reset_link = 'http://localhost:5173/resetPassword'; 

      if (metodo === 'email') {
        // Enviar email con EmailJS
        await emailjs.send(
          'service_t49mrtk',
          'template_3gf0bpd',
          {
            user_email: email,
            reset_link,
          },
          'PKIgV7RsnHTivu_i-'
        );
        setSuccess('¡Correo de recuperación enviado!');
        localStorage.setItem('emailEnviado', JSON.stringify(data.cuenta));
      } else if (metodo === 'sms') {
        // Pendiente implementar SMS
        setSuccess('¡SMS de recuperación enviado! (pendiente implementar)');
      }
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      setErrors({ login: 'Error de red al enviar correo' });
    }
  };

  // Funciones blur para validación individual
  const handleBlur = () => {
    const errorMsg = validateEmail(email);
    setErrors({ email: errorMsg });
  };

  const handleBlurNombre = () => {
    const errorMsg = nombre.trim() === '' ? 'Ingresa tu nombre.' : '';
    setErrors(prev => ({ ...prev, nombre: errorMsg }));
  };
  const handleBlurApellido = () => {
    const errorMsg = apellido.trim() === '' ? 'Ingresa tu apellido.' : '';
    setErrors(prev => ({ ...prev, apellido: errorMsg }));
  };
  const handleBlurTarjeta = () => {
    const errorMsg = validateTarjeta(tarjeta);
    setErrors(prev => ({ ...prev, tarjeta: errorMsg }));
  };

  // Buscar usuario con nombre, apellido y tarjeta
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    setFoundUser(null);
    setErrors({});

    try {
      const res = await fetch('http://localhost:3007/cuentas/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, apellido, tarjeta }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrors({ general: errData.error || 'Error al buscar la cuenta' });
      } else {
        const user = await res.json();
        setFoundUser(user);
        localStorage.setItem('emailEnviado', JSON.stringify(user));
        console.log('emailEnviado')
      }
    } catch (error) {
      setErrors({ general: 'Error de red' });
    }

    setLoading(false);
  };

  return (
    <>
      {/* Overlay con usuario encontrado */}
      {foundUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "20px"
          }}
        >
          <h2>Cuenta encontrada</h2>
          <p><strong>Email:</strong> {foundUser.mail}</p>
          <p>
            Para restablecer tu contraseña, haz click en el siguiente enlace:<br />
            <Link
              to={`/ResetPassword`}
              style={{
                marginTop: "10px",
                color: "#00bfff",
                textDecoration: "underline",
                fontWeight: "bold"
              }}
            >
              Cambiar mi contraseña
            </Link>
          </p>
        </div>
      )}

      <div className='card-principal-main-loginhelp'>
        <div className='card-main-loginhelp'>

          {/* Formulario principal recuperación */}
          {formrec && (
            <>
              <div style={{ marginTop: "-50px", marginLeft: "40px", marginRight: "60px", fontSize: "15px", fontWeight: "bold" }}>
                <h1>Actualizar la contraseña, el email o el teléfono</h1>
              </div>

              <div style={{ display: "flex", width: "100%", marginTop: "20px", marginBottom: "20px" }}>
                <p style={{ marginLeft: "40px" }}>¿Cómo le gustaría recuperarla?</p>
              </div>

              <form action="#" onSubmit={sendRecoveryEmail}>

                {/* Selector método recuperación */}
                <div style={{ display: "flex", width: "100%", marginBottom: "10px" }}>
                  <label style={{ marginLeft: "60px" }}>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      name='recuperacion-email'
                      checked={metodo === 'email'}
                      onChange={() => setMetodo('email')}
                    />
                    <span></span> Email
                  </label>
                </div>

                <div style={{ display: "flex", width: "100%" }}>
                  <label style={{ marginLeft: "60px" }}>
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      name='message-text'
                      checked={metodo === 'sms'}
                      onChange={() => setMetodo('sms')}
                    />
                    <span></span> Mensaje de texto
                  </label>
                </div>

                {/* Formulario email */}
                {metodo === 'email' && (
                  <div>
                    <p style={{ marginTop: "20px", marginLeft: "40px", marginRight: "50px" }}>
                      Te enviaremos un email con instrucciones para restablecer tu contraseña.
                    </p>
                    <div className='input-loginhelp-container'>
                      <input
                        className={`input-loginhelp${errors.email ? ' input-error' : ''}`}
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          setErrors(prev => ({ ...prev, email: '' }));
                          setSuccess('');
                        }}
                        onBlur={() => {
                          const errorMsg = validateEmail(email);
                          setErrors(prev => ({ ...prev, email: errorMsg }));
                        }}
                        required
                        placeholder=""
                      />
                      <label htmlFor="email" className="label-float-loginhelp">Email</label>
                    </div>

                    <div style={{ display: "flex", height: "30px", width: "80%", marginLeft: "36px" }}>
                      {success ? <SuccessMessage message={success} /> : <ErrorMessage message={errors.email} />}
                    </div>

                    <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
                      <button type="submit" className="button-loginhelp-help" style={{ marginTop: "16px" }}>
                        Enviarme email
                      </button>
                    </div>
                  </div>
                )}

                {/* Formulario SMS (pendiente) */}
                {metodo === 'sms' && (
                  <div>
                    <p style={{ marginTop: "20px", marginLeft: "40px", marginRight: "50px" }}>
                      Te enviaremos un SMS con el código de verificación para que restablezcas tu contraseña. Pueden aplicar tarifas de SMS y datos.
                    </p>
                    <div className='input-loginhelp-container'>
                      <input
                        className={`input-loginhelp${errors.email ? ' input-error' : ''}`}
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur}
                        onFocus={() => { if (errors.email) setErrors(prev => ({ ...prev, email: '' })); }}
                        onClick={(e) => e.preventDefault()}
                        required
                        placeholder=""
                      />
                      <label htmlFor="tel" className="label-float-loginhelp">Número de celular</label>
                    </div>
                    <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}>
                      <button type="submit" className="button-loginhelp-help" style={{ marginTop: "16px" }}>
                        Enviarme SMS
                      </button>
                    </div>
                  </div>
                )}

                {/* Link para cambiar a búsqueda avanzada */}
                <p
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    textDecoration: "underline",
                    cursor: "pointer",
                    marginTop: "30px",
                    marginLeft: "40px"
                  }}
                  onClick={() => setFormrec(!formrec)}
                >
                  No me acuerdo de mi email ni de mi teléfono.
                </p>
              </form>
            </>
          )}

          {/* Formulario búsqueda avanzada */}
          {!formrec && (
            <div>
              <div style={{ marginTop: "10px", marginLeft: "40px", marginRight: "60px", fontSize: "15px", fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>
                <h1>Olvidaste tu email/contraseña</h1>
              </div>
              <div style={{ marginTop: "20px", marginLeft: "40px", marginRight: "60px", fontSize: "16px", fontFamily: "'Roboto', sans-serif" }}>
                <p>Proporciona esta información para ayudarnos a encontrar tu cuenta (todos los campos son obligatorios):</p>
              </div>

              <form onSubmit={handleSearch}>

                <div className='input-loginhelp-container'>
                  <input
                    style={{ display: "flex", marginTop: "30px" }}
                    className={`input-loginhelp${errors.nombre ? ' input-error' : ''}`}
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    onBlur={handleBlurNombre}
                    onFocus={() => { if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' })); }}
                    required
                    placeholder=""
                  />
                  <label htmlFor="nombre" className="label-float-loginhelp1">Nombre de la cuenta</label>
                </div>
                <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "25px", marginBottom: "-10px", marginLeft: "40px" }}>
                  <ErrorMessage message={errors.nombre} />
                </div>

                <div className='input-loginhelp-container'>
                  <input
                    className={`input-loginhelp${errors.apellido ? ' input-error' : ''}`}
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={apellido}
                    onChange={e => setApellido(e.target.value)}
                    onBlur={handleBlurApellido}
                    onFocus={() => { if (errors.apellido) setErrors(prev => ({ ...prev, apellido: '' })); }}
                    required
                    placeholder=""
                  />
                  <label htmlFor="apellido" className="label-float-loginhelp2">Apellido de la cuenta</label>
                </div>
                <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "10px", marginBottom: "-10px", marginLeft: "40px" }}>
                  <ErrorMessage message={errors.apellido} />
                </div>

                <div className='input-loginhelp-container'>
                  <input
                    className={`input-loginhelp${errors.tarjeta ? ' input-error' : ''}`}
                    type="text"
                    id="tarjeta"
                    name="tarjeta"
                    value={tarjeta}
                    onChange={e => setTarjeta(e.target.value)}
                    onBlur={handleBlurTarjeta}
                    onFocus={() => { if (errors.tarjeta) setErrors(prev => ({ ...prev, tarjeta: '' })); }}
                    required
                    placeholder=""
                  />
                  <label htmlFor="tarjeta" className="label-float-loginhelp3">Número de tarjeta de crédito o débito registrada</label>
                </div>
                <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "10px", marginBottom: "-10px", marginLeft: "40px" }}>
                  <ErrorMessage message={errors.tarjeta} />
                </div>

                {/* Botones encontrar cuenta y cancelar */}
                <button type="submit" className="button-search-loginhelp">Encontrar cuenta</button>
                <button
                  type="button"
                  className='button-cancel-loginhelp'
                  onClick={() => setFormrec(true)}
                  style={{height:"36px",width:"100px",fontSize:"16px",color:"black"}}
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}

        </div>

        <div className='card-background-loginhelp'></div>
      </div>
    </>
  );
};

export default Main;
