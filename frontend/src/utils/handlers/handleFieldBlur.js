import { validateLoginFields } from '../validators/validateLoginFields';

export const handleFieldBlur = ({
  field,
  email,
  password,
  modoCodigo,
  setErrors
}) => {
  const validationErrors = validateLoginFields(email, password, modoCodigo);
  setErrors((prev) => ({ ...prev, [field]: validationErrors[field] }));
};
