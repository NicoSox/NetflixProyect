import SvgErrorIcon from "./SvgErrorIcon"

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="error-text">
      <SvgErrorIcon />
      {message}
    </p>
  );
};
export default ErrorMessage
