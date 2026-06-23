import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import logo from "../assets/logo.webp"

function LoginPresentation({ handelUserInput, handelFormSubmit }) {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <div className="auth-logo">
            <img src={logo} alt="NIT Durgapur" />
          </div>
          <span className="eyebrow eyebrow--light">Archive administration</span>
          <h1>Welcome back.</h1>
          <p>Sign in to curate collections, upload photographs, and keep the campus archive organised.</p>
          <div className="auth-card__register">
            <span>Joining the archive team?</span>
            <Link to="/nitdgp/admin/register">Create an admin account →</Link>
          </div>
        </div>
        <form onSubmit={handelFormSubmit} className="form-panel">
          <span className="eyebrow">Secure access</span>
          <h2>Admin sign in</h2>
          <label htmlFor="regNo">Registration number</label>
          <input type="text" id="regNo" name="regNo" placeholder="23U10248" required minLength={8} maxLength={8} onChange={handelUserInput} />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Your password" required minLength={6} onChange={handelUserInput} />
          <button type="submit" className="button button--primary">Sign in</button>
          <p className="form-panel__foot">
            New administrator? <Link to="/nitdgp/admin/register">Create an account</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

LoginPresentation.propTypes = {
  handelUserInput: PropTypes.func.isRequired,
  handelFormSubmit: PropTypes.func.isRequired,
}

export default LoginPresentation
