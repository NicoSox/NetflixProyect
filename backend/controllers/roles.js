const db = require("../config/db");

// Obtener todos los roles
const getAllRoles = (req, res) => {
  const consulta = "SELECT * FROM roles;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener un rol por ID
const getOneRol = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM roles WHERE id = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json(results[0]);
  });
};

// Crear un nuevo rol
const createRol = (req, res) => {
  const { nombre, descripcion } = req.body;
  const consulta = "INSERT INTO roles (nombre, descripcion) VALUES (?, ?);";
  db.query(consulta, [nombre, descripcion], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Rol creado correctamente", id_rol: result.insertId });
  });
};

// Actualizar un rol
const updateRol = (req, res) => {
  const id = req.params.id;
  const { nombre, descripcion } = req.body;
  const consulta = "UPDATE roles SET nombre = ?, descripcion = ? WHERE id = ?;";
  db.query(consulta, [nombre, descripcion, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json({ message: "Rol actualizado correctamente" });
  });
};

// Eliminar un rol
const deleteRol = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM roles WHERE id = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }
    res.json({ message: "Rol eliminado correctamente" });
  });
};

// Buscar roles por nombre (búsqueda parcial)
const getEspecifiedRol = (req, res) => {
  const nombre = req.query.nombre || "";
  const consulta = "SELECT * FROM roles WHERE nombre LIKE ?;";
  db.query(consulta, [`%${nombre}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllRoles,
  getOneRol,
  createRol,
  updateRol,
  deleteRol,
  getEspecifiedRol
};
