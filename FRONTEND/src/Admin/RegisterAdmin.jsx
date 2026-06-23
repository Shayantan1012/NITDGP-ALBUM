import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import BounceLoader from "react-spinners/BounceLoader"
import RegisterAdminPresentation from "./RegisterAdminPresentation"
import { createAccount } from "../Redux/Slices/AdminSlice"
import { useAppDispatch } from "../Redux/hooks"

function RegisterAdmin() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)
  const [signUpState, setSignUpState] = useState({
    firstName: "", lastName: "", mobileNumber: "", CurrentYear: "",
    Roll: "", Reg: "", email: "", password: "",
  })

  function handelUserInput(event) {
    const { name, value } = event.target
    setSignUpState((current) => ({ ...current, [name]: value }))
  }

  async function handelFormSubmit(event) {
    event.preventDefault()
    if (Object.values(signUpState).some((value) => !value.trim())) {
      toast.error("Please fill in all fields")
      return
    }
    if (!/^\d{10}$/.test(signUpState.mobileNumber)) {
      toast.error("Please enter a valid 10-digit mobile number")
      return
    }
    if (!signUpState.email.includes("@") || !signUpState.email.toLowerCase().includes("nitdgp")) {
      toast.error("Please enter a valid NIT Durgapur email")
      return
    }

    setLoading(true)
    try {
      await dispatch(createAccount(signUpState)).unwrap()
      navigate("/nitdgp/admin")
    } catch {
      // The thunk displays the API error.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      {loading ? (
        <BounceLoader color="#000000" loading={loading} size={150} />
      ) : (
        <div className="w-full">
          <RegisterAdminPresentation
            handelUserInput={handelUserInput}
            handelFormSubmit={handelFormSubmit}
          />
        </div>
      )}
    </div>
  )
}

export default RegisterAdmin
