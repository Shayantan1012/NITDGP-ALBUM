import PropTypes from "prop-types"
import GalleryPage from "../Components/GalleryPage"

function AdminGalleryPage(props) {
  return <GalleryPage {...props} adminMode />
}

AdminGalleryPage.propTypes = {
  category: PropTypes.string.isRequired,
  imageType: PropTypes.oneOf(["CAMPUS", "EVENT", "DEPARTMENT"]).isRequired,
  title: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  nameField: PropTypes.string.isRequired,
}

export default AdminGalleryPage
