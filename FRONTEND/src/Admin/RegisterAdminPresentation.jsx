import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import logo from "../assets/logo.webp"

const fields = [
  ["firstName", "First name", "text", "John"],
  ["lastName", "Last name", "text", "Doe"],
  ["mobileNumber", "Mobile number", "tel", "10-digit number"],
  ["CurrentYear", "Current year", "text", "2nd"],
  ["Roll", "Roll number", "text", "23CS8064"],
  ["Reg", "Registration number", "text", "23U10248"],
  ["email", "Official email", "email", "name@nitdgp.ac.in"],
  ["password", "Password", "password", "Minimum 6 characters"],
]

function RegisterAdminPresentation({ handelUserInput, handelFormSubmit }) {
  return (
    <main className="auth-page">
      <section className="auth-card auth-card--register">
        <div className="auth-card__intro">
          <div className="auth-logo">
            <img src={logo} alt="NIT Durgapur" />
          </div>
          <span className="eyebrow eyebrow--light">Campus Chronicles</span>
          <h1>Join the archive.</h1>
          <p>Create an administrator account to preserve campus memories and organise visual collections.</p>
          <div className="auth-card__register">
            <span>Already have access?</span>
            <Link to="/admin/login">Return to sign in →</Link>
          </div>
        </div>
        <form onSubmit={handelFormSubmit} className="form-panel form-panel--register">
          <span className="eyebrow">Admin registration</span>
          <h2>Create your account</h2>
          <p className="form-panel__lead">Use your official institute information.</p>
          <div className="form-grid">
            {fields.map(([name, label, type, placeholder]) => (
              <div key={name}>
                <label htmlFor={name}>{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  required
                  minLength={name === "password" ? 6 : undefined}
                  maxLength={["Roll", "Reg"].includes(name) ? 8 : undefined}
                  onChange={handelUserInput}
                />
              </div>
            ))}
          </div>
          <button type="submit" className="button button--primary">Create account</button>
          <p className="form-panel__foot">Already registered? <Link to="/admin/login">Sign in</Link></p>
        </form>
      </section>
    </main>
  )
}

RegisterAdminPresentation.propTypes = {
  handelUserInput: PropTypes.func.isRequired,
  handelFormSubmit: PropTypes.func.isRequired,
}

export default RegisterAdminPresentation
