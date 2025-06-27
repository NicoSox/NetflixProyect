export const validateLoginFields = (email, password, modoCodigo) => {
  const errors = {};

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.email = 'Ingresa un email o un número de teléfono válido.';
  } else if (!emailRegex.test(email)) {
    errors.email = 'Ingresa un email con formato válido.';
  }

  // Validación de contraseña (solo si no está en modo código)
  if (!modoCodigo) {
  if  (password.length < 6 || password.length > 60) {
    errors.password = 'La contraseña debe tener entre 6 y 60 caracteres.';
  }
}
  return errors;
};
