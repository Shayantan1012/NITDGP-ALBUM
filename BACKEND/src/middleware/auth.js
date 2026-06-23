const jwt = require("jsonwebtoken")
const env = require("../config/env")
const AppError = require("../utils/AppError")

function requireAuth(req, res, next) {
  const token = req.cookies.authToken
  if (!token) return next(new AppError("Authentication required", 401))

  try {
    req.admin = jwt.verify(token, env.jwtSecret)
    return next()
  } catch (error) {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: env.cookieSecure ? "none" : "lax",
    })
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Session expired", 401, { name: "TokenExpiredError" }))
    }
    return next(new AppError("Invalid authentication token", 401))
  }
}

function requireAdmin(req, res, next) {
  if (req.admin?.role !== "ADMIN") {
    return next(new AppError("Administrator access required", 403))
  }
  return next()
}

module.exports = { requireAuth, requireAdmin }
