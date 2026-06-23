const mongoose = require("mongoose")

const aboutSectionSchema = new mongoose.Schema({
  eyebrow: {
    type: String,
    trim: true,
    maxlength: [80, "Eyebrow cannot exceed 80 characters"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    maxlength: [160, "Title cannot exceed 160 characters"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    maxlength: [3000, "Content cannot exceed 3000 characters"],
  },
  order: {
    type: Number,
    default: 0,
  },
}, { timestamps: true })

module.exports = mongoose.models.AboutSection
  || mongoose.model("AboutSection", aboutSectionSchema)
