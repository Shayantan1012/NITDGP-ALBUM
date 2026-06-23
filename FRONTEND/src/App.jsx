import { Route, Routes } from 'react-router-dom'
import './App.css'
import Events from './Pages/Events/Events'
import Home from './Pages/Home'
import MyCampus from './Pages/Campus/MyCampus'
import Departments from './Pages/Departments/Deaprtment'
import FinalImagePageLogic from './Pages/FinalImagePage/FinalImagePageLogic'
import OnlyImage from './Pages/FinalImagePage/OnlyImage'
import LoginLogic from './Admin/LoginLogic'
import ImageUpload from './Admin/ImageUpload'
import AboutUs from './Pages/About'
import RegisterAdmin from './Admin/RegisterAdmin'
import { useEffect } from 'react'
import { useAppDispatch } from './Redux/hooks'
import { fetchGallery } from './Redux/Slices/GallerySlice'
import { GALLERY_TYPES } from './Redux/galleryConfig'
import ConnectionStatus from './Components/ConnectionStatus'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    Object.values(GALLERY_TYPES).forEach((category) => {
      dispatch(fetchGallery(category))
    })
  }, [dispatch])

  return (
    <>
    <ConnectionStatus />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/mycampus" element={<MyCampus />} />
      <Route path="/departments" element={<Departments />} />
      <Route path="/finalImage" element={<FinalImagePageLogic />} />
      <Route path="/onlyImage" element={<OnlyImage />} />
      <Route path="/aboutUs" element={<AboutUs />} />
      <Route path="/nitdgp/admin" element={<LoginLogic />} />
      <Route path="/nitdgp/admin/register" element={<RegisterAdmin />} />
      <Route path="/admin/imageUpload" element={<ImageUpload />} />
      <Route path="/nitdgp/admin/adminRegistration" element={<RegisterAdmin />} />
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App
