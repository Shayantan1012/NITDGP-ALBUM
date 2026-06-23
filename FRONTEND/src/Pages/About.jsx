import { EmptyState, LoadingState } from "../Components/PageState"
import Footer from "../Layout/Footer"
import Header from "../Layout/Header"
import { useAppSelector } from "../Redux/hooks"
import { selectAboutSections, selectAboutStatus } from "../Redux/Slices/AboutSlice"

const defaultSections = [
  {
    _id: "default-history",
    eyebrow: "1960",
    title: "A long academic legacy",
    content: "Established as Regional Engineering College, Durgapur, the institute was created to advance engineering education and national integration.",
  },
  {
    _id: "default-campus",
    eyebrow: "187 acres",
    title: "A residential campus",
    content: "The institute sits north-west of Kolkata along the historic Grand Trunk Road, with academic, residential, and community spaces.",
  },
  {
    _id: "default-disciplines",
    eyebrow: "Many disciplines",
    title: "Ideas across departments",
    content: "Engineering, science, management, and research communities work side by side, creating the memories collected in this archive.",
  },
]

function AboutUs() {
  const managedSections = useAppSelector(selectAboutSections)
  const status = useAppSelector(selectAboutStatus)
  const sections = managedSections.length ? managedSections : defaultSections

  return (
    <div className="app-shell">
      <Header />
      <main>
        <section className="page-hero page-container">
          <div>
            <span className="eyebrow">About the institute</span>
            <h1>Built on learning, shaped by community.</h1>
            <p>NIT Durgapur has grown from a regional engineering college into one of India&apos;s leading technical institutions.</p>
          </div>
        </section>
        {status === "loading" && !managedSections.length ? (
          <LoadingState message="Loading About content…" />
        ) : status === "failed" && !sections.length ? (
          <EmptyState title="About content is unavailable" message="Please try again later." />
        ) : (
          <section className="page-container about-grid section-space">
            {sections.map((section) => (
              <article key={section._id}>
                <span>{section.eyebrow}</span>
                <h2>{section.title}</h2>
                <p>{section.content}</p>
              </article>
            ))}
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default AboutUs
