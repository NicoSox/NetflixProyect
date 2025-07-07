const db = require("../config/db");

// Registrar una visualización (película o serie)
const registrarVisualizacion = (req, res) => {
  const { id_pelicula, id_serie } = req.body;

  if (!id_pelicula && !id_serie) {
    return res.status(400).json({ error: "Debes enviar id_pelicula o id_serie" });
  }

  // Si es película
  if (id_pelicula) {
    const check = "SELECT * FROM tendencias WHERE id_pelicula = ?";
    db.query(check, [id_pelicula], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        const update = "UPDATE tendencias SET visualizaciones = visualizaciones + 1 WHERE id_pelicula = ?";
        db.query(update, [id_pelicula], (err) => {
          if (err) throw err;
          res.json({ message: "Visualización de película registrada" });
        });
      } else {
        const insert = "INSERT INTO tendencias (id_pelicula, visualizaciones) VALUES (?, 1)";
        db.query(insert, [id_pelicula], (err) => {
          if (err) throw err;
          res.status(201).json({ message: "Película agregada a tendencias y visualización registrada" });
        });
      }
    });
  }

  // Si es serie
  else if (id_serie) {
    const check = "SELECT * FROM tendencias WHERE id_serie = ?";
    db.query(check, [id_serie], (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        const update = "UPDATE tendencias SET visualizaciones = visualizaciones + 1 WHERE id_serie = ?";
        db.query(update, [id_serie], (err) => {
          if (err) throw err;
          res.json({ message: "Visualización de serie registrada" });
        });
      } else {
        const insert = "INSERT INTO tendencias (id_serie, visualizaciones) VALUES (?, 1)";
        db.query(insert, [id_serie], (err) => {
          if (err) throw err;
          res.status(201).json({ message: "Serie agregada a tendencias y visualización registrada" });
        });
      }
    });
  }
};

// Obtener el top 10 de tendencias (películas y series)
const getTopTendencias = (req, res) => {
  const consulta = `
    SELECT 
      t.id_tendencia,
      t.visualizaciones,
      
      p.id_pelicula,
      p.id_genero AS pelicula_id_genero,
      p.titulo AS pelicula_titulo,
      p.descripcion AS pelicula_descripcion,
      p.clasificacion_edad AS pelicula_clasificacion_edad,
      p.duracion AS pelicula_duracion,
      p.fecha_lanzamiento AS pelicula_fecha_lanzamiento,
      p.foto AS pelicula_foto,
      p.trailer AS pelicula_trailer,

      s.id_serie,
      s.id_genero AS serie_id_genero,
      s.titulo AS serie_titulo,
      s.descripcion AS serie_descripcion,
      s.clasificacion_edad AS serie_clasificacion_edad,
      s.duracion AS serie_duracion,
      s.fecha_lanzamiento AS serie_fecha_lanzamiento,
      s.foto AS serie_foto,
      s.trailer AS serie_trailer

    FROM tendencias t
    LEFT JOIN peliculas p ON t.id_pelicula = p.id_pelicula
    LEFT JOIN series s ON t.id_serie = s.id_serie
    ORDER BY t.visualizaciones DESC
    LIMIT 10;
  `;

  db.query(consulta, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
};

module.exports = {
    registrarVisualizacion,
    getTopTendencias
};