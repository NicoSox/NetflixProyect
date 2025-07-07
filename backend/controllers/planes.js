const db = require("../config/db");

// Obtener todos los planes
const getAllPlanes = (req, res) => {
  const consulta = "SELECT * FROM planes;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener un plan por ID
const getOnePlan = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM planes WHERE id_plan = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Plan no encontrado" });
    }
    res.json(results[0]);
  });
};

// Crear un nuevo plan
const createPlan = (req, res) => {
  const { nombre_plan, precio, resolucion_maxima, cantidad_perfiles } = req.body;
  const consulta = "INSERT INTO planes (nombre_plan, precio, resolucion_maxima, cantidad_perfiles) VALUES (?, ?, ?, ?);";
  db.query(consulta, [nombre_plan, precio, resolucion_maxima, cantidad_perfiles], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: "Plan creado correctamente", id_plan: result.insertId });
  });
};

// Actualizar un plan
const updatePlan = (req, res) => {
  const id = req.params.id;
  const { nombre_plan, precio, resolucion_maxima, cantidad_perfiles } = req.body;
  const consulta = "UPDATE planes SET nombre_plan = ?, precio = ?, resolucion_maxima = ?, cantidad_perfiles = ? WHERE id_plan = ?;";
  db.query(consulta, [nombre_plan, precio, resolucion_maxima, cantidad_perfiles, id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plan no encontrado" });
    }
    res.json({ message: "Plan actualizado correctamente" });
  });
};

// Eliminar un plan
const deletePlan = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM planes WHERE id_plan = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Plan no encontrado" });
    }
    res.json({ message: "Plan eliminado correctamente" });
  });
};

// Buscar planes por nombre (búsqueda parcial)
const getEspecifiedPlan = (req, res) => {
  const nombre = req.query.nombre || "";
  const consulta = "SELECT * FROM planes WHERE nombre_plan LIKE ?;";
  db.query(consulta, [`%${nombre}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllPlanes,
  getOnePlan,
  createPlan,
  updatePlan,
  deletePlan,
  getEspecifiedPlan
};
