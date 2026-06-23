const mongoose = require("mongoose")
const env = require("./env")
const Event = require("../models/Event")

function preferredEventName(names) {
  return [...names].sort((first, second) => {
    const firstIsUppercase = first === first.toUpperCase()
    const secondIsUppercase = second === second.toUpperCase()
    if (firstIsUppercase !== secondIsUppercase) return firstIsUppercase ? 1 : -1
    return first.length - second.length
  })[0]
}

async function normalizeAndMergeEvents() {
  const events = await Event.find().sort({ createdAt: 1 })
  const groups = new Map()

  events.forEach((event) => {
    const eventNameKey = Event.normalizeName(event.eventName)
    const groupKey = `${eventNameKey}::${event.year ?? "unspecified"}`
    if (!groups.has(groupKey)) groups.set(groupKey, [])
    groups.get(groupKey).push(event)
  })

  for (const duplicateGroup of groups.values()) {
    const primary = duplicateGroup[0]
    primary.eventName = preferredEventName(duplicateGroup.map((event) => event.eventName))
    primary.eventNameKey = Event.normalizeName(primary.eventName)

    if (duplicateGroup.length > 1) {
      const existingImageUrls = new Set(primary.image.map((image) => image.imageURL))
      duplicateGroup.slice(1).forEach((duplicate) => {
        duplicate.image.forEach((image) => {
          if (!existingImageUrls.has(image.imageURL)) {
            primary.image.push({
              imageURL: image.imageURL,
              description: image.description,
            })
            existingImageUrls.add(image.imageURL)
          }
        })
      })
      await Event.deleteMany({ _id: { $in: duplicateGroup.slice(1).map((event) => event._id) } })
    }

    await primary.save()
  }
}

async function ensureEventIndexes() {
  const indexes = await Event.collection.indexes()
  const obsoleteIndexes = indexes.filter(
    (index) =>
      index.name !== "_id_" &&
      (index.key?.eventName === 1 || index.key?.eventNameKey === 1),
  )
  for (const index of obsoleteIndexes) {
    await Event.collection.dropIndex(index.name)
  }
  await normalizeAndMergeEvents()
  await Event.syncIndexes()
}

async function connectDatabase() {
  await mongoose.connect(env.databaseUrl)
  await ensureEventIndexes()
  console.log("Database connected")
}

module.exports = connectDatabase
