const express = require("express")
const { requireAdmin, requireAuth } = require("../../middleware/auth")
const controller = require("./admin.controller")

const router = express.Router()

router.post("/", controller.createAdmin)
router.get("/:regNo", requireAuth, requireAdmin, controller.findAdmin)
router.delete("/:regNo", requireAuth, requireAdmin, controller.deleteAdmin)

module.exports = router
