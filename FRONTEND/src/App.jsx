import { Navigate, Route, Routes } from 'react-router-dom'
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
import { fetchAboutSections } from './Redux/Slices/AboutSlice'
import AdminGuard from './Admin/AdminGuard'
import AdminLayout from './Admin/AdminLayout'
import AdminDashboard from './Admin/AdminDashboard'
import AdminGalleryPage from './Admin/AdminGalleryPage'
import AdminAboutPage from './Admin/AdminAboutPage'

function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    Object.values(GALLERY_TYPES).forEach((category) => {
      dispatch(fetchGallery(category))
    })
    dispatch(fetchAboutSections())
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
      <Route path="/admin/login" element={<LoginLogic />} />
      <Route path="/admin/register" element={<RegisterAdmin />} />
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="campus" element={
            <AdminGalleryPage
              category={GALLERY_TYPES.CAMPUS}
              imageType="CAMPUS"
              eyebrow="Collection manager"
              title="Manage campus collections"
              description="Create, review, and remove campus place collections."
              nameField="placeName"
            />
          } />
          <Route path="events" element={
            <AdminGalleryPage
              category={GALLERY_TYPES.EVENT}
              imageType="EVENT"
              eyebrow="Collection manager"
              title="Manage event collections"
              description="Manage events by year and maintain their photographs."
              nameField="eventName"
            />
          } />
          <Route path="departments" element={
            <AdminGalleryPage
              category={GALLERY_TYPES.DEPARTMENT}
              imageType="DEPARTMENT"
              eyebrow="Collection manager"
              title="Manage department collections"
              description="Maintain department albums and their photographs."
              nameField="departmentName"
            />
          } />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="collection" element={<FinalImagePageLogic adminMode />} />
          <Route path="upload" element={<ImageUpload />} />
        </Route>
      </Route>
      <Route path="/nitdgp/admin" element={<Navigate to="/admin/login" replace />} />
      <Route path="/nitdgp/admin/register" element={<Navigate to="/admin/register" replace />} />
      <Route path="/nitdgp/admin/adminRegistration" element={<Navigate to="/admin/register" replace />} />
      <Route path="/admin/imageUpload" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Home />} />
    </Routes>
    </>
  )
}

export default App
