import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const [form, setForm] = useState({
    username: "",
    foto: "",
    id: "",
    id_cuenta: "", // ← necesario
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const perfilJSON = localStorage.getItem("usuarioActivo");
    const cuentaJSON = localStorage.getItem("usuarioCuenta"); // <- CAMBIO aquí

    if (!perfilJSON || !cuentaJSON) {
      setError("Faltan datos en localStorage");
      return;
    }

    try {
      const perfil = JSON.parse(perfilJSON);
      const cuenta = JSON.parse(cuentaJSON);

      setForm({
        username: perfil.username || "",
        foto: perfil.foto || "",
        id: perfil.id || "",
        id_cuenta: perfil.id_cuenta || cuenta.id_cuenta || "", // <- AQUI la solución
      });
    } catch {
      setError("Error al parsear los datos del perfil o cuenta");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoClick = () => setModalVisible(true);

  const seleccionarFoto = (url) => {
    setForm((prev) => ({ ...prev, foto: url }));
    setModalVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      const res = await fetch(`http://localhost:3007/usuarios/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          foto: form.foto,
          id_cuenta: form.id_cuenta, // 👈 Ahora sí se envía correctamente
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Usuario actualizado correctamente");
        localStorage.setItem("usuarioActivo", JSON.stringify({ ...form }));
        setTimeout(() => navigate("/Profiles"), 1500);
      } else {
        setError(data.error || "Error al actualizar usuario");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  const handleDelete = async () => {
    setMensaje("");
    setError("");

    try {
      const res = await fetch(`http://localhost:3007/usuarios/${form.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje("Usuario eliminado correctamente");
        localStorage.removeItem("usuarioActivo");
        setTimeout(() => navigate("/Profiles"), 1500);
      } else {
        setError(data.error || "Error al eliminar perfil");
      }
    } catch {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container-edit-profile">
      <h2>Editar perfil</h2>
      {mensaje && <p className="msg-success">{mensaje}</p>}
      {error && <p className="msg-error">{error}</p>}

      <form onSubmit={handleSubmit} className="form-edit-profile">
        <div
          className="foto-container"
          onClick={handleFotoClick}
          title="Seleccionar imagen de perfil"
        >
          {form.foto ? (
            <img
              src={form.foto}
              alt="Foto seleccionada"
              className="foto-profile"
            />
          ) : (
            <span className="foto-placeholder">Click para elegir foto</span>
          )}
        </div>

        <input
          type="text"
          name="username"
          placeholder="Nombre del usuario"
          value={form.username}
          onChange={handleChange}
          required
          className="input-username"
        />

        <div className="buttons-container">
          <button type="submit" className="btn btn-save">
            Guardar cambios
          </button>

          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="btn btn-delete"
            >
              Eliminar perfil
            </button>
          ) : (
            <div className="confirm-delete">
              <span>¿Seguro que querés eliminar?</span>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-confirm"
              >
                Sí, eliminar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="btn btn-cancel"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>

      {modalVisible && (
        <div onClick={() => setModalVisible(false)} className="modal-overlay">
          <div onClick={(e) => e.stopPropagation()} className="modal-content">
            {fotosDisponibles.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Foto ${i + 1}`}
                className={`foto-select ${
                  form.foto === url ? "foto-selected" : ""
                }`}
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
