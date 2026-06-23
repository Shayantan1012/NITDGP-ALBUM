const express = require("express")
const { requireAdmin, requireAuth } = require("../../middleware/auth")
const controller = require("./about.controller")

const router = express.Router()

router.get("/", controller.list)
router.post("/", requireAuth, requireAdmin, controller.create)
router.patch("/:id", requireAuth, requireAdmin, controller.update)
router.delete("/:id", requireAuth, requireAdmin, controller.remove)

module.exports = router
