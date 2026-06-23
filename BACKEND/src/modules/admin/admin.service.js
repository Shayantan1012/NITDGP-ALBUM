const AppError = require("../../utils/AppError")
const repository = require("./admin.repository")

function normalizeAdminPayload(body) {
  return {
    firstName: body.firstName?.trim(),
    lastName: body.lastName?.trim(),
    rollNo: body.Roll?.trim(),
    year: body.CurrentYear?.trim(),
    mobileNumber: body.mobileNumber?.trim(),
    role: "ADMIN",
    regNo: body.Reg?.trim().toUpperCase(),
    email: body.email?.trim().toLowerCase(),
    password: body.password,
  }
}

async function findAdmin(regNo) {
  const admin = await repository.findByRegistration(regNo)
  if (!admin) throw new AppError("Administrator not found", 404)
  return admin
}

async function createAdmin(body) {
  const details = normalizeAdminPayload(body)
  const required = ["firstName", "lastName", "rollNo", "year", "mobileNumber", "regNo", "email", "password"]
  if (required.some((field) => !details[field])) {
    throw new AppError("All registration fields are required", 400)
  }
  if (await repository.findByRegistration(details.regNo)) {
    throw new AppError("An administrator with this registration number already exists", 409)
  }
  return repository.create(details)
}

async function deleteAdmin(regNo) {
  const deleted = await repository.removeByRegistration(regNo)
  if (!deleted) throw new AppError("Administrator not found", 404)
  return deleted
}

module.exports = { findAdmin, createAdmin, deleteAdmin }
