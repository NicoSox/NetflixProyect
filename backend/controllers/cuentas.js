const db = require("../config/db");
const jwt = require("jsonwebtoken");

// Obtener todas las cuentas
const getAllCuentas = (req, res) => {
  const consulta = "SELECT * FROM cuentas";
  db.query(consulta, (err, results) => {
    if (err) return res.status(500).json({ error: "Error al obtener cuentas" });
    res.json(results);
  });
};

// Obtener una cuenta por ID
const getOneCuenta = (req, res) => {
  const id = req.params.id;
  const consulta = "SELECT * FROM cuentas WHERE id_cuenta = ?";
  db.query(consulta, [id], (err, results) => {
    if (err) return res.status(500).json({ error: "Error al buscar cuenta" });
    if (results.length === 0) return res.status(404).json({ error: "Cuenta no encontrada" });
    res.json(results[0]);
  });
};

// Crear una nueva cuenta
const createCuenta = (req, res) => {
  const { mail, pass, id_plan, rol_id, nombre, apellido, numero_tarjeta } = req.body;
  const consulta = `
    INSERT INTO cuentas (mail, pass, id_plan, rol_id, nombre, apellido, numero_tarjeta)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    consulta,
    [mail, pass, id_plan, rol_id, nombre, apellido, numero_tarjeta],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al crear cuenta" });
      res.status(201).json({ message: "Cuenta creada correctamente", id_cuenta: result.insertId });
    }
  );
};

// Actualizar una cuenta
const updateCuenta = (req, res) => {
  const id = req.params.id;
  const { mail, pass, id_plan, rol_id, nombre, apellido, numero_tarjeta } = req.body;
  const consulta = `
    UPDATE cuentas
    SET mail = ?, pass = ?, id_plan = ?, rol_id = ?, nombre = ?, apellido = ?, numero_tarjeta = ?
    WHERE id_cuenta = ?
  `;
  db.query(
    consulta,
    [mail, pass, id_plan, rol_id, nombre, apellido, numero_tarjeta, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Error al actualizar cuenta" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Cuenta no encontrada" });
      res.json({ message: "Cuenta actualizada correctamente" });
    }
  );
};

// Eliminar una cuenta
const deleteCuenta = (req, res) => {
  const id = req.params.id;
  const consulta = "DELETE FROM cuentas WHERE id_cuenta = ?";
  db.query(consulta, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error al eliminar cuenta" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cuenta no encontrada" });
    res.json({ message: "Cuenta eliminada correctamente" });
  });
};

// Login
const loginCuenta = (req, res) => {
  const { mail, pass } = req.body;
  const consulta = "SELECT * FROM cuentas WHERE mail = ?";
  db.query(consulta, [mail], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Mail no encontrado" });

    const cuenta = results[0];
    if (cuenta.pass !== pass) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      {
        id_cuenta: cuenta.id_cuenta,
        mail: cuenta.mail,
        rol_id: cuenta.rol_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      cuenta: {
        id_cuenta: cuenta.id_cuenta,
        nombre: cuenta.nombre,
        apellido: cuenta.apellido,
        mail: cuenta.mail,
        numero_tarjeta: cuenta.numero_tarjeta,
        rol_id: cuenta.rol_id
      }
    });
  });
};

// Verificar si email existe
const getEmail = (req, res) => {
  const { mail } = req.body;
  const consulta = "SELECT * FROM cuentas WHERE mail = ?";
  db.query(consulta, [mail], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(200).json({ exists: false });
    res.status(200).json({
      exists: true,
      cuenta: {
        id_cuenta: results[0].id_cuenta,
        mail: results[0].mail
      }
    });
  });
};

// Actualizar contraseña
const updatePass = (req, res) => {
  const id = req.params.id;
  const { pass } = req.body;
  if (!pass) return res.status(400).json({ error: "La contraseña es requerida" });

  const consulta = "UPDATE cuentas SET pass = ? WHERE id_cuenta = ?";
  db.query(consulta, [pass, id], (err, result) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Cuenta no encontrada" });
    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  });
};

// Obtener cuenta por nombre, apellido y tarjeta
const getAccount = (req, res) => {
  const { nombre, apellido, tarjeta } = req.body;
  if (!nombre || !apellido || !tarjeta) {
    return res.status(400).json({ error: "Faltan parámetros requeridos" });
  }

  const consulta = `
    SELECT * FROM cuentas
    WHERE nombre = ? AND apellido = ? AND numero_tarjeta = ?
  `;
  db.query(consulta, [nombre.trim(), apellido.trim(), tarjeta.trim()], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });
    if (results.length === 0) return res.status(404).json({ error: "Cuenta no encontrada" });
    res.status(200).json(results[0]);
  });
};

// Obtener usuarios de una cuenta específica
const getUsuariosByCuenta = (req, res) => {
  const idCuenta = req.params.id;

  const consulta = `
    SELECT u.id, u.username, u.foto
    FROM usuarios u
    WHERE u.id_cuenta = ?;
  `;

  db.query(consulta, [idCuenta], (err, results) => {
    if (err) return res.status(500).json({ error: "Error en el servidor" });

    res.json(results);
  });
};

module.exports = {
  getAllCuentas,
  getOneCuenta,
  createCuenta,
  updateCuenta,
  deleteCuenta,
  loginCuenta,
  getEmail,
  updatePass,
  getAccount,
  getUsuariosByCuenta
};