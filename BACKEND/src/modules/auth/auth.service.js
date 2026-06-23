const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const env = require("../../config/env")
const AppError = require("../../utils/AppError")
const adminRepository = require("../admin/admin.repository")

async function login({ regNo, password }) {
  if (!regNo || !password) throw new AppError("Registration number and password are required", 400)

  const admin = await adminRepository.findByRegistration(regNo, true)
  if (!admin) throw new AppError("Invalid registration number or password", 401)

  const passwordMatches = await bcrypt.compare(password, admin.password)
  if (!passwordMatches) throw new AppError("Invalid registration number or password", 401)

  const token = jwt.sign(
    { id: admin._id, regNo: admin.regNo, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  )

  return {
    token,
    adminData: {
      email: admin.email,
      regNo: admin.regNo,
      role: admin.role,
      firstName: admin.firstName,
      lastName: admin.lastName,
    },
  }
}

module.exports = { login }
