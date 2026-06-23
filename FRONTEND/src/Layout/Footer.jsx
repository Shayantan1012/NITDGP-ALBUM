function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-container site-footer__inner">
        <div>
          <strong>Campus Chronicles</strong>
          <p>A visual archive of NIT Durgapur.</p>
        </div>
        <p>Built for the campus community · {new Date().getFullYear()}</p>
        <a href="https://nitdgp.ac.in/" target="_blank" rel="noreferrer">Official website ↗</a>
      </div>
    </footer>
  )
}

export default Footer
