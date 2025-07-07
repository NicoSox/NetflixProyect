const db = require("../config/db");

// Obtener todos los géneros
const getAllGeneros = (req, res) => {
  const consulta = "SELECT * FROM generos;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener un género por ID
const getOneGenero = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM generos WHERE id_genero = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }
    res.json(results[0]);
  });
};

// Crear un nuevo género
const createGenero = (req, res) => {
  const { nombre } = req.body;
  const consulta = "INSERT INTO generos (nombre) VALUES (?);";
  db.query(consulta, [nombre], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Género creado correctamente", id_genero: result.insertId });
  });
};

// Actualizar un género existente
const updateGenero = (req, res) => {
  const id = req.params.id;
  const { nombre } = req.body;
  const consulta = "UPDATE generos SET nombre = ? WHERE id_genero = ?;";
  db.query(consulta, [nombre, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }
    res.json({ message: "Género actualizado correctamente" });
  });
};

// Eliminar un género
const deleteGenero = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM generos WHERE id_genero = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }
    res.json({ message: "Género eliminado correctamente" });
  });
};

// Buscar géneros por nombre (búsqueda parcial)
const getEspecifiedGenero = (req, res) => {
  const nombre = req.query.nombre || "";
  const consulta = "SELECT * FROM generos WHERE nombre LIKE ?;";
  db.query(consulta, [`%${nombre}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllGeneros,
  getOneGenero,
  deleteGenero,
  updateGenero,
  createGenero,
  getEspecifiedGenero
};
