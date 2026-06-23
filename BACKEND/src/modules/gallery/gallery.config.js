const Campus = require("../../models/Campus")
const Department = require("../../models/Department")
const Event = require("../../models/Event")

const galleryTypes = {
  campus: {
    model: Campus,
    nameField: "placeName",
    bodyField: "placeName",
  },
  department: {
    model: Department,
    nameField: "departmentName",
    bodyField: "departmentName",
  },
  event: {
    model: Event,
    nameField: "eventName",
    bodyField: "eventName",
  },
}

function getGalleryConfig(type) {
  const config = galleryTypes[type]
  if (!config) throw new Error(`Unsupported gallery type: ${type}`)
  return config
}

module.exports = { getGalleryConfig }
