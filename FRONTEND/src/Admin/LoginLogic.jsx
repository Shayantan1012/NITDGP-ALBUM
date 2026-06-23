import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import BarLoader from "react-spinners/BarLoader"
import LoginPresentation from "./LoginPresentation"
import { Login } from "../Redux/Slices/AdminSlice"
import { useAppDispatch } from "../Redux/hooks"

function LoginLogic() {
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ regNo: "", password: "" })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  async function handelFormSubmit(event) {
    event.preventDefault()
    if (!loginData.regNo || !loginData.password) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await dispatch(Login(loginData)).unwrap()
      navigate("/admin", { replace: true })
    } catch {
      // The thunk displays the API error.
    } finally {
      setLoading(false)
    }
  }

  function handelUserInput(event) {
    const { name, value } = event.target
    setLoginData((current) => ({ ...current, [name]: value }))
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {loading ? (
        <BarLoader color="#000000" loading={loading} width={150} />
      ) : (
        <LoginPresentation
          handelFormSubmit={handelFormSubmit}
          handelUserInput={handelUserInput}
        />
      )}
    </div>
  )
}

export default LoginLogic
