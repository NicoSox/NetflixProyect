const db = require("../config/db");

// Obtener todas las películas
const getAllPeliculas = (req, res) => {
  const consulta = "SELECT * FROM peliculas;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener una película por ID
const getOnePelicula = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM peliculas WHERE id_pelicula = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(results[0]);
  });
};

// Crear una nueva película
const createPelicula = (req, res) => {
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
    INSERT INTO peliculas 
    (id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  db.query(
    consulta,
    [id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Película creada correctamente", id_pelicula: result.insertId });
    }
  );
};

// Actualizar una película
const updatePelicula = (req, res) => {
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
    UPDATE peliculas 
    SET id_genero = ?, titulo = ?, descripcion = ?, clasificacion_edad = ?, duracion = ?, 
        fecha_lanzamiento = ?, foto = ?, trailer = ?
    WHERE id_pelicula = ?;
  `;
  db.query(
    consulta,
    [id_genero, titulo, descripcion, clasificacion_edad, duracion, fecha_lanzamiento, foto, trailer, id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Película no encontrada" });
      }
      res.json({ message: "Película actualizada correctamente" });
    }
  );
};
//Eliminar una pelicula 
const deletePelicula = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM peliculas WHERE id_pelicula = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) {
      if (err.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(409).json({ error: "No se puede eliminar la película porque está siendo referenciada en otra tabla." });
      }
      console.error("Error al eliminar película:", err);
      return res.status(500).json({ error: "Error al eliminar la película." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json({ message: "Película eliminada correctamente" });
  });
};

// Buscar películas por título (búsqueda parcial)
const getEspecifiedPelicula = (req, res) => {
  const titulo = req.query.titulo || "";
  const consulta = "SELECT * FROM peliculas WHERE titulo LIKE ?;";
  db.query(consulta, [`%${titulo}%`], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllPeliculas,
  getOnePelicula,
  createPelicula,
  updatePelicula,
  deletePelicula,
  getEspecifiedPelicula
};
