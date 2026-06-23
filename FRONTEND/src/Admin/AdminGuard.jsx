import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../Redux/hooks"
import { selectIsAdmin } from "../Redux/Slices/AdminSlice"

function AdminGuard() {
  const isAdmin = useAppSelector(selectIsAdmin)
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default AdminGuard
