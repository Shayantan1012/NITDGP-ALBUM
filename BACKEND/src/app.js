const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const env = require("./config/env")
const routes = require("./routes")
const { errorHandler, notFound } = require("./middleware/errorHandler")
const AppError = require("./utils/AppError")

const app = express()

const allowedOrigins = [
  env.frontendUrl,
  "http://localhost:5174",
  "http://127.0.0.1:5174",
]

app.disable("x-powered-by")
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new AppError("Origin not allowed by CORS", 403))
  },
  credentials: true,
}))
app.use(cookieParser())
app.use(express.json({ limit: "2mb" }))
app.use(express.urlencoded({ extended: true, limit: "2mb" }))

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "nit-dgp-album-api",
    timestamp: new Date().toISOString(),
  })
})

app.use(routes)
app.use(notFound)
app.use(errorHandler)

module.exports = app
