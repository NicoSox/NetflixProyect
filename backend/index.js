require("dotenv").config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const routesGeneros = require('./routes/generos');
const routesPlanes = require('./routes/planes');
const routesUsuarios = require('./routes/usuarios');
const routesPeliculas = require('./routes/peliculas');
const routesSeries = require('./routes/series');
const routesFavoritos = require('./routes/favoritos');
const routesHistorial = require('./routes/historial');
const routesRoles = require('./routes/roles'); // Asegúrate de importar el router de roles
const routesTendencias = require('./routes/tendencias'); // Asegúrate de importar el router de tendencias
const routesCuentas = require('./routes/cuentas'); // Asegúrate de importar el router de cuentas

const app = express();
const PORT = 3007;

app.use(cors());
app.use(express.json());

// Usar el router de generos
app.use('/', routesGeneros);
app.use('/', routesPlanes);
app.use('/', routesUsuarios);
app.use('/', routesPeliculas);
app.use('/', routesSeries);
app.use('/', routesFavoritos);
app.use('/', routesHistorial);
app.use('/', routesRoles); 
app.use('/', routesTendencias);
app.use('/', routesCuentas);

app.get("/",(req,res)=>{
  res.send ("Bienvenido a mi API")
})


// Ruta de prueba
/* app.get('/generos', (req, res) => {
  db.query('SELECT * FROM generos', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }
    res.json(results);
  });
}); */

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});




/* const express = require('express');

const app=express();

app.use(express.json())

app.get("/",(req,res)=>{
  res.send ("Bienvenido a mi API")
})

app.listen(5000,(err)=>{
  if (err) throw err
  console.log("Servidor corriendo en el puerto 5000")
})
 */