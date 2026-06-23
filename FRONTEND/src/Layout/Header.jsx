import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import logo from "../assets/logo.webp"

const navItems = [
  ["Campus", "/mycampus"],
  ["Events", "/events"],
  ["Departments", "/departments"],
  ["About", "/aboutUs"],
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

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
            <NavLink key={path} to={path} onClick={() => setMenuOpen(false)}>{label}</NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
