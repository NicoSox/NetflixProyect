import '../../styles/css/Login.css'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ErrorMessage from '../reusable/ErrorMessage';
import { useRememberCredentials } from '../../utils/hooks/useRememberCredentials';
import { handleLoginSubmit } from '../../utils/handlers/handleLoginSubmit';
import { handleFieldBlur } from '../../utils/handlers/handleFieldBlur';
import { useNavigate } from 'react-router-dom';


const Main = () => {

  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [expanded, setExpanded] = useState(false)
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [modoCodigo, setModoCodigo] = useState(false);
  const navigate = useNavigate();
  const [visible, setVisible]=useState();


  useRememberCredentials(setEmail, setPassword, setRemember);


  const handleExpand = () => {
    if (!expanded) {
      setExpanded(true);
    }
  };

const handleBlur = (field) => {
  handleFieldBlur({ field, email, password, modoCodigo, setErrors });
};

const handleRememberAccount =() =>{
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

const handleSubmit = (e) => {
  handleLoginSubmit({
    e,
    email,
    password,
    remember,
    modoCodigo,
    setErrors
  }); 
};

const handleEye =()=>{
setVisible(!visible);
console.log(visible, "es visible")
};
  
  return (
    <>
    <div className='img-background'>
      <img className="img img-logo" src="/assets/logo.png" alt="Logo" />

      <div className="card card-login-main">
        <div className="card card-login">

            <div><h1 className='title-login'>Iniciar sesión</h1></div>
      
              <form onSubmit={handleSubmit}>
            <div className="input-container">
              <input className={`input ${errors.email ? 'input-error' : ''}`} type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => handleBlur('email')} onFocus={() => {if (errors.email) {setErrors(prev => ({ ...prev, email: '' }));}}} placeholder=''/>
              <label htmlFor="email" className="label-float">Email o número de celular</label>
              <ErrorMessage message={errors.email} />
            </div>

            {!modoCodigo && ( 
              <div className="input-container">
                <input className={`input ${errors.password ? 'input-error' : ''}`}type="password"id="password"value={password} onChange={(e) => {setPassword(e.target.value);if (errors.password) {setErrors(prev => ({ ...prev, password: '' }));}}}onFocus={() => {if (errors.password) {setErrors(prev => ({ ...prev, password: '' }));}}}onBlur={() => handleBlur('password')}placeholder='' />
                <label htmlFor="password" className="label-float"onClick={handleEye}>Contraseña</label>
                <ErrorMessage message={errors.password} />
              </div>)}

            {modoCodigo && (<p style={{ marginTop: '-30px',marginBottom:"40px", color: '#8c8c8c', fontSize: '14px', textAlign:"center"}}>Pueden aplicar tarifas de SMS y datos</p>)}

            <div>
              <button className='button button-login' >{modoCodigo ? 'Enviar codigo de inicio de sesión' : 'Iniciar sesión'}</button>
            </div>

            <p style={{ fontSize: "15px", textAlign: "center", marginTop: "15px" }}>O</p>

          <div>
              <button className='button button-login-code' onClick={() => setModoCodigo(!modoCodigo)}>{modoCodigo ? 'Ingresar con contraseña' : 'Usar un código de inicio de sesión'}</button>
          </div>
          </form>
          <div className='forgot-password-card'>
            <Link to="/LoginHelp" className="forgot-password-link">¿Olvidaste la contraseña?</Link>
          </div>

          <div>
            <label className="checkbox-container">
              <input type="checkbox" name="aceptar" checked={remember} onChange={handleRememberAccount} />
              <span className="checkmark"></span>
              Recordarme
            </label>
          </div>

          <div className='card card-subscribe'>
            <p style={{ color: "#bbbbbb" }}>¿Primera vez en netflix? <Link to="/Subscribe" className='link-to-suscribe'>Suscribete ya.</Link></p>
            <p style={{ marginTop: "10px", fontSize: "12px", color: "#8c8c8c" }}>Esta página está protegida por Google reCAPTCHA para comprobar que no eres un robot.</p>
          </div>

          <div className={`card-info ${expanded ? 'expanded' : ''}`} onClick={handleExpand}>
            {!expanded &&
              <p style={{ textDecoration: "Underline", marginLeft: "-15px", color: "#0071eb", fontSize: "14px" }}>Más info.</p>}
            {expanded && <div className="extra-info" style={{ cursor: "text", fontSize: "13px", color: "#8c8c8c" }}>La información recopilada por Google reCAPTCHA está sujeta a la <a href="https://policies.google.com/privacy" target="_blank" style={{ cursor: "pointer", color: "#0071eb" }}>Política de privacidad</a> y a las <a href="https://policies.google.com/terms" target="_blank" style={{ cursor: "pointer", color: "#0071eb" }}>Condiciones de servicio de Google</a>, y se utiliza para proporcionar, mantener y mejorar el servicio de reCAPTCHA, así como para fines generales de seguridad (Google no la utiliza para personalizar publicidad).</div>}
          </div>
        
        </div>
      </div>
      </div>
    </>
  );
};

export default Main;