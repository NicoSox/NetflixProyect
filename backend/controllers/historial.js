const db = require("../config/db");

// Obtener todo el historial
const getAllHistorial = (req, res) => {
  const consulta = "SELECT * FROM historial;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener una entrada de historial por ID
const getOneHistorial = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM historial WHERE id_historial = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Registro de historial no encontrado" });
    }
    res.json(results[0]);
  });
};

// Crear una entrada de historial
const createHistorial = (req, res) => {
  const { id_usuario, fecha_visto, progreso_minutos, id_pelicula, id_serie } = req.body;

  // Validar que solo uno de los dos (película o serie) esté presente
  if ((id_pelicula && id_serie) || (!id_pelicula && !id_serie)) {
    return res.status(400).json({
      error: "Debes especificar solo uno: id_pelicula o id_serie",
    });
  }

  const consulta = `
    INSERT INTO historial (id_usuario, fecha_visto, progreso_minutos, id_pelicula, id_serie)
    VALUES (?, ?, ?, ?, ?);
  `;
  db.query(
    consulta,
    [id_usuario, fecha_visto, progreso_minutos, id_pelicula || null, id_serie || null],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Registro de historial creado", id_historial: result.insertId });
    }
  );
};

// Actualizar una entrada de historial
const updateHistorial = (req, res) => {
  const id = req.params.id;
  const { id_usuario, fecha_visto, progreso_minutos, id_pelicula, id_serie } = req.body;

  if ((id_pelicula && id_serie) || (!id_pelicula && !id_serie)) {
    return res.status(400).json({
      error: "Debes especificar solo uno: id_pelicula o id_serie",
    });
  }

  const consulta = `
    UPDATE historial
    SET id_usuario = ?, fecha_visto = ?, progreso_minutos = ?, id_pelicula = ?, id_serie = ?
    WHERE id_historial = ?;
  `;
  db.query(
    consulta,
    [id_usuario, fecha_visto, progreso_minutos, id_pelicula || null, id_serie || null, id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Registro de historial no encontrado" });
      }
      res.json({ message: "Historial actualizado correctamente" });
    }
  );
};

// Eliminar una entrada de historial
const deleteHistorial = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM historial WHERE id_historial = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro de historial no encontrado" });
    }
    res.json({ message: "Historial eliminado correctamente" });
  });
};

// Obtener historial por usuario
const getHistorialByUsuario = (req, res) => {
  const id_usuario = req.params.id_usuario;
  const consulta = `
    SELECT * FROM historial
    WHERE id_usuario = ?
    ORDER BY fecha_visto DESC;
  `;
  db.query(consulta, [id_usuario], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllHistorial,
  getOneHistorial,
  createHistorial,
  updateHistorial,
  deleteHistorial,
  getHistorialByUsuario
};
