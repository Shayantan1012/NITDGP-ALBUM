import { useState } from "react"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import {
  createAboutSection,
  deleteAboutSection,
  selectAboutSections,
  updateAboutSection,
} from "../Redux/Slices/AboutSlice"

const emptyForm = { eyebrow: "", title: "", content: "", order: "" }

function AdminAboutPage() {
  const dispatch = useAppDispatch()
  const sections = useAppSelector(selectAboutSections)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState(null)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function startEditing(section) {
    setEditingId(section._id)
    setForm({
      eyebrow: section.eyebrow || "",
      title: section.title,
      content: section.content,
      order: String(section.order ?? ""),
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function resetForm() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    const details = {
      ...form,
      order: form.order === "" ? undefined : Number(form.order),
    }
    try {
      if (editingId) {
        await dispatch(updateAboutSection({ id: editingId, details })).unwrap()
      } else {
        await dispatch(createAboutSection(details)).unwrap()
      }
      resetForm()
    } catch {
      // Thunks display API errors.
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="admin-content">
      <section className="admin-heading">
        <div>
          <span>Public content</span>
          <h1>Manage About page</h1>
          <p>Create, edit, order, and remove the sections visitors see on the public About page.</p>
        </div>
      </section>

      <section className="about-admin-layout">
        <form className="about-editor" onSubmit={submit}>
          <div className="about-editor__heading">
            <h2>{editingId ? "Edit section" : "Add section"}</h2>
            {editingId && <button type="button" onClick={resetForm}>Cancel editing</button>}
          </div>
          <label htmlFor="eyebrow">Small heading</label>
          <input id="eyebrow" name="eyebrow" value={form.eyebrow} onChange={updateField} placeholder="For example: Our history" />
          <label htmlFor="title">Section title</label>
          <input id="title" name="title" value={form.title} onChange={updateField} required placeholder="A long academic legacy" />
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="8" value={form.content} onChange={updateField} required placeholder="Write the section content…" />
          <label htmlFor="order">Display order</label>
          <input id="order" name="order" type="number" min="0" value={form.order} onChange={updateField} placeholder="Added automatically" />
          <button type="submit" className="button button--primary" disabled={saving}>
            {saving ? "Saving…" : editingId ? "Save changes" : "Add section"}
          </button>
        </form>

        <div className="about-section-list">
          <div className="about-section-list__heading">
            <h2>Current sections</h2><span>{sections.length}</span>
          </div>
          {!sections.length && <p className="about-section-list__empty">No managed sections yet. The public page is showing its default content.</p>}
          {sections.map((section) => (
            <article key={section._id}>
              <div><small>{section.eyebrow || `Section ${section.order}`}</small><h3>{section.title}</h3><p>{section.content}</p></div>
              <footer>
                <span>Order {section.order}</span>
                <button type="button" onClick={() => startEditing(section)}>Edit</button>
                <button type="button" className="danger-link" onClick={() => setPendingDelete(section)}>Delete</button>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {pendingDelete && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setPendingDelete(null)}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <span className="confirm-dialog__warning">Permanent action</span>
            <h2>Delete “{pendingDelete.title}”?</h2>
            <p>This section will immediately disappear from the public About page.</p>
            <div className="confirm-dialog__actions">
              <button type="button" className="button button--secondary" onClick={() => setPendingDelete(null)}>Cancel</button>
              <button type="button" className="button button--danger" onClick={async () => {
                await dispatch(deleteAboutSection(pendingDelete._id))
                setPendingDelete(null)
              }}>Delete section</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default AdminAboutPage
