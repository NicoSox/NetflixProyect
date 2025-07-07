const express = require("express");
const {
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
} = require("../controllers/cuentas");

const router = express.Router();

router.get("/cuentas", getAllCuentas);
router.get("/cuentas/:id", getOneCuenta);
router.post("/cuentas", createCuenta);
router.put("/cuentas/:id", updateCuenta);
router.delete("/cuentas/:id", deleteCuenta);
router.get("/cuentas/:id/usuarios", getUsuariosByCuenta);

router.post("/login", loginCuenta);
router.post("/cuentas/email", getEmail);
router.put("/cuentas/update-pass/:id", updatePass);
router.post("/cuentas/account", getAccount);

module.exports = router;