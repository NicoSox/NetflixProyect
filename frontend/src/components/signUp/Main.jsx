import React, { useState, useEffect } from 'react';
import '../../styles/css/SignUp.css';
import { useNavigate } from 'react-router-dom';

const Main = () => {

  const [placeholder, setPlaceholder] = useState('');
  // Estado para mostrar u ocultar la contraseña en el input
  const [visible, setVisible] = useState(false);

  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Estado para guardar la lista de planes que se obtienen desde el backend
  const [plans, setPlans] = useState([]);

  // Estado para controlar en qué paso del formulario estamos (1, 2 o 3)
  const [step, setStep] = useState(1);

  // Estado para guardar los errores de validación en los diferentes campos
  const [errors, setErrors] = useState({});

  // Estado para mostrar un mensaje de éxito cuando el usuario se crea correctamente
  const [successAlert,setSuccessAlert]=useState('')

  // Estado para los datos que el usuario completa en el formulario
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    plan: '',       
    tarjeta: '',
    nombreTarjeta: '',
    vencimiento: '',
    codigo: '',
    password: '',    
    rol_id: 2   // Rol por defecto (que es el usuario estandar)     
  });

  // Función que se encarga de crear el usuario enviando los datos al backend
  const crearUsuario = async () => {
    const data = {
      username: '',    // Aquí el username no se está usando, se deja vacío
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      mail: form.email,
      pass: form.password,
      id_plan: form.plan,
      rol_id: form.rol_id,
      numero_tarjeta: form.tarjeta
    };

    try {
      // Petición POST para crear usuario
      const res = await fetch('http://localhost:3007/cuentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      // Si la respuesta es correcta, mostramos mensaje de éxito y redirigimos
      if (res.ok) {
        setSuccessAlert('Usuario creado exitosamente, redirigiendo');
        setTimeout(() => {
          window.location.href = '/';
        }, 5000);
      } else {
        // Si hay error, se muestra en consola para debugging
        console.error('Error al crear usuario:', json);
      }
    } catch (error) {
      // Capturamos errores de red o inesperados
      console.error('Error en fetch:', error);
    }
  };

  // Maneja el cambio en los inputs y actualiza el estado del formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Limpia el error correspondiente si el usuario corrige el input
    setErrors({ ...errors, [e.target.name]: '' });
  };

  // Validaciones para el primer paso del formulario: datos personales
  const validateStep1 = async () => {
    const newErrors = {};
    const { nombre, apellido, email, password } = form;

    if (!nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!apellido.trim()) newErrors.apellido = 'El apellido es obligatorio';

    if (!email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      newErrors.email = 'Email inválido';
    } else {
      try {
        // Verifica en el backend si el email ya está registrado
        const res = await fetch('http://localhost:3007/cuentas/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mail: email })
        });

        const data = await res.json();

        if (data.exists) newErrors.email = 'El email ya está registrado';
      } catch (err) {
        console.error('Error al verificar email:', err);
        newErrors.email = 'Error al verificar email, intente más tarde';
      }
    }

    if (!password?.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6 || password.length > 60) {
      newErrors.password = 'La contraseña debe tener entre 6 y 60 caracteres';
    }

    // Actualizamos el estado de errores
    setErrors(newErrors);

    // Retornamos si no hay errores para continuar al siguiente paso
    return Object.keys(newErrors).length === 0;
  };

  // Validación para el tercer paso del formulario: datos del medio de pago
  const validateStep3 = () => {
    let newErrors = {};

    // Validar número de tarjeta (16 dígitos numéricos)
    if (!form.tarjeta.trim()) {
      newErrors.tarjeta = 'La tarjeta es obligatoria';
    } else if (!/^\d{16}$/.test(form.tarjeta.replace(/\s/g, ''))) {
      newErrors.tarjeta = 'La tarjeta debe tener 16 dígitos numéricos';
    }

    // Validar nombre que figura en la tarjeta
    if (!form.nombreTarjeta.trim()) {
      newErrors.nombreTarjeta = 'El nombre en la tarjeta es obligatorio';
    }

    // Validar fecha de vencimiento en formato MM/AA
    if (!form.vencimiento.trim()) {
      newErrors.vencimiento = 'La fecha de vencimiento es obligatoria';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.vencimiento)) {
      newErrors.vencimiento = 'Formato inválido (MM/AA)';
    }

    // Validar código de seguridad de 3 o 4 dígitos
    if (!form.codigo.trim()) {
      newErrors.codigo = 'El código es obligatorio';
    } else if (!/^\d{3,4}$/.test(form.codigo)) {
      newErrors.codigo = 'Código inválido';
    }

    // Guardamos los errores que haya
    setErrors(newErrors);

    // Retornamos true si no hay errores, para enviar el formulario
    return Object.keys(newErrors).length === 0;
  };

  // Función que maneja el botón "Siguiente" para avanzar en los pasos del formulario
  const nextStep = async (e) => {
    e.preventDefault();

    if (step === 1) {
      // Valida el primer paso antes de avanzar
      const isValid = await validateStep1();
      if (isValid) setStep(2);
    } else if (step === 2) {
      // No hay validación para paso 2, solo avanza
      setStep(3);
    } else if (step === 3) {
      // Valida el paso 3 antes de enviar los datos al backend
      const isValid = validateStep3();
      if (isValid) handleSubmit(e);
    }
  };

  // Función para retroceder un paso en el formulario
  const prevStep = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  // Cambia el plan seleccionado, actualizando el estado form.plan
  const handlePlanSelect = (idPlan) => {
    setForm({ ...form, plan: idPlan });
  };

  // Envía el formulario llamando a la función crearUsuario
  const handleSubmit = (e) => {
    e.preventDefault();
    crearUsuario();
  };

  // Al cargar el componente, obtiene la lista de planes disponibles desde el backend
  useEffect(() => {
    fetch('http://localhost:3007/planes')
      .then(res => res.json())
      .then(data => {
        setPlans(data);
        // Selecciona el primer plan por defecto si hay planes
        if (data.length > 0) {
          setForm(prevForm => ({ ...prevForm, plan: data[0].id_plan }));
        }
      })
      .catch(err => {
        console.error('Error al cargar los planes:', err);
      });
  }, []);

  // Alterna la visibilidad del campo contraseña
  const handleEye = () => {
    setVisible((prev) => !prev);
  }

  return (
    <div className="signup-carousel-card">
      <form onSubmit={nextStep}>

        {/* Paso 1: datos personales */}
        {step === 1 && (
          <div className="carousel-step">
                  <h2 style={{marginTop:"",marginBottom:"60px"}}>Datos Personales</h2>
            <div className="input-container">
              <input className="input" type="text" name="nombre" value={form.nombre} onChange={handleChange} required placeholder=""/>
              <label htmlFor="nombre" className="label-float">Nombre</label>
              {errors.nombre && <span style={{marginTop:"-14px",marginBottom:"40px"}}className="input-error-msg">{errors.nombre}</span>}
            </div>

            <div className="input-container">
              <input className="input" type="text"  name="apellido" value={form.apellido} onChange={handleChange} required placeholder=""/>
              <label htmlFor="apellido" className="label-float">Apellido</label>
              {errors.apellido && <span style={{marginTop:"-14px",marginBottom:"40px"}}className="input-error-msg">{errors.apellido}</span>}
            </div>

            <div className="input-container">
              <input className="input"type="email" name="email"value={form.email}onChange={handleChange} required placeholder=""/>
              <label htmlFor="email" className="label-float">Email</label>
              {errors.email && <span style={{marginTop:"-14px",marginBottom:"40px"}}className="input-error-msg">{errors.email}</span>}
            </div>

            <div className="input-container">
              <input className="input" type={visible ? "text" : "password"}  name="password" value={form.password} onChange={handleChange} required placeholder=""/>
              <label htmlFor="password" className="label-float">Contraseña</label>
              <i onClick={handleEye} className={visible ? "bi bi-eye-fill" : "bi bi-eye-slash-fill"} style={{position: "absolute",right: "10px",top: "40%",transform: "translateY(-50%)", cursor: "pointer",fontSize: "1.3em",color: "#888"}}></i>
              {errors.password && <span style={{marginTop:"-14px",marginBottom:"40px"}}className="input-error-msg">{errors.password}</span>}
            </div>

            <div className="carousel-buttons">
              <button type="button" className="carousel-btn next" onClick={nextStep}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Paso 2: elegir plan */}
        {step === 2 && (
          <div className="carousel-step">
            <h2>Elegí tu plan</h2>

            <div className="plans-container">
              {plans.map(plan => (
                <div
                  key={plan.id_plan}
                  className={`plan-card${form.plan == plan.id_plan ? ' selected' : ''}`}
                  onClick={() => handlePlanSelect(plan.id_plan)}
                >
                  <h3>{plan.nombre_plan}</h3>
                  <p>${plan.precio.toLocaleString()} U$D</p>
                  <p>{plan.cantidad_perfiles} pantalla{plan.cantidad_perfiles > 1 ? 's' : ''} en simultáneo</p>
                  <p>Resolución máxima: {plan.resolucion_maxima}</p>
                </div>
              ))}
            </div>

            <div className="carousel-buttons">
              <button type="button" className="carousel-btn prev" onClick={prevStep}>Atrás</button>
              <button type="button" className="carousel-btn next" onClick={nextStep}>Siguiente</button>
            </div>
          </div>
        )}

        {/* Paso 3: medio de pago */}
        {step === 3 && (
          <div className="carousel-step">
            <h2 style={{marginTop:"",marginBottom:"60px"}}>Facturacion</h2>

            <div className="input-container">
              <input className="input" type="text" name="tarjeta" value={form.tarjeta} onChange={handleChange} required placeholder="" maxLength={16} inputMode="numeric" />
              <label htmlFor="tarjeta" className="label-float">Número de tarjeta</label>
              {errors.tarjeta && <span className="input-error-msg">{errors.tarjeta}</span>}
            </div>

            <div className="input-container">
              <input className="input" type="text" name="nombreTarjeta" value={form.nombreTarjeta} onChange={handleChange} required placeholder="" />
              <label htmlFor="nombreTarjeta" className="label-float">Nombre que figura en la tarjeta</label>
              {errors.nombreTarjeta && <span className="input-error-msg">{errors.nombreTarjeta}</span>}
            </div>

            <div className="input-container">
              <input className="input" type="text" name="vencimiento" value={form.vencimiento} onChange={handleChange} required placeholder={placeholder} onClick={()=>setPlaceholder('MM/AA')} onBlur={() => setPlaceholder('')} maxLength={5} />
              <label htmlFor="vencimiento" className="label-float">Fecha de vencimiento</label>
              {errors.vencimiento && <span className="input-error-msg">{errors.vencimiento}</span>}
            </div>

            <div className="input-container">
              <input className="input" type="text" name="codigo" value={form.codigo} onChange={handleChange} required placeholder="" maxLength={4} inputMode="numeric" />
              <label htmlFor="codigo" className="label-float">Código de seguridad</label>
              {errors.codigo && <span className="input-error-msg">{errors.codigo}</span>}
            </div>

            <div><p>{successAlert}</p></div>

            <div className="carousel-buttons">
              <button type="button" className="carousel-btn prev" onClick={prevStep}>Atrás</button>
              <button type="submit" className="carousel-btn next">Registrarme</button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default Main;
