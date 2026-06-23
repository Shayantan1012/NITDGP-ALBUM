const asyncHandler = require("../../utils/asyncHandler")
const { sendSuccess } = require("../../utils/response")
const { getGalleryConfig } = require("./gallery.config")
const service = require("./gallery.service")

const list = (type) => asyncHandler(async (req, res) => {
  const response = await service.listCollections(type)
  return sendSuccess(res, {
    message: "Images fetched successfully",
    data: { response },
  })
})

const upload = (type) => asyncHandler(async (req, res) => {
  const config = getGalleryConfig(type)
  const response = await service.addImage(type, {
    name: req.body[config.bodyField],
    description: req.body.description,
    year: req.body.year,
    filePath: req.file?.path,
  })
  return sendSuccess(res, {
    status: 201,
    message: "Image uploaded successfully",
    data: { response },
  })
})

const remove = (type) => asyncHandler(async (req, res) => {
  const response = await service.deleteImage(
    type,
    req.params.eventName,
    req.params.objectID,
    req.query.year,
  )
  return sendSuccess(res, {
    message: "Image deleted successfully",
    data: { response },
  })
})

const rename = (type) => asyncHandler(async (req, res) => {
  const response = await service.renameCollection(
    type,
    req.params.oldEventName,
    req.params.eventName,
    req.query.year,
  )
  return sendSuccess(res, {
    message: "Collection renamed successfully",
    data: { response },
  })
})

const removeCollection = (type) => asyncHandler(async (req, res) => {
  const response = await service.deleteCollection(type, req.params.collectionID)
  return sendSuccess(res, {
    message: "Collection deleted successfully",
    data: { response },
  })
})

module.exports = { list, upload, remove, rename, removeCollection }
