const db = require("../config/db");

// Obtener todos los usuarios
const getAllUsuarios = (req, res) => {
  const consulta = `
    SELECT u.id, u.username, u.foto, u.id_cuenta
    FROM usuarios u;
  `;
  db.query(consulta, (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
};

// Obtener un usuario por ID
const getOneUsuario = (req, res) => {
  const id = req.params.id;
  const consulta = `
    SELECT u.id, u.username, u.foto, u.id_cuenta
    FROM usuarios u
    WHERE u.id = ?;
  `;
  db.query(consulta, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(results[0]);
  });
};

// Crear nuevo usuario
const createUsuario = (req, res) => {
  const { username, foto, id_cuenta } = req.body;
  const consulta = `INSERT INTO usuarios (username, foto, id_cuenta) VALUES (?, ?, ?)`;
  db.query(consulta, [username, foto, id_cuenta], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al crear usuario" });
    res.status(201).json({ message: "Usuario creado correctamente", id: result.insertId });
  });
};

// Actualizar usuario
const updateUsuario = (req, res) => {
  const id = req.params.id;
  const { username, foto, id_cuenta } = req.body;
  const consulta = `
    UPDATE usuarios SET username = ?, foto = ?, id_cuenta = ? WHERE id = ?
  `;
  db.query(consulta, [username, foto, id_cuenta, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al actualizar usuario" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario actualizado correctamente" });
  });
};

// Eliminar usuario
const deleteUsuario = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM usuarios WHERE id = ?";
  db.query(consulta, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar usuario" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
  });
};

// Buscar usuario por username (parcial)
const getEspecifiedUsuario = (req, res) => {
  const username = req.query.username || "";
  const consulta = `
    SELECT u.id, u.username, u.foto, u.id_cuenta
    FROM usuarios u
    WHERE u.username LIKE ?;
  `;
  db.query(consulta, [`%${username}%`], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    res.json(results);
  });
};

module.exports = {
  getAllUsuarios,
  getOneUsuario,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getEspecifiedUsuario
};