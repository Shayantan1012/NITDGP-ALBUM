const express = require("express")
const { requireAdmin, requireAuth } = require("../../middleware/auth")
const uploadMiddleware = require("../../middleware/upload")
const controller = require("./gallery.controller")

function createGalleryRouter(type) {
  const router = express.Router()
  router.get("/", controller.list(type))
  router.post("/", requireAuth, requireAdmin, uploadMiddleware.single("imageURL"), controller.upload(type))
  router.delete("/collection/:collectionID", requireAuth, requireAdmin, controller.removeCollection(type))
  router.delete("/:eventName/:objectID", requireAuth, requireAdmin, controller.remove(type))
  router.post("/:oldEventName/:eventName", requireAuth, requireAdmin, controller.rename(type))
  return router
}

module.exports = createGalleryRouter
