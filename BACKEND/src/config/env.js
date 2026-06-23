const dotenv = require("dotenv")

dotenv.config()

const required = [
  "DB_URL",
  "JWT_SECRET",
  "CLOUDINARY_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
]

const missing = required.filter((key) => !process.env[key])
if (missing.length) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
}

const toBoolean = (value) => String(value).toLowerCase() === "true"

module.exports = {
  port: Number(process.env.PORT) || 5200,
  databaseUrl: process.env.DB_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES || "1h",
  cookieSecure: toBoolean(process.env.COOKIE_SECURE),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5174",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
}
