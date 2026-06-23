const AboutSection = require("../../models/AboutSection")
const AppError = require("../../utils/AppError")

const listSections = () => AboutSection.find().sort({ order: 1, createdAt: 1 })

async function createSection(details) {
  if (!details.title?.trim() || !details.content?.trim()) {
    throw new AppError("Title and content are required", 400)
  }
  const highest = await AboutSection.findOne().sort({ order: -1 })
  return AboutSection.create({
    eyebrow: details.eyebrow?.trim(),
    title: details.title.trim(),
    content: details.content.trim(),
    order: Number.isFinite(Number(details.order))
      ? Number(details.order)
      : (highest?.order || 0) + 1,
  })
}

async function updateSection(id, details) {
  const section = await AboutSection.findById(id)
  if (!section) throw new AppError("About section not found", 404)

  if (details.eyebrow !== undefined) section.eyebrow = details.eyebrow.trim()
  if (details.title !== undefined) section.title = details.title.trim()
  if (details.content !== undefined) section.content = details.content.trim()
  if (details.order !== undefined) section.order = Number(details.order)

  return section.save()
}

async function deleteSection(id) {
  const section = await AboutSection.findByIdAndDelete(id)
  if (!section) throw new AppError("About section not found", 404)
  return { id }
}

module.exports = { listSections, createSection, updateSection, deleteSection }
