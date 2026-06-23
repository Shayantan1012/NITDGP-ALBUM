import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../Redux/hooks"

function AdminDashboard() {
  const navigate = useNavigate()
  const gallery = useAppSelector((state) => state.gallery)
  const cards = [
    ["Campus collections", gallery.campus.items.length, "/admin/campus", "Places and landmarks"],
    ["Event collections", gallery.event.items.length, "/admin/events", "Organised by event year"],
    ["Departments", gallery.department.items.length, "/admin/departments", "Academic communities"],
  ]
  const photoCount = Object.values(gallery)
    .flatMap((collection) => collection.items)
    .reduce((total, group) => total + (group.image?.length || 0), 0)

  return (
    <main className="admin-content">
      <section className="admin-heading">
        <div><span>Overview</span><h1>Archive dashboard</h1><p>Manage collections and photographs without changing the public browsing experience.</p></div>
      </section>
      <section className="admin-stats">
        <article><span>Total photographs</span><strong>{photoCount}</strong><p>Across the entire archive</p></article>
        {cards.map(([title, count, path, text]) => (
          <button type="button" key={path} onClick={() => navigate(path)}>
            <span>{title}</span><strong>{count}</strong><p>{text} →</p>
          </button>
        ))}
      </section>
      <section className="admin-quick-actions">
        <h2>Quick actions</h2>
        <div>
          <button type="button" onClick={() => navigate("/admin/upload", { state: { imageType: "CAMPUS" } })}>Add campus collection</button>
          <button type="button" onClick={() => navigate("/admin/upload", { state: { imageType: "EVENT" } })}>Add event collection</button>
          <button type="button" onClick={() => navigate("/admin/upload", { state: { imageType: "DEPARTMENT" } })}>Add department</button>
        </div>
      </section>
    </main>
  )
}

export default AdminDashboard
