const asyncHandler = require("../../utils/asyncHandler")
const { sendSuccess } = require("../../utils/response")
const service = require("./about.service")

const list = asyncHandler(async (req, res) => {
  const response = await service.listSections()
  return sendSuccess(res, {
    message: "About sections fetched successfully",
    data: { response },
  })
})

const create = asyncHandler(async (req, res) => {
  const response = await service.createSection(req.body)
  return sendSuccess(res, {
    status: 201,
    message: "About section created successfully",
    data: { response },
  })
})

const update = asyncHandler(async (req, res) => {
  const response = await service.updateSection(req.params.id, req.body)
  return sendSuccess(res, {
    message: "About section updated successfully",
    data: { response },
  })
})

const remove = asyncHandler(async (req, res) => {
  const response = await service.deleteSection(req.params.id)
  return sendSuccess(res, {
    message: "About section deleted successfully",
    data: { response },
  })
})

module.exports = { list, create, update, remove }
