const express = require("express")
const adminRoutes = require("../modules/admin/admin.routes")
const authRoutes = require("../modules/auth/auth.routes")
const createGalleryRouter = require("../modules/gallery/gallery.routes")
const galleryController = require("../modules/gallery/gallery.controller")

const router = express.Router()

router.use("/admin/campus", createGalleryRouter("campus"))
router.use("/admin/events", createGalleryRouter("event"))
router.use("/admin/departments", createGalleryRouter("department"))
router.use("/nit-dgp/admin", adminRoutes)
router.use("/admin/auth", authRoutes)

router.get("/user/campus", galleryController.list("campus"))
router.get("/user/event", galleryController.list("event"))
router.get("/user/department", galleryController.list("department"))

module.exports = router
