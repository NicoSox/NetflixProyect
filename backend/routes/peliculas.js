const express = require("express")
const { getAllPeliculas, getOnePelicula, createPelicula, updatePelicula, deletePelicula, getEspecifiedPelicula } = require("../controllers/peliculas")
const router = express.Router()

router.get("/peliculas", getAllPeliculas)
router.get("/peliculas/:id", getOnePelicula)
router.post("/peliculas", createPelicula)
router.put("/peliculas/:id", updatePelicula)
router.delete("/peliculas/:id", deletePelicula)
router.get("peliculas/buscar/especifico", getEspecifiedPelicula)

module.exports = router