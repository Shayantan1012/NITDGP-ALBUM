const env = require("../../config/env")
const asyncHandler = require("../../utils/asyncHandler")
const { sendSuccess } = require("../../utils/response")
const service = require("./auth.service")

const baseCookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: env.cookieSecure ? "none" : "lax",
}

const cookieOptions = {
  ...baseCookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

const login = asyncHandler(async (req, res) => {
  const response = await service.login(req.body)
  res.cookie("authToken", response.token, cookieOptions)
  return sendSuccess(res, {
    message: "Logged in successfully",
    data: { response },
  })
})

function logout(req, res) {
  res.clearCookie("authToken", baseCookieOptions)
  return sendSuccess(res, { message: "Logged out successfully" })
}

module.exports = { login, logout }
