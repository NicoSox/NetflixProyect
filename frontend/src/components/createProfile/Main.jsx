import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/css/Profiles.css";

const fotosDisponibles = [
  "/assets/imgprofile/profile1.jpg",
  "/assets/imgprofile/profile2.jpg",
  "/assets/imgprofile/profile3.webp",
  "/assets/imgprofile/profile4.webp",
   "/assets/imgprofile/profile5.webp",
  "/assets/imgprofile/profile6.webp",
   "/assets/imgprofile/profile7.webp",
];


const Main = () => {
  const navigate = useNavigate();

  // Cambio aquí: leer desde 'usuarioCuenta' en lugar de 'usuario'
  const cuenta = JSON.parse(localStorage.getItem("usuarioCuenta"));
  const id_cuenta = cuenta?.id_cuenta;

  const [form, setForm] = useState({
    username: "",
    foto: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const seleccionarFoto = (url) => {
    setForm((prev) => ({ ...prev, foto: url }));
    setModalVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!id_cuenta) {
      setError("Cuenta no encontrada.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3007/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          foto: form.foto,
          id_cuenta,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Perfil creado correctamente");
        setTimeout(() => navigate("/Profiles"), 1500);
      } else {
        setError(data.error || "Error al crear perfil");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container-create-profile">
      <h2>Crear Perfil</h2>
      {mensaje && <p className="msg-success">{mensaje}</p>}
      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-create-profile">
        <div
          className="foto-container"
          onClick={() => setModalVisible(true)}
          title="Seleccionar imagen de perfil"
        >
          {form.foto ? (
            <img src={form.foto} alt="Seleccionada" className="foto-profile" />
          ) : (
            <span className="foto-placeholder">Click para elegir foto</span>
          )}
        </div>

        <input
          type="text"
          name="username"
          placeholder="Nombre del perfil"
          value={form.username}
          onChange={handleChange}
          required
          className="input-username"
        />

        <button type="submit" className="btn btn-save">
          Crear perfil
        </button>
      </form>

      {modalVisible && (
        <div onClick={() => setModalVisible(false)} className="modal-overlay">
          <div
            onClick={(e) => e.stopPropagation()}
            className="modal-content"
          >
            {fotosDisponibles.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Foto ${i + 1}`}
                className={`foto-select ${form.foto === url ? "foto-selected" : ""}`}
                onClick={() => seleccionarFoto(url)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
