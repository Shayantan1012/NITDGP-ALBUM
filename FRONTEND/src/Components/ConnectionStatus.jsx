import { useEffect, useState } from "react"
import axiosInstance from "../Helper/axiosInstance"

function ConnectionStatus() {
  const [status, setStatus] = useState("checking")

  useEffect(() => {
    let active = true
    const checkConnection = async () => {
      try {
        await axiosInstance.get("/health", { timeout: 5000 })
        if (active) setStatus("online")
      } catch {
        if (active) setStatus("offline")
      }
    }
    checkConnection()
    const timer = window.setInterval(checkConnection, 30000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])

  if (status !== "offline") return null

  return (
    <div className="connection-banner" role="alert">
      <span>Backend connection lost. Gallery data may be unavailable.</span>
      <button type="button" onClick={() => window.location.reload()}>Retry</button>
    </div>
  )
}

export default ConnectionStatus
