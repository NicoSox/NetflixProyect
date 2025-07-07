const express = require("express")
const { getAllSeries, getOneSerie, createSerie, updateSerie, deleteSerie, getEspecifiedSerie } = require("../controllers/series")
const router = express.Router()

router.get("/series", getAllSeries)
router.get("/series/:id", getOneSerie)
router.post("/series", createSerie)
router.put("/series/:id", updateSerie)
router.delete("/series/:id", deleteSerie)
router.get("series/buscar/especifico", getEspecifiedSerie)

module.exports = router