const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
  imageURL: {
    type: String,
    required: [true, "Image URL is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
}, { _id: true })

module.exports = imageSchema
