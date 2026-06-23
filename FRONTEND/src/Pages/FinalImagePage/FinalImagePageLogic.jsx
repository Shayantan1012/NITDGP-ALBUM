import { Navigate, useLocation } from "react-router-dom"
import PropTypes from "prop-types"
import FinalImagePagePresentation from "./FinalImagePage"

function FinalImagePageLogic({ adminMode = false }) {
  const { state } = useLocation()
  if (!state || !Array.isArray(state.imageDetails)) {
    return <Navigate to="/" replace />
  }

  return (
    <FinalImagePagePresentation
      imageDetails={state.imageDetails}
      name={state.name || ""}
      imageType={state.imagetype}
      year={state.year}
      collectionID={state.collectionID}
      adminMode={adminMode}
    />
  )
}

FinalImagePageLogic.propTypes = {
  adminMode: PropTypes.bool,
}

export default FinalImagePageLogic
