const express = require("express")
const { registrarVisualizacion, getTopTendencias } = require("../controllers/tendencias")
const router = express.Router()

router.post("/registrar", registrarVisualizacion)
router.get("/tendencias", getTopTendencias)

module.exports = router