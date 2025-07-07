import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/css/Cuenta.css';

const Main = () => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrando, setBorrando] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Traigo los datos del usuario al cargar el componente
  useEffect(() => {
    const fetchUsuario = async () => {
      const stored = localStorage.getItem("usuarioCuenta");
      if (!stored) {
        setError("Usuario no encontrado en localStorage");
        setLoading(false);
        return;
      }

      const { id_cuenta } = JSON.parse(stored); // 👈 importante

      try {
        const res = await fetch(`http://localhost:3007/cuentas/${id_cuenta}`);
        if (!res.ok) throw new Error("Error al obtener datos del usuario");

        const data = await res.json();
        setUsuario(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  // Función para iniciar edición de un campo
  const iniciarEdicion = (campo) => {
    setEditField(campo);
    setEditValue(usuario[campo] || "");
    // Para enfocar el input después de que aparece:
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Función para cancelar edición
  const cancelarEdicion = () => {
    setEditField(null);
    setEditValue("");
  };

  // Guardar edición
  const guardarEdicion = async () => {
    if (!editField) return;
    if (editValue === usuario[editField]) {
      cancelarEdicion();
      return;
    }

    try {
      setMensaje(null);

      // Actualizamos solo el campo modificado pero enviamos todos los valores requeridos
      const datosActualizados = {
        mail: editField === "mail" ? editValue : usuario.mail || "",
        pass: usuario.pass || "", // puede dejarse en blanco si no querés que se modifique
        id_plan: usuario.id_plan || "",
        rol_id: usuario.rol_id || "",
        nombre: editField === "nombre" ? editValue : usuario.nombre || "",
        apellido: editField === "apellido" ? editValue : usuario.apellido || "",
        numero_tarjeta: usuario.numero_tarjeta || ""
      };

      const res = await fetch(`http://localhost:3007/cuentas/${usuario.id_cuenta}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados),
      });

      if (!res.ok) throw new Error("Error al actualizar la cuenta");

      // Reflejar los cambios localmente
      setUsuario((prev) => ({
        ...prev,
        ...datosActualizados,
        [editField]: editValue,
      }));
      setMensaje("Campo actualizado correctamente");
    } catch (err) {
      setMensaje(`Error: ${err.message}`);
    } finally {
      cancelarEdicion();
    }
  };

  

  // Manejo Enter y Escape mientras edito
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      guardarEdicion();
    } else if (e.key === "Escape") {
      cancelarEdicion();
    }
  };

  // Doy de baja la cuenta del usuario
const handleDarDeBaja = async () => {
  if (!usuario) return;

  const confirmar = window.confirm("¿Querés dar de baja tu cuenta? Esta acción es irreversible.");
  if (!confirmar) return;

  try {
    setBorrando(true);
    setMensaje(null);

    // Eliminar cuenta completa
    const res = await fetch(`http://localhost:3007/cuentas/${usuario.id_cuenta}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Error al eliminar la cuenta");
    }

    setMensaje("Cuenta eliminada correctamente.");
    setUsuario(null);

    // Limpiar localStorage: ahora borramos 'usuarioCuenta'
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioCuenta");  // acá actualizamos la clave
    localStorage.removeItem("usuario");        // si usás para otra cosa, dejalo o no

    navigate("/subscribe");  // o donde quieras redirigir
  } catch (err) {
    setMensaje(`Error: ${err.message}`);
  } finally {
    setBorrando(false);
  }
};


  // Render condicional
  if (loading) return <p>Cargando datos del usuario...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!usuario) return <p>No hay usuario cargado.</p>;

  const camposEditables = [
    { label: "Nombre", key: "nombre" },
    { label: "Apellido", key: "apellido" },
    { label: "Email", key: "mail" },
  ];

  return (
    <div className="usuario-card">
      <h3>Perfil de Usuario</h3>

      {camposEditables.map(({ label, key }) => (
        <p key={key}>
          <strong>{label}: </strong>
          {editField === key ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={guardarEdicion}
              onKeyDown={handleKeyDown}
              style={{ fontSize: "1rem", padding: "4px" }}
            />
          ) : (
            <span
              onClick={() => iniciarEdicion(key)}
              style={{ cursor: "pointer", textDecoration: "underline", color: "#e50914" }}
              title="Haz clic para editar"
            >
              {usuario[key] ?? "-"}
            </span>
          )}
        </p>
      ))}

      {mensaje && (
        <p style={{ marginTop: "1rem", color: mensaje.startsWith("Error") ? "red" : "lightgreen" }}>
          {mensaje}
        </p>
      )}

      <button
        onClick={handleDarDeBaja}
        disabled={borrando}
        className="btn-baja"
        style={{
          marginTop: "20px",
          backgroundColor: "#e50914",
          border: "none",
          padding: "10px 16px",
          color: "white",
          fontWeight: "bold",
          borderRadius: "4px",
          cursor: "pointer",
          width: "100%",
        }}
      >
        {borrando ? "Procesando..." : "Dar de baja la cuenta"}
      </button>
    </div>
  );
};

export default Main;
