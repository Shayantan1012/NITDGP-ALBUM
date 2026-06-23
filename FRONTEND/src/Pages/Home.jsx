import { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import CustomCarousel from "../Components/CustomCarousel"
import { EmptyState, LoadingState } from "../Components/PageState"
import Footer from "../Layout/Footer"
import Header from "../Layout/Header"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { GALLERY_TYPES } from "../Redux/galleryConfig"
import {
  fetchGallery,
  selectAllGalleryItems,
} from "../Redux/Slices/GallerySlice"

function Home() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const groups = useAppSelector(selectAllGalleryItems)
  const statuses = useAppSelector((state) => Object.values(state.gallery).map((item) => item.status))
  const campusCount = useAppSelector((state) => state.gallery.campus.items.length)
  const eventCount = useAppSelector((state) => state.gallery.event.items.length)
  const departmentCount = useAppSelector((state) => state.gallery.department.items.length)
  const isLoading = statuses.some((status) => status === "loading")
  const hasFailed = statuses.every((status) => status === "failed")

  const featuredImages = useMemo(
    () => groups.flatMap((group) => group.image || []).filter((image) => image.imageURL).slice(0, 10),
    [groups],
  )

  const retry = () => {
    Object.values(GALLERY_TYPES).forEach((category) => dispatch(fetchGallery(category)))
  }

  return (
    <div className="app-shell">
      <Header PageType="Home" />
      <main>
        <section className="home-hero">
          <div className="page-container home-hero__content">
            <div className="home-hero__copy">
              <span className="eyebrow eyebrow--light">NIT Durgapur visual archive</span>
              <h1>Every campus has stories. <em>Ours live here.</em></h1>
              <p>
                A living album of places, people, departments, and events—collected by the campus community.
              </p>
              <div className="home-hero__actions">
                <button type="button" className="button button--accent" onClick={() => navigate("/mycampus")}>
                  Explore the campus
                </button>
                <button type="button" className="button button--ghost-light" onClick={() => navigate("/aboutUs")}>
                  About NIT Durgapur
                </button>
              </div>
            </div>
            <div className="home-hero__stats">
              <div><strong>{campusCount}</strong><span>Campus places</span></div>
              <div><strong>{eventCount}</strong><span>Event albums</span></div>
              <div><strong>{departmentCount}</strong><span>Departments</span></div>
            </div>
          </div>
        </section>

        <section className="page-container section-space">
          <div className="section-heading">
            <div><span className="eyebrow">Featured memories</span><h2>A glimpse of campus life</h2></div>
            <button type="button" className="text-link" onClick={() => navigate("/events")}>View all events →</button>
          </div>

          {isLoading && !featuredImages.length && <LoadingState />}
          {hasFailed && !featuredImages.length && (
            <EmptyState title="We could not load the album" message="The backend may be offline." onRetry={retry} />
          )}
          {!isLoading && !hasFailed && !featuredImages.length && (
            <EmptyState title="The album is waiting" message="Add the first campus photograph to begin the story." />
          )}
          <CustomCarousel
            items={featuredImages}
            label="Featured campus photographs"
            renderItem={(image) => (
              <figure className="feature-slide">
                <img src={image.imageURL} alt={image.description || "Campus memory"} />
                <figcaption>
                  <span>Campus chronicle</span>
                  <h3>{image.description || "A moment from NIT Durgapur"}</h3>
                </figcaption>
              </figure>
            )}
          />
        </section>

        <section className="page-container category-links section-space">
          {[
            ["Campus", "Architecture, landmarks, and everyday corners.", "/mycampus", "01"],
            ["Events", "Celebrations, clubs, competitions, and culture.", "/events", "02"],
            ["Departments", "The academic communities behind the institute.", "/departments", "03"],
          ].map(([title, text, path, number]) => (
            <button type="button" key={path} onClick={() => navigate(path)} className="category-link">
              <span>{number}</span><h3>{title}</h3><p>{text}</p><b>Explore →</b>
            </button>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home
