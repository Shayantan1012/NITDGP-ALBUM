import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helper/axiosInstance"
import { getApiError } from "../apiError"
import { loadSession } from "../sessionStorage"

export const Login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/admin/auth/login", data)
    toast.success("Successfully logged in")
    return response.data
  } catch (error) {
    const payload = getApiError(error, "Unable to log in")
    toast.error(payload.message)
    return rejectWithValue(payload)
  }
})

export const LogOut = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/admin/auth/logout")
    toast.success("Successfully logged out")
    return response.data
  } catch (error) {
    const payload = getApiError(error, "Unable to log out")
    toast.error(payload.message)
    return rejectWithValue(payload)
  }
})

export const createAccount = createAsyncThunk("auth/createAccount", async (data, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/nit-dgp/admin/", data)
    toast.success(response.data?.message || "Account created")
    return response.data
  } catch (error) {
    const payload = getApiError(error, "Unable to create account")
    toast.error(payload.message)
    return rejectWithValue(payload)
  }
})

const storedSession = loadSession()

const authSlice = createSlice({
  name: "auth",
  initialState: {
    ...storedSession,
    status: "idle",
    error: null,
  },
  reducers: {
    invalidateSession(state) {
      state.isLoggedIn = false
      state.role = "USER"
      state.user = {}
      state.status = "idle"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(Login.fulfilled, (state, action) => {
        const adminData = action.payload?.data?.response?.adminData || {}
        state.isLoggedIn = true
        state.role = adminData.role || "USER"
        state.user = adminData
        state.status = "succeeded"
      })
      .addCase(Login.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || action.error.message
      })
      .addCase(LogOut.fulfilled, (state) => {
        state.isLoggedIn = false
        state.role = "USER"
        state.user = {}
        state.status = "idle"
      })
  },
})

export const { invalidateSession } = authSlice.actions
export const selectAuth = (state) => state.auth
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectRole = (state) => state.auth.role
export const selectIsAdmin = (state) =>
  state.auth.isLoggedIn && state.auth.role === "ADMIN"

export default authSlice.reducer
