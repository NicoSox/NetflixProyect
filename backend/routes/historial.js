const express = require("express")
const { getAllHistorial, getOneHistorial, createHistorial, updateHistorial, deleteHistorial, getHistorialByUsuario } = require("../controllers/historial")
const router = express.Router()

router.get("/historial", getAllHistorial)
router.get("/historial/:id", getOneHistorial)
router.post("/historial", createHistorial)
router.put("/historial/:id", updateHistorial)
router.delete("/historial/:id", deleteHistorial)
router.get("historial/buscar/especifico", getHistorialByUsuario)

module.exports = router