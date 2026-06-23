import { NavLink, Outlet, useNavigate } from "react-router-dom"
import logo from "../assets/logo.webp"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { LogOut, selectAuth } from "../Redux/Slices/AdminSlice"

const links = [
  ["Overview", "/admin"],
  ["Campus", "/admin/campus"],
  ["Events", "/admin/events"],
  ["Departments", "/admin/departments"],
  ["About page", "/admin/about"],
]

function AdminLayout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const auth = useAppSelector(selectAuth)

  async function logout() {
    await dispatch(LogOut())
    navigate("/admin/login", { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button type="button" className="admin-brand" onClick={() => navigate("/admin")}>
          <span><img src={logo} alt="" /></span>
          <div><strong>Campus Chronicles</strong><small>Administration</small></div>
        </button>
        <nav>
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} end={path === "/admin"}>{label}</NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <span>{auth.user?.firstName || "Archive"} {auth.user?.lastName || "Admin"}</span>
          <small>{auth.user?.email}</small>
          <button type="button" onClick={logout}>Log out</button>
        </div>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div><span>Admin workspace</span><strong>Manage the visual archive</strong></div>
          <button type="button" onClick={() => navigate("/")}>View public site ↗</button>
        </header>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
