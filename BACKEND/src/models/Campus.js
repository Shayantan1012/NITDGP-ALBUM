const mongoose = require("mongoose")
const imageSchema = require("./imageFields")

const campusSchema = new mongoose.Schema({
  placeName: { type: String, required: true, unique: true, trim: true },
  image: { type: [imageSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.models.Campus || mongoose.model("Campus", campusSchema)
