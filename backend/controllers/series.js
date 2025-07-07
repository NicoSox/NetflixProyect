const db = require("../config/db");

// Obtener todas las series
const getAllSeries = (req, res) => {
  const consulta = "SELECT * FROM series;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener una serie por ID
const getOneSerie = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM series WHERE id_serie = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Serie no encontrada" });
    }
    res.json(results[0]);
  });
};

// Crear una nueva serie
const createSerie = (req, res) => {
  const {
    id_genero,
    titulo,
    descripcion,
    clasificacion_edad,
    duracion,
    fecha_lanzamiento,
    foto,
    trailer
  } = req.body;

  const consulta = `
    INSERT INTO series 
    (id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  db.query(
    consulta,
    [id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Serie creada correctamente", id_serie: result.insertId });
    }
  );
};

// Actualizar una serie
const updateSerie = (req, res) => {
  const id = req.params.id;
  const {
    id_genero,
    titulo,
    descripcion,
    clasificacion_edad,
    duracion,
    fecha_lanzamiento,
    foto,
    trailer
  } = req.body;

  const consulta = `
    UPDATE series 
    SET id_genero = ?, titulo = ?, descripcion = ?, clasificacion_edad = ?, duracion = ?, 
        fecha_lanzamiento = ?, foto = ?, trailer = ?
    WHERE id_serie = ?;
  `;
  db.query(
    consulta,
    [id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer, id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Serie no encontrada" });
      }
      res.json({ message: "Serie actualizada correctamente" });
    }
  );
};

// Eliminar una serie
const deleteSerie = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM series WHERE id_serie = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Serie no encontrada" });
    }
    res.json({ message: "Serie eliminada correctamente" });
  });
};

// Buscar series por título (búsqueda parcial)
const getEspecifiedSerie = (req, res) => {
  const titulo = req.query.titulo || "";
  const consulta = "SELECT * FROM series WHERE titulo LIKE ?;";
  db.query(consulta, [`%${titulo}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllSeries,
  getOneSerie,
  createSerie,
  updateSerie,
  deleteSerie,
  getEspecifiedSerie
};
