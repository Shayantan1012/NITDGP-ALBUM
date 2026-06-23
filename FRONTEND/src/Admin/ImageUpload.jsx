import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import { useLocation, useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import ImageUploadPresentation from "./ImageUploadPresentation"
import { useAppDispatch, useAppSelector } from "../Redux/hooks"
import { GALLERY_TYPES, galleryConfig } from "../Redux/galleryConfig"
import { selectGalleryItems, uploadGalleryImage } from "../Redux/Slices/GallerySlice"
import { invalidateSession, selectIsLoggedIn } from "../Redux/Slices/AdminSlice"
import { isExpiredSession } from "../Redux/apiError"

const uploadActions = {
  EVENT: GALLERY_TYPES.EVENT,
  CAMPUS: GALLERY_TYPES.CAMPUS,
  DEPARTMENT: GALLERY_TYPES.DEPARTMENT,
}

function ImageUpload() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const eventCollections = useAppSelector(selectGalleryItems(GALLERY_TYPES.EVENT))
  const type = location.state?.imageType
  const existingName = location.state?.name
  const existingYear = location.state?.year
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [details, setDetails] = useState({
    ImageDescription: "",
    ImageName: "",
    EventYear: "",
  })
  const eventSuggestions = useMemo(() => {
    if (type !== "EVENT" || existingName) return []
    const search = details.ImageName.trim().toLowerCase()
    const selectedYear = Number(details.EventYear)
    return eventCollections
      .filter((event) => !selectedYear || event.year === selectedYear)
      .filter((event) => !search || event.eventName.toLowerCase().includes(search))
      .slice(0, 6)
  }, [details.EventYear, details.ImageName, eventCollections, existingName, type])

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please log in")
      navigate("/nitdgp/admin", { replace: true })
      return
    }
    if (!uploadActions[type]) {
      toast.error("Invalid upload type")
      navigate("/", { replace: true })
    }
  }, [isLoggedIn, navigate, type])

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview)
  }, [preview])

  function handelUserInput(event) {
    const { name, value } = event.target
    setDetails((current) => ({ ...current, [name]: value }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handelFormSubmit(event) {
    event.preventDefault()
    const category = uploadActions[type]
    const config = galleryConfig[category]
    const imageName = existingName || details.ImageName.trim()
    const eventYear = existingYear || details.EventYear

    if (!config || !imageName || !details.ImageDescription.trim() || !image) {
      toast.error("Please provide a name, description, and image")
      return
    }
    if (type === "EVENT" && !existingName && !eventYear) {
      toast.error("Please provide the event year")
      return
    }

    const formData = new FormData()
    formData.append(config.nameField, imageName)
    formData.append("description", details.ImageDescription.trim())
    if (type === "EVENT" && eventYear) formData.append("year", eventYear)
    formData.append("imageURL", image)

    setLoading(true)
    try {
      await dispatch(uploadGalleryImage({ category, formData })).unwrap()
      navigate(-1)
    } catch (error) {
      if (isExpiredSession(error)) {
        dispatch(invalidateSession())
        navigate("/nitdgp/admin", { replace: true })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {loading ? (
        <BarLoader color="#000000" loading={loading} width={150} />
      ) : (
        <ImageUploadPresentation
          handelFormSubmit={handelFormSubmit}
          handelUserInput={handelUserInput}
          handleImageChange={handleImageChange}
          preViewImage={preview}
          type={type}
          name={existingName}
          year={existingYear}
          imageName={details.ImageName}
          eventSuggestions={eventSuggestions}
          onSuggestionSelect={(eventName) => {
            setDetails((current) => ({ ...current, ImageName: eventName }))
          }}
        />
      )}
    </div>
  )
}

export default ImageUpload
