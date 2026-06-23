const fs = require("fs/promises")
const cloudinary = require("../../config/cloudinary")
const AppError = require("../../utils/AppError")
const { getGalleryConfig } = require("./gallery.config")
const repository = require("./gallery.repository")

function cloudinaryPublicId(imageUrl) {
  if (!imageUrl) return null
  const uploadPath = imageUrl.split("/upload/")[1]
  if (!uploadPath) return null
  return uploadPath
    .replace(/^v\d+\//, "")
    .replace(/\.[^.]+$/, "")
}

async function safelyRemoveLocalFile(filePath) {
  if (!filePath) return
  await fs.unlink(filePath).catch(() => {})
}

async function listCollections(type) {
  return repository.findAll(type)
}

async function addImage(type, { name, description, year, filePath }) {
  if (!name?.trim()) throw new AppError("Collection name is required", 400)
  if (!description?.trim()) throw new AppError("Image description is required", 400)
  if (!filePath) throw new AppError("Image file is required", 400)
  const normalizedYear = type === "event" && year ? Number(year) : undefined
  if (type === "event" && year && (!Number.isInteger(normalizedYear) || normalizedYear < 1960 || normalizedYear > 2100)) {
    throw new AppError("Please provide a valid event year", 400)
  }

  let collection = await repository.findByName(type, name.trim(), normalizedYear)
  if (type === "event" && !normalizedYear && !collection) {
    throw new AppError("Event year is required", 400)
  }

  let upload
  try {
    upload = await cloudinary.uploader.upload(filePath, {
      folder: `nit-dgp-album/${type}`,
      resource_type: "image",
    })
  } finally {
    await safelyRemoveLocalFile(filePath)
  }

  if (!collection) {
    collection = await repository.createCollection(
      type,
      name.trim(),
      type === "event" ? { year: normalizedYear } : {},
    )
  }

  collection.image.push({
    imageURL: upload.secure_url,
    description: description.trim(),
  })
  return collection.save()
}

async function deleteImage(type, name, objectID, year) {
  const collection = await repository.findByName(type, name, year)
  if (!collection) throw new AppError("Collection not found", 404)

  const image = collection.image.id(objectID)
  if (!image) throw new AppError("Image not found", 404)

  const publicId = cloudinaryPublicId(image.imageURL)
  if (publicId) {
    await cloudinary.uploader.destroy(publicId).catch(() => {})
  }

  image.deleteOne()
  return collection.save()
}

async function renameCollection(type, oldName, newName, year) {
  if (!newName?.trim()) throw new AppError("New collection name is required", 400)
  const existing = await repository.findByName(type, newName.trim(), year)
  if (existing && existing[getGalleryConfig(type).nameField] !== oldName) {
    throw new AppError("A collection with this name already exists", 409)
  }

  const collection = await repository.findByName(type, oldName, year)
  if (!collection) throw new AppError("Collection not found", 404)

  collection[getGalleryConfig(type).nameField] = newName.trim()
  return collection.save()
}

async function deleteCollection(type, collectionID) {
  const { model } = getGalleryConfig(type)
  const collection = await model.findById(collectionID)
  if (!collection) throw new AppError("Collection not found", 404)

  const publicIds = (collection.image || [])
    .map((image) => cloudinaryPublicId(image.imageURL))
    .filter(Boolean)

  await Promise.allSettled(
    publicIds.map((publicId) =>
      cloudinary.uploader.destroy(publicId),
    ),
  )

  await repository.deleteCollection(type, collectionID)
  return { id: collectionID }
}

module.exports = {
  listCollections,
  addImage,
  deleteImage,
  renameCollection,
  deleteCollection,
}
