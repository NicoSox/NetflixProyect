const express = require("express")
const { getAllUsuarios, getOneUsuario, createUsuario, updateUsuario, deleteUsuario, getEspecifiedUsuario, loginUsuario, getEmail, updatePass, getAccount } = require("../controllers/usuarios")
const router = express.Router()

router.get("/usuarios", getAllUsuarios)
router.get("/usuarios/:id", getOneUsuario)
router.post("/usuarios", createUsuario)
router.put("/usuarios/:id", updateUsuario)
router.delete("/usuarios/:id", deleteUsuario)
router.get("/usuarios/buscar/especifico", getEspecifiedUsuario)
/* router.post("/login", loginUsuario);
router.post("/usuarios/email", getEmail);
router.put("/usuarios/update-pass/:id", updatePass);
router.post("/usuarios/account", getAccount); */

module.exports = router