const mongoose = require("mongoose")
const imageSchema = require("./imageFields")

function normalizeEventName(value = "") {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en-US")
}

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, trim: true },
  eventNameKey: { type: String, trim: true, lowercase: true },
  year: {
    type: Number,
    min: [1960, "Event year cannot be before 1960"],
    max: [2100, "Event year is invalid"],
  },
  image: { type: [imageSchema], default: [] },
}, { timestamps: true })

eventSchema.pre("validate", function setEventNameKey() {
  this.eventName = this.eventName?.trim().replace(/\s+/g, " ")
  this.eventNameKey = normalizeEventName(this.eventName)
})

eventSchema.index(
  { eventNameKey: 1, year: 1 },
  {
    unique: true,
    partialFilterExpression: {
      year: { $type: "number" },
      eventNameKey: { $type: "string" },
    },
  },
)

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

Event.normalizeName = normalizeEventName

module.exports = Event
