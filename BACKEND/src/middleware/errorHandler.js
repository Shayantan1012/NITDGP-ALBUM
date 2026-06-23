const multer = require("multer")

function notFound(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: { name: "NotFoundError" },
    data: {},
  })
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)

  let statusCode = error.statusCode || 500
  let message = error.message || "Internal server error"

  if (error.name === "ValidationError") {
    statusCode = 400
    message = Object.values(error.errors).map((item) => item.message).join(", ")
  }
  if (error.code === 11000) {
    statusCode = 409
    message = `${Object.keys(error.keyPattern || {})[0] || "Record"} already exists`
  }
  if (error instanceof multer.MulterError) {
    statusCode = 400
  }

  if (statusCode >= 500) console.error(error)

  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      name: error.name || "Error",
      ...(error.details || {}),
    },
    data: {},
  })
}

module.exports = { notFound, errorHandler }
