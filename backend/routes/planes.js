const express = require("express")
const { getAllPlanes, getOnePlan, createPlan, updatePlan, deletePlan, getEspecifiedPlan } = require("../controllers/planes")
const router = express.Router()

router.get("/planes", getAllPlanes)
router.get("/planes/:id", getOnePlan)
router.post("/planes", createPlan)
router.put("/planes/:id", updatePlan)
router.delete("/planes/:id", deletePlan)
router.get("planes/buscar/especifico", getEspecifiedPlan)

module.exports = router