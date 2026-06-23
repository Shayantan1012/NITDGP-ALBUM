import { Navigate, useLocation } from "react-router-dom"
import FinalImagePagePresentation from "./FinalImagePage"

function FinalImagePageLogic() {
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
    />
  )
}

export default FinalImagePageLogic
