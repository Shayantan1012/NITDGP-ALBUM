import PropTypes from "prop-types"
import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Footer from "../Layout/Footer"
import Header from "../Layout/Header"
import { isExpiredSession } from "../Redux/apiError"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { invalidateSession, selectIsAdmin } from "../Redux/Slices/AdminSlice"
import {
  deleteGalleryCollection,
  fetchGallery,
  selectGalleryItems,
  selectGalleryStatus,
} from "../Redux/Slices/GallerySlice"
import sorry from "../assets/sorry.svg"
import { EmptyState, LoadingState } from "./PageState"

function GalleryPage({ category, imageType, title, eyebrow, description, nameField }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAdmin = useAppSelector(selectIsAdmin)
  const groups = useAppSelector(selectGalleryItems(category))
  const status = useAppSelector(selectGalleryStatus(category))
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedYear, setSelectedYear] = useState("all")
  const isEventGallery = imageType === "EVENT"

  const yearGroups = useMemo(() => {
    if (!isEventGallery) return []
    const grouped = groups.reduce((result, group) => {
      const key = group.year || "unspecified"
      if (!result[key]) result[key] = []
      result[key].push(group)
      return result
    }, {})
    return Object.entries(grouped).sort(([yearA], [yearB]) => {
      if (yearA === "unspecified") return 1
      if (yearB === "unspecified") return -1
      return Number(yearB) - Number(yearA)
    })
  }, [groups, isEventGallery])

  const visibleYearGroups = selectedYear === "all"
    ? yearGroups
    : yearGroups.filter(([year]) => year === selectedYear)

  async function confirmDelete() {
    if (!pendingDelete) return
    setDeleting(true)
    try {
      await dispatch(deleteGalleryCollection({
        category,
        collectionID: pendingDelete._id,
      })).unwrap()
      setPendingDelete(null)
    } catch (error) {
      if (isExpiredSession(error)) {
        dispatch(invalidateSession())
        navigate("/nitdgp/admin", { replace: true })
      }
    } finally {
      setDeleting(false)
    }
  }

  function renderCollection(group) {
    const groupName = group[nameField]
    const photos = group.image || []
    return (
      <article key={group._id} className="collection-card">
        <button
          type="button"
          className="collection-card__open"
          onClick={() => navigate("/finalImage", {
            state: {
              imageDetails: photos,
              name: groupName,
              imagetype: imageType,
              year: group.year,
              collectionID: group._id,
            },
          })}
        >
          <div className="collection-card__image">
            <img src={photos[0]?.imageURL || sorry} alt={groupName} />
            <span>{photos.length} {photos.length === 1 ? "photo" : "photos"}</span>
          </div>
          <div className="collection-card__content">
            <h2>{groupName}</h2>
            {isEventGallery && <small>{group.year || "Year not specified"}</small>}
            <p>Open collection <span aria-hidden="true">→</span></p>
          </div>
        </button>
        {isAdmin && (
          <button
            type="button"
            className="collection-card__delete"
            onClick={() => setPendingDelete({
              _id: group._id,
              name: groupName,
              photos: photos.length,
              year: group.year,
            })}
          >
            Delete collection
          </button>
        )}
      </article>
    )
  }

  return (
    <div className="app-shell">
      <Header PageType={imageType === "CAMPUS" ? "MyCampus" : `${imageType}s`} />
      <main>
        <section className="page-hero page-container">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="button button--primary"
              onClick={() => navigate("/admin/imageUpload", { state: { imageType } })}
            >
              + Add collection
            </button>
          )}
        </section>

        <section className="page-container section-space">
          {status === "loading" && !groups.length && <LoadingState />}
          {status === "failed" && !groups.length && (
            <EmptyState
              title="The archive is unavailable"
              message="We could not reach the gallery service. Check the backend and try again."
              onRetry={() => dispatch(fetchGallery(category))}
            />
          )}
          {status !== "loading" && !groups.length && status !== "failed" && (
            <EmptyState title="Nothing here yet" message="This collection is waiting for its first photograph." />
          )}

          {isEventGallery ? (
            <div className="year-archive">
              <div className="year-filter" aria-label="Filter events by year">
                <span>Browse by year</span>
                <div className="year-filter__options">
                  <button
                    type="button"
                    className={selectedYear === "all" ? "year-filter__button year-filter__button--active" : "year-filter__button"}
                    onClick={() => setSelectedYear("all")}
                  >
                    All years
                  </button>
                  {yearGroups.map(([year, collections]) => (
                    <button
                      type="button"
                      key={year}
                      className={selectedYear === year ? "year-filter__button year-filter__button--active" : "year-filter__button"}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year === "unspecified" ? "Year not specified" : year}
                      <small>{collections.length}</small>
                    </button>
                  ))}
                </div>
              </div>

              {visibleYearGroups.map(([year, collections]) => (
                <section className="year-section" key={year}>
                  <div className="year-section__heading">
                    <span>{year === "unspecified" ? "Archive" : "Event year"}</span>
                    <h2>{year === "unspecified" ? "Year not specified" : year}</h2>
                    <p>{collections.length} {collections.length === 1 ? "event collection" : "event collections"}</p>
                  </div>
                  <div className="collection-grid">{collections.map(renderCollection)}</div>
                </section>
              ))}
            </div>
          ) : (
            <div className="collection-grid">{groups.map(renderCollection)}</div>
          )}
        </section>
      </main>
      <Footer />

      {pendingDelete && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => !deleting && setPendingDelete(null)}>
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-collection-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="confirm-dialog__warning">Permanent action</span>
            <h2 id="delete-collection-title">Delete “{pendingDelete.name}”?</h2>
            <p>
              {pendingDelete.year && <>This is the {pendingDelete.year} event collection. </>}
              This will permanently remove the collection and all {pendingDelete.photos} associated
              {pendingDelete.photos === 1 ? " photograph" : " photographs"} from the archive.
            </p>
            <div className="confirm-dialog__actions">
              <button type="button" className="button button--secondary" disabled={deleting} onClick={() => setPendingDelete(null)}>
                Cancel
              </button>
              <button type="button" className="button button--danger" disabled={deleting} onClick={confirmDelete}>
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

GalleryPage.propTypes = {
  category: PropTypes.string.isRequired,
  imageType: PropTypes.oneOf(["CAMPUS", "EVENT", "DEPARTMENT"]).isRequired,
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  nameField: PropTypes.string.isRequired,
}

export default GalleryPage
