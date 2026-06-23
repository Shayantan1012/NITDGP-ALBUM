const defaultSession = {
  isLoggedIn: false,
  role: "USER",
  user: {},
}

export function loadSession() {
  try {
    return {
      isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
      role: localStorage.getItem("role") || "USER",
      user: JSON.parse(localStorage.getItem("data")) || {},
    }
  } catch {
    return defaultSession
  }
}

export function saveSession(session) {
  localStorage.setItem("isLoggedIn", String(session.isLoggedIn))
  localStorage.setItem("role", session.role)
  localStorage.setItem("data", JSON.stringify(session.user))
}

export function clearSession() {
  saveSession(defaultSession)
}
