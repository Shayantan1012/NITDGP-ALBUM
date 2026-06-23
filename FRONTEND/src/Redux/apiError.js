export function getApiError(error, fallback = "Something went wrong") {
  const data = error.response?.data
  return {
    ...(data && typeof data === "object" ? data : {}),
    message: data?.message || data?.massage || error.message || fallback,
    status: error.response?.status,
  }
}

export function isExpiredSession(error) {
  return error?.error?.name === "TokenExpiredError" || error?.name === "TokenExpiredError"
}
