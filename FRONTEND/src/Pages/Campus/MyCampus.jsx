import GalleryPage from "../../Components/GalleryPage"
import { GALLERY_TYPES } from "../../Redux/galleryConfig"

function MyCampus() {
  return (
    <GalleryPage
      category={GALLERY_TYPES.CAMPUS}
      imageType="CAMPUS"
      eyebrow="Places & spaces"
      title="Explore the campus"
      description="Walk through the landmarks, quiet corners, and everyday spaces that shape life at NIT Durgapur."
      nameField="placeName"
    />
  )
}

export default MyCampus
