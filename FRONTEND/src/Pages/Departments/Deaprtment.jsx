import GalleryPage from "../../Components/GalleryPage"
import { GALLERY_TYPES } from "../../Redux/galleryConfig"

function Departments() {
  return (
    <GalleryPage
      category={GALLERY_TYPES.DEPARTMENT}
      imageType="DEPARTMENT"
      eyebrow="Learning & making"
      title="Meet the departments"
      description="Discover the classrooms, laboratories, people, and projects behind each academic community."
      nameField="departmentName"
    />
  )
}

export default Departments
