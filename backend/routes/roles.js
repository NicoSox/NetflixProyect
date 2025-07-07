const express = require("express")
const router = express.Router()
const { getAllRoles, getOneRol, createRol, updateRol, deleteRol, getEspecifiedRol } = require("../controllers/roles")

router.get("/roles", getAllRoles)
router.get("/roles/:id", getOneRol)
router.post("/roles", createRol)
router.put("/roles/:id", updateRol)
router.delete("/roles/:id", deleteRol)
router.get("roles/buscar/especifico", getEspecifiedRol)

module.exports = router