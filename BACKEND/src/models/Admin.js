const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  role: { type: String, enum: ["ADMIN", "USER"], default: "ADMIN" },
  year: { type: String, required: true, trim: true },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{10}$/, "Mobile number must contain 10 digits"],
  },
  rollNo: { type: String, required: true, trim: true },
  regNo: { type: String, required: true, unique: true, trim: true, uppercase: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
  },
  password: { type: String, required: true, minlength: 6, select: false },
}, {
  timestamps: true,
  toJSON: {
    transform(document, returnedObject) {
      delete returnedObject.password
      return returnedObject
    },
  },
})

adminSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return
  this.password = await bcrypt.hash(this.password, 12)
})

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema)
