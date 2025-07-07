const express = require("express")
const { getAllFavoritos, getOneFavorito, createFavorito, updateFavorito, deleteFavorito, getFavoritosByUsuario } = require("../controllers/favoritos")
const router = express.Router()

router.get("/favoritos", getAllFavoritos)
router.get("/favoritos/:id", getOneFavorito)
router.post("/favoritos", createFavorito)
router.put("/favoritos/:id", updateFavorito)
router.delete("/favoritos/:id", deleteFavorito)
router.get("/favoritos/usuario/:id_usuario", getFavoritosByUsuario)


module.exports = router