const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '@N1c0S0x1827',        // tu contraseña
  database: 'netflix'  // tu base de datos
});

/* db.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});
 */
module.exports = db;
