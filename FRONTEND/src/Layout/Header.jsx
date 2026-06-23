import PropTypes from "prop-types"
import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/logo.webp"
import PopUp from "../Pages/PopUp"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { LogOut, selectIsAdmin, selectIsLoggedIn } from "../Redux/Slices/AdminSlice"

const navItems = [
  ["Campus", "/mycampus"],
  ["Events", "/events"],
  ["Departments", "/departments"],
  ["About", "/aboutUs"],
]

function Header({ PageType, name, imageType, year, collectionID }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const dispatch = useAppDispatch()
  const isAdmin = useAppSelector(selectIsAdmin)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const navigate = useNavigate()

  async function logout() {
    await dispatch(LogOut())
    navigate("/")
  }

  return (
    <header className="site-header">
      <div className="page-container site-header__inner">
        <button type="button" className="brand" onClick={() => navigate("/")}>
          <img src={logo} alt="" />
          <span><strong>Campus</strong> Chronicles</span>
        </button>

        <button
          type="button"
          className="menu-button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span />
        </button>

        <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}>
          {navItems.map(([label, path]) => (
            <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          {PageType === "FinalImage" && isAdmin && (
            <>
              <button type="button" className="nav-action" onClick={() => setRenameOpen((open) => !open)}>
                Rename
              </button>
              <button
                type="button"
                className="nav-action nav-action--primary"
                onClick={() => navigate("/admin/imageUpload", {
                  state: { name, imageType, year, collectionID },
                })}
              >
                Add photo
              </button>
            </>
          )}
          {isAdmin && <button type="button" className="nav-action" onClick={logout}>Log out</button>}
          {!isLoggedIn && <button type="button" className="nav-action nav-action--primary" onClick={() => navigate("/nitdgp/admin")}>Admin</button>}
        </nav>
      </div>
      {renameOpen && (
        <div className="rename-panel page-container">
          <PopUp
            eventName={name}
            imageType={imageType}
            year={year}
            onClose={() => setRenameOpen(false)}
          />
        </div>
      )}
    </header>
  )
}

Header.propTypes = {
  PageType: PropTypes.string.isRequired,
  name: PropTypes.string,
  imageType: PropTypes.oneOf(["EVENT", "CAMPUS", "DEPARTMENT"]),
  year: PropTypes.number,
  collectionID: PropTypes.string,
}

export default Header
