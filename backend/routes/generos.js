const express = require("express")
const { getAllGeneros, getOneGenero, createGenero, updateGenero, deleteGenero, getEspecifiedGenero } = require("../controllers/generos")
const router = express.Router()

router.get("/generos", getAllGeneros)
router.get("/generos/:id", getOneGenero)
router.post("/generos", createGenero)
router.put("/generos/:id", updateGenero)
router.delete("/generos/:id", deleteGenero)
router.get("generos/buscar/especifico", getEspecifiedGenero)

module.exports = router