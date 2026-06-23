import Footer from "../Layout/Footer"
import Header from "../Layout/Header"

function AboutUs() {
  return (
    <div className="app-shell">
      <Header PageType="About" />
      <main>
        <section className="page-hero page-container">
          <div>
            <span className="eyebrow">About the institute</span>
            <h1>Built on learning, shaped by community.</h1>
            <p>NIT Durgapur has grown from a regional engineering college into one of India&apos;s leading technical institutions.</p>
          </div>
        </section>
        <section className="page-container about-grid section-space">
          <article><span>1960</span><h2>A long academic legacy</h2><p>Established as Regional Engineering College, Durgapur, the institute was created to advance engineering education and national integration.</p></article>
          <article><span>187 acres</span><h2>A residential campus</h2><p>The institute sits north-west of Kolkata along the historic Grand Trunk Road, with academic, residential, and community spaces.</p></article>
          <article><span>Many disciplines</span><h2>Ideas across departments</h2><p>Engineering, science, management, and research communities work side by side, creating the memories collected in this archive.</p></article>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default AboutUs
