import '../../styles/css/NavbarLoginHelp.css'
import ErrorMessage from '../reusable/ErrorMessage';
import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Link } from 'react-router-dom';

const Main = () => {
  const [email, setEmail] = useState('');
  const [sms, setSms] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [metodo, setMetodo] = useState('email');
  const [formrec, setFormrec] = useState(true);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [tarjeta, setTarjeta] = useState('');



  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    return (
      <div className="success-message" style={{ color: 'green', fontSize: '15px', marginLeft: '10px' }}>
        {message}
      </div>
    );
  };

  const validateEmail = (email, sms) => {
    const emailStr = typeof email === 'string' ? email : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailStr.trim()) {
      return 'Ingresa un email válido.';
    } else if (!emailRegex.test(emailStr)) {
      return 'Ingresa un email con formato válido.';
    }
    return '';
  };


  const validateSearch = (nombre, apellido, tarjeta) => {
    const nombreStr = typeof nombre === 'string' ? nombre.trim() : '';
    const apellidoStr = typeof apellido === 'string' ? apellido.trim() : '';
    const tarjetaStr = typeof tarjeta === 'string' ? tarjeta.trim() : typeof tarjeta === 'number' ? tarjeta.toString() : '';

    if (!nombreStr) {
      return 'Ingresa tu nombre.';
    }

    if (!apellidoStr) {
      return 'Ingresa tu apellido.';
    }
    return '';
  };


  const sendRecoveryEmail = (e) => {
    e.preventDefault();
    if (metodo === 'email') {
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

    } else if (metodo === 'sms') { }
  };


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

  return (
    <>
      <div className='card-principal-main-loginhelp'>
        <div className='card-main-loginhelp'>
          {formrec && (
            <>
              <div style={{ marginTop: "-50px", marginLeft: "40px", marginRight: "60px", fontSize: "15px", font: "bold" }}>
                <h1>Actualizar la contraseña, el email o el teléfono</h1>
              </div>

              <div style={{ display: "flex", width: "100%", marginTop: "20px", marginBottom: "20px" }}><p style={{ marginLeft: "40px" }}>¿Como le gustaria recuperarla?</p></div>

              <form action="#" onSubmit={sendRecoveryEmail}>

                <div style={{ display: "flex", width: "100%", marginBottom: "10px" }}>
                  <label style={{ marginLeft: "60px" }}>
                    <input type="checkbox" className="custom-checkbox" name='recuperacion-email' checked={metodo === 'email'} onChange={() => setMetodo('email')} /><span></span>
                    Email
                  </label>
                </div>

                <div style={{ display: "flex", width: "100%" }}>
                  <label style={{ marginLeft: "60px" }}>
                    <input type="checkbox" className="custom-checkbox" name='message-text' checked={metodo === 'sms'} onChange={() => setMetodo('sms')} /><span></span>
                    Mensaje de texto
                  </label>
                </div>

                {metodo === 'email' && (
                  <div>
                    <p style={{ marginTop: "20px", marginLeft: "40px", marginRight: "50px" }}>
                      Te enviaremos un email con instrucciones para restablecer tu contraseña.
                    </p>
                    <div className='input-loginhelp-container'>
                      <input className={`input-loginhelp${errors.email ? ' input-error' : ''}`} type="email" id="email" name="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); setSuccess(''); }} onBlur={() => { const errorMsg = validateEmail(email); setErrors(prev => ({ ...prev, email: errorMsg })); }} required placeholder="" />
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

                {metodo === 'sms' && (
                  <div>
                    <p style={{ marginTop: "20px", marginLeft: "40px", marginRight: "50px" }}>Te enviaremos un SMS con el código de verificación para que restablezcas tu contraseña. Pueden aplicar tarifas de SMS y datos.</p>
                    <div className='input-loginhelp-container'>
                      <input className={`input-loginhelp${errors.email ? ' input-error' : ''}`} type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleBlur} onFocus={() => { if (errors.email) { setErrors(prev => ({ ...prev, email: '' })); } }} onClick={(e) => e.preventDefault()} required placeholder="" />
                      <label htmlFor="tel" className="label-float-loginhelp">Número de celular</label>
                    </div>
                    <div style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "center" }}><button type="submit" className="button-loginhelp-help" style={{ marginTop: "16px" }}>Enviarme SMS</button></div>
                  </div>)}
                <p style={{ fontFamily: "'Roboto', sans-serif", textDecoration: "underline", cursor: "Pointer", marginTop: "30px", marginLeft: "40px" }} onClick={() => setFormrec(!formrec)}>No me acuerdo de mi email ni de mi teléfono.</p>
              </form>
            </>)}
          {!formrec && (
            <div>
              <div style={{ marginTop: "10px", marginLeft: "40px", marginRight: "60px", fontSize: "15px", fontWeight: "bold", fontFamily: "'Roboto', sans-serif" }}>
                <h1>Olvidaste tu email/contraseña</h1>
              </div>
              <div style={{ marginTop: "20px", marginLeft: "40px", marginRight: "60px", fontSize: "16px", fontFamily: "'Roboto', sans-serif" }}> <p>Proporciona esta información para ayudarnos a encontrar tu cuenta (todos los campos son obligatorios):</p></div>


              <form action="#" onSubmit={(e) => { validateSearch(nombre, apellido, tarjeta); e.preventDefault(); }}>
                <div>
                  <div>

                    <div className='input-loginhelp-container'>
                      <input style={{ display: "flex", marginTop: "30px" }} className={`input-loginhelp${errors.nombre ? ' input-error' : ''}`} type="text" id="nombre" name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} onBlur={handleBlurNombre} onFocus={() => { if (errors.nombre) setErrors(prev => ({ ...prev, nombre: '' })); }} required placeholder="" />
                      <label htmlFor="nombre" className="label-float-loginhelp1">Nombre de la cuenta</label>
                    </div>
                    <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "25px", marginBottom: "-10px", marginLeft: "40px" }}><ErrorMessage message={errors.nombre} /></div>

                    <div className='input-loginhelp-container'>
                      <input className={`input-loginhelp${errors.apellido ? ' input-error' : ''}`} type="text" id="apellido" name="apellido" value={apellido} onChange={e => setApellido(e.target.value)} onBlur={handleBlurApellido} onFocus={() => { if (errors.apellido) setErrors(prev => ({ ...prev, apellido: '' })); }} required placeholder="" />
                      <label htmlFor="apellido" className="label-float-loginhelp2">Apellido de la cuenta</label>
                    </div>
                    <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "10px", marginBottom: "-10px", marginLeft: "40px" }}><ErrorMessage message={errors.apellido} /></div>

                    <div className='input-loginhelp-container'>
                      <input className={`input-loginhelp${errors.tarjeta ? ' input-error' : ''}`} type="text" id="tarjeta" name="tarjeta" value={tarjeta} onChange={e => setTarjeta(e.target.value)} onBlur={handleBlurTarjeta} onFocus={() => { if (errors.tarjeta) setErrors(prev => ({ ...prev, tarjeta: '' })); }} required placeholder="" />
                      <label htmlFor="tarjeta" className="label-float-loginhelp3">Número de tarjeta de credito o debito registrada</label>
                    </div>
                    <div style={{ height: "20px", width: "80%", alignItems: "center", marginTop: "10px", marginBottom: "-10px", marginLeft: "40px" }}><ErrorMessage message={errors.tarjeta} /></div>
                  </div>


                </div>
              </form>
              <button className='button-search-loginhelp'>Encontrar cuenta</button>
              <button className='button-cancel-loginhelp' onClick={() => setFormrec(true)} >Cancelar</button>
            </div>
          )}
          <>
          </>
        </div>
        <div className='card-background-loginhelp'></div>
      </div>
    </>
  );
};

export default Main;