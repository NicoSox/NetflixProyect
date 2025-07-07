import React, { useState } from 'react';

const Main = () => {
  // Estado para mensajes generales y control de errores y éxito
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Estado para controlar visibilidad de contraseñas (toggle mostrar/ocultar)
  const [visible,setVisible]=useState(false);

  // Estado que guarda los valores de los inputs del formulario
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: ''
  });

  // Actualiza el estado del formulario cuando el usuario escribe en inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});  // Limpiar errores previos
    setSuccess(''); // Limpiar mensajes de éxito previos

    // Validaciones básicas en el cliente
    if (!form.email || !form.email.includes('@')) {
      setErrors({ email: 'Email inválido' });
      return;
    }
    if (!form.password || form.password.length < 6 || form.password.length > 60) {
      setErrors({ password: 'La contraseña debe tener entre 6 y 60 caracteres' });
      return;
    }
    if (form.password !== form.confirm) {
      setErrors({ confirm: 'Las contraseñas no coinciden' });
      return;
    }

    try {
      // Consulta al backend para verificar si el email existe
      const response = await fetch('http://localhost:3007/cuentas/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mail: form.email }),
      });

      const data = await response.json();
      console.log(data.cuenta.id_cuenta)
      // Si el email no existe o hubo error, se muestra el error
      if (!response.ok || !data.exists) {
        setErrors({ email: 'El email no está registrado' });
        return;
      }

      // Obtener el id del usuario para actualizar la contraseña
      const userId = data.cuenta.id_cuenta;

      // Llamada para actualizar la contraseña del usuario
      const updateResponse = await fetch(`http://localhost:3007/cuentas/update-pass/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pass: form.password }),
      });

      const updateData = await updateResponse.json();

      // Si la actualización falla, mostrar error
      if (!updateResponse.ok || !updateData.success) {
        setErrors({ general: updateData.message || 'Error al actualizar la contraseña' });
        return;
      }
      localStorage.removeItem('emailEnviado');
      // Mensaje de éxito y redirección automática a login
      setSuccess('¡Contraseña actualizada correctamente! Redirigiendo a Login');
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);

    } catch (error) {
      // Captura errores de red o inesperados
      console.error('Error en el proceso:', error);
      setErrors({ general: 'Error de red. Intenta nuevamente.' });
    }
  };

  // Alternar visibilidad del password y confirm password (mostrar/ocultar)
  const handleEye = () => {
    setVisible((prev) => !prev);
  }

  return (
    <div className="signup-carousel-card">
      <h1 style={{marginBottom:"40px"}}>Restablecer contraseña</h1>
      <form onSubmit={handleSubmit}>

        {/* Input para email */}
        <div className="input-container">
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="email" className="label-float">Email</label>
          {/* Mostrar error si hay */}
          {errors.email && (
            <p style={{ color: "red", marginTop: "-10px", marginBottom:"40px" }}>
              {errors.email}
            </p>
          )}
        </div>

        {/* Input nueva contraseña con icono para mostrar/ocultar */}
        <div className="input-container" style={{ position: "relative" }}>
          <input
            className="input"
            type={visible ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="password" className="label-float">Nueva contraseña</label>

          {/* Icono de ojo para alternar visibilidad */}
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

          {/* Mostrar error si existe */}
          {errors.password && (
            <p style={{ color: "red", marginTop: "-10px", marginBottom:"40px" }}>
              {errors.password}
            </p>
          )}
        </div>

        {/* Input confirmar contraseña con icono igual */}
        <div className="input-container" style={{ position: "relative" }}>
          <input
            className="input"
            type={visible ? "text" : "password"}
            name="confirm"
            value={form.confirm}
            onChange={handleChange}
            placeholder=""
          />
          <label htmlFor="confirm" className="label-float">Confirmar contraseña</label>

          {/* Mismo icono ojo para mostrar/ocultar */}
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

          {/* Mostrar error si existe */}
          {errors.confirm && (
            <p style={{ color: "red", marginTop: "-10px", marginBottom:"40px" }}>
              {errors.confirm}
            </p>
          )}
        </div>

        {/* Botón para enviar formulario */}
        <div className="carousel-buttons">
          <button type="submit" className="carousel-btn next">Restablecer</button>
        </div>

        {/* Mensajes de éxito o error general */}
        {success && (
          <p style={{ color: "green", marginTop: "16px" }}>{success}</p>
        )}
        {errors.general && (
          <p style={{ color: "red", marginTop: "16px" }}>{errors.general}</p>
        )}
      </form>
    </div>
  );
};

export default Main;
