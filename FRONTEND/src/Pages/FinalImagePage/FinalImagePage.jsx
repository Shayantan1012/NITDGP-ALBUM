import PropTypes from "prop-types"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import CustomCarousel from "../../Components/CustomCarousel"
import { EmptyState } from "../../Components/PageState"
import Footer from "../../Layout/Footer"
import Header from "../../Layout/Header"
import { isExpiredSession } from "../../Redux/apiError"
import { GALLERY_TYPES } from "../../Redux/galleryConfig"
import { useAppDispatch, useAppSelector } from "../../Redux/hooks"
import {
  invalidateSession,
  selectIsAdmin,
  selectIsLoggedIn,
} from "../../Redux/Slices/AdminSlice"
import { deleteGalleryImage } from "../../Redux/Slices/GallerySlice"

const categories = {
  EVENT: GALLERY_TYPES.EVENT,
  CAMPUS: GALLERY_TYPES.CAMPUS,
  DEPARTMENT: GALLERY_TYPES.DEPARTMENT,
}

function FinalImagePagePresentation({ imageDetails, name, imageType, year, collectionID, adminMode = false }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const isAdmin = useAppSelector(selectIsAdmin)
  const canManage = adminMode && isAdmin
  const [images, setImages] = useState(imageDetails)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function deleteImage() {
    if (!pendingDelete) return
    if (!isLoggedIn) {
      toast.error("Please log in")
      navigate("/admin/login")
      return
    }
    setDeleting(true)
    try {
      await dispatch(deleteGalleryImage({
        category: categories[imageType],
        objectID: pendingDelete._id,
        name,
        year,
      })).unwrap()
      setImages((current) => current.filter((image) => image._id !== pendingDelete._id))
      setPendingDelete(null)
    } catch (error) {
      if (isExpiredSession(error)) {
        dispatch(invalidateSession())
        navigate("/admin/login", { replace: true })
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className={adminMode ? "admin-page" : "app-shell"}>
      {!adminMode && <Header />}
      <main>
        <section className={adminMode ? "admin-heading admin-heading--collection" : "page-hero page-container page-hero--compact"}>
          <div>
            <span className="eyebrow">{imageType.toLowerCase()} collection</span>
            <h1>{name}</h1>
            {imageType === "EVENT" && <div className="collection-year">{year || "Year not specified"}</div>}
            <p>{images.length} {images.length === 1 ? "photograph" : "photographs"} in this album.</p>
          </div>
          {canManage && (
            <div className="admin-heading__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => navigate("/admin/upload", {
                  state: { name, imageType, year, collectionID },
                })}
              >
                Add photo
              </button>
            </div>
          )}
        </section>

        <section className={adminMode ? "admin-gallery-content" : "page-container section-space"}>
          {!images.length ? (
            <EmptyState title="This collection is empty" message="Add a photograph to bring this album to life." />
          ) : (
            <>
              <CustomCarousel
                items={images}
                interval={6000}
                label={`${name} photographs`}
                renderItem={(image) => (
                  <figure className="feature-slide feature-slide--detail">
                    <img src={image.imageURL} alt={image.description || name} />
                    {image.description && (
                      <figcaption className="feature-slide__caption">
                        <span>Featured photograph</span>
                        <p>{image.description}</p>
                      </figcaption>
                    )}
                  </figure>
                )}
              />

              <div className="section-heading gallery-heading">
                <div><span className="eyebrow">Full collection</span><h2>Browse every photograph</h2></div>
              </div>
              <div className="photo-grid">
                {images.map((image) => (
                  <article className="photo-card" key={image._id}>
                    <button
                      type="button"
                      className="photo-card__image"
                      onClick={() => navigate("/onlyImage", { state: { ImageDetails: image } })}
                    >
                      <img src={image.imageURL} alt={image.description || name} />
                    </button>
                    <div className="photo-card__footer">
                      <p title={image.description || "Campus photograph"}>
                        {image.description || "Campus photograph"}
                      </p>
                      {canManage && (
                        <button
                          type="button"
                          className="icon-button icon-button--danger"
                          onClick={() => setPendingDelete(image)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      {!adminMode && <Footer />}

      {pendingDelete && (
        <div
          className="dialog-backdrop"
          role="presentation"
          onMouseDown={() => !deleting && setPendingDelete(null)}
        >
          <div
            className="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-photo-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="confirm-dialog__warning">Permanent action</span>
            <h2 id="delete-photo-title">Delete this photograph?</h2>
            <div className="confirm-dialog__preview">
              <img
                src={pendingDelete.imageURL}
                alt={pendingDelete.description || "Photograph selected for deletion"}
              />
            </div>
            <p>
              “{pendingDelete.description || "This photograph"}” will be permanently removed
              from the collection and Cloudinary.
            </p>
            <div className="confirm-dialog__actions">
              <button
                type="button"
                className="button button--secondary"
                disabled={deleting}
                onClick={() => setPendingDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="button button--danger"
                disabled={deleting}
                onClick={deleteImage}
              >
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

FinalImagePagePresentation.propTypes = {
  imageDetails: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    imageURL: PropTypes.string,
    description: PropTypes.string,
  })).isRequired,
  name: PropTypes.string.isRequired,
  imageType: PropTypes.oneOf(["EVENT", "CAMPUS", "DEPARTMENT"]).isRequired,
  year: PropTypes.number,
  collectionID: PropTypes.string,
  adminMode: PropTypes.bool,
}

export default FinalImagePagePresentation
