import GalleryPage from "../../Components/GalleryPage"
import { GALLERY_TYPES } from "../../Redux/galleryConfig"

function Events() {
  return (
    <GalleryPage
      category={GALLERY_TYPES.EVENT}
      imageType="EVENT"
      eyebrow="Moments together"
      title="Events worth remembering"
      description="Relive the festivals, competitions, celebrations, and small moments that brought the campus together."
      nameField="eventName"
    />
  )
}

export default Events
