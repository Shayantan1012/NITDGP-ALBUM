const { getGalleryConfig } = require("./gallery.config")

async function findAll(type) {
  return getGalleryConfig(type).model.find().sort({ updatedAt: -1 })
}

async function findByName(type, name, year) {
  const { model, nameField } = getGalleryConfig(type)
  const filter = type === "event"
    ? { eventNameKey: model.normalizeName(name) }
    : { [nameField]: name }
  if (type === "event") {
    filter.year = year !== undefined && year !== null && year !== ""
      ? Number(year)
      : null
  }
  return model.findOne(filter)
}

async function createCollection(type, name, extra = {}) {
  const { model, nameField } = getGalleryConfig(type)
  return model.create({ [nameField]: name, ...extra })
}

async function deleteCollection(type, id) {
  return getGalleryConfig(type).model.findByIdAndDelete(id)
}

module.exports = { findAll, findByName, createCollection, deleteCollection }
