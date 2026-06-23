import PropTypes from "prop-types"
import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../Redux/hooks"
import { renameGallery } from "../Redux/Slices/GallerySlice"
import { GALLERY_TYPES } from "../Redux/galleryConfig"
import { invalidateSession } from "../Redux/Slices/AdminSlice"
import { isExpiredSession } from "../Redux/apiError"

const changeActions = {
  EVENT: GALLERY_TYPES.EVENT,
  CAMPUS: GALLERY_TYPES.CAMPUS,
  DEPARTMENT: GALLERY_TYPES.DEPARTMENT,
}

function PopUp({ eventName, imageType, year, onClose }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [newName, setNewName] = useState("")

  async function handelChangeName() {
    const trimmedName = newName.trim()
    if (!trimmedName) {
      toast.error("Please enter a name")
      return
    }
    const category = changeActions[imageType]
    if (!category) {
      toast.error("Invalid image category")
      return
    }
    try {
      await dispatch(renameGallery({
        category,
        oldName: eventName,
        newName: trimmedName,
        year,
      })).unwrap()
      onClose()
      navigate("/", { replace: true })
    } catch (error) {
      if (isExpiredSession(error)) {
        dispatch(invalidateSession())
        navigate("/admin/login", { replace: true })
      }
    }
  }

  return (
    <div className="merienda-font3 flex flex-col items-start text-md">
      <h1 className="mb-2 text-slate-100">Enter the new name</h1>
      <input
        type="text"
        placeholder="Give a suitable name"
        name="newName"
        value={newName}
        onChange={(event) => setNewName(event.target.value)}
        className="mr-2 h-[30px] rounded-md"
      />
      <div className="mt-1 flex flex-row justify-between rounded-lg bg-yellow-300 p-1 shadow-md">
        <button type="button" onClick={handelChangeName} className="ml-1">Enter</button>
        <button type="button" onClick={onClose} className="mr-1">Cancel</button>
      </div>
    </div>
  )
}

PopUp.propTypes = {
  eventName: PropTypes.string.isRequired,
  imageType: PropTypes.oneOf(["EVENT", "CAMPUS", "DEPARTMENT"]).isRequired,
  year: PropTypes.number,
  onClose: PropTypes.func.isRequired,
}

export default PopUp
