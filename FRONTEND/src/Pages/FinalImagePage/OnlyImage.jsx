import { Navigate, useLocation, useNavigate } from "react-router-dom"
import Header from "../../Layout/Header"

function OnlyImage() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const image = state?.ImageDetails

  if (!image?.imageURL) return <Navigate to="/" replace />

  return (
    <div className="app-shell image-viewer-page">
      <Header PageType="OnlyImage" />
      <main className="image-viewer">
        <button type="button" className="image-viewer__back" onClick={() => navigate(-1)}>← Back to collection</button>
        <figure>
          <img src={image.imageURL} alt={image.description || "Campus photograph"} />
          {image.description && <figcaption>{image.description}</figcaption>}
        </figure>
      </main>
    </div>
  )
}

export default OnlyImage
