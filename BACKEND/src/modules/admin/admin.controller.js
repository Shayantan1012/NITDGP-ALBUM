const asyncHandler = require("../../utils/asyncHandler")
const { sendSuccess } = require("../../utils/response")
const service = require("./admin.service")

const findAdmin = asyncHandler(async (req, res) => {
  const response = await service.findAdmin(req.params.regNo)
  return sendSuccess(res, { message: "Administrator fetched successfully", data: { response } })
})

const createAdmin = asyncHandler(async (req, res) => {
  const response = await service.createAdmin(req.body)
  return sendSuccess(res, {
    status: 201,
    message: "Administrator account created successfully",
    data: { response },
  })
})

const deleteAdmin = asyncHandler(async (req, res) => {
  const response = await service.deleteAdmin(req.params.regNo)
  return sendSuccess(res, { message: "Administrator deleted successfully", data: { response } })
})

module.exports = { findAdmin, createAdmin, deleteAdmin }
