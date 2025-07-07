const db = require("../config/db");

// Obtener todos los favoritos
const getAllFavoritos = (req, res) => {
  const consulta = "SELECT * FROM favoritos;";
  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

// Obtener un favorito por ID
const getOneFavorito = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM favoritos WHERE id_favorito = ?;";
  db.query(consulta, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }
    res.json(results[0]);
  });
};

// Crear un favorito
const createFavorito = (req, res) => {
  const { id_usuario, id_pelicula, id_serie, fecha_agregado } = req.body;

  // Validación: solo uno puede tener valor
  if ((id_pelicula && id_serie) || (!id_pelicula && !id_serie)) {
    return res.status(400).json({
      error: "Debes especificar solo uno: id_pelicula o id_serie",
    });
  }

  const consulta = `
    INSERT INTO favoritos (id_usuario, fecha_agregado, id_pelicula, id_serie)
    VALUES (?, ?, ?, ?);
  `;
  db.query(
    consulta,
    [id_usuario, fecha_agregado, id_pelicula || null, id_serie || null],
    (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: "Favorito agregado correctamente", id_favorito: result.insertId });
    }
  );
};

// Actualizar un favorito
const updateFavorito = (req, res) => {
  const id = req.params.id;
  const { id_usuario, id_pelicula, id_serie, fecha_agregado } = req.body;

  if ((id_pelicula && id_serie) || (!id_pelicula && !id_serie)) {
    return res.status(400).json({
      error: "Debes especificar solo uno: id_pelicula o id_serie",
    });
  }

  const consulta = `
    UPDATE favoritos 
    SET id_usuario = ?, fecha_agregado = ?, id_pelicula = ?, id_serie = ?
    WHERE id_favorito = ?;
  `;
  db.query(
    consulta,
    [id_usuario, fecha_agregado, id_pelicula || null, id_serie || null, id],
    (err, result) => {
      if (err) throw err;
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Favorito no encontrado" });
      }
      res.json({ message: "Favorito actualizado correctamente" });
    }
  );
};

// Eliminar un favorito
const deleteFavorito = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM favoritos WHERE id_favorito = ?;";
  db.query(consulta, [id], (err, result) => {
    if (err) throw err;
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Favorito no encontrado" });
    }
    res.json({ message: "Favorito eliminado correctamente" });
  });
};

// Buscar favoritos por ID de usuario
const getFavoritosByUsuario = (req, res) => {
  const id_usuario = req.params.id_usuario;
  const consulta = "SELECT * FROM favoritos WHERE id_usuario = ?;";
  db.query(consulta, [id_usuario], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
  getAllFavoritos,
  getOneFavorito,
  createFavorito,
  updateFavorito,
  deleteFavorito,
  getFavoritosByUsuario,
};
