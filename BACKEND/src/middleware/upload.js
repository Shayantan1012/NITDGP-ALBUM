const fs = require("fs")
const path = require("path")
const multer = require("multer")
const AppError = require("../utils/AppError")

const uploadDirectory = path.resolve(process.cwd(), "uploads")
fs.mkdirSync(uploadDirectory, { recursive: true })

const storage = multer.diskStorage({
  destination: uploadDirectory,
  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase()
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      return callback(new AppError("Only image files are allowed", 400))
    }
    return callback(null, true)
  },
})

module.exports = upload
