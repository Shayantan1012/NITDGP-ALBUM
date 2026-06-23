const mongoose = require("mongoose")
const imageSchema = require("./imageFields")

const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, unique: true, trim: true },
  image: { type: [imageSchema], default: [] },
}, { timestamps: true })

module.exports = mongoose.models.Department || mongoose.model("Department", departmentSchema)
