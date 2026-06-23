import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helper/axiosInstance"
import { getApiError } from "../apiError"

export const fetchAboutSections = createAsyncThunk(
  "about/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/about")
      return response.data?.data?.response || []
    } catch (error) {
      return rejectWithValue(getApiError(error, "Unable to load About content"))
    }
  },
)

export const createAboutSection = createAsyncThunk(
  "about/create",
  async (details, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/about", details)
      toast.success("About section created")
      return response.data?.data?.response
    } catch (error) {
      const payload = getApiError(error, "Unable to create About section")
      toast.error(payload.message)
      return rejectWithValue(payload)
    }
  },
)

export const updateAboutSection = createAsyncThunk(
  "about/update",
  async ({ id, details }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/about/${id}`, details)
      toast.success("About section updated")
      return response.data?.data?.response
    } catch (error) {
      const payload = getApiError(error, "Unable to update About section")
      toast.error(payload.message)
      return rejectWithValue(payload)
    }
  },
)

export const deleteAboutSection = createAsyncThunk(
  "about/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/about/${id}`)
      toast.success("About section deleted")
      return id
    } catch (error) {
      const payload = getApiError(error, "Unable to delete About section")
      toast.error(payload.message)
      return rejectWithValue(payload)
    }
  },
)

const aboutSlice = createSlice({
  name: "about",
  initialState: {
    sections: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutSections.pending, (state) => {
        state.status = "loading"
        state.error = null
      })
      .addCase(fetchAboutSections.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.sections = action.payload
      })
      .addCase(fetchAboutSections.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.payload?.message || action.error.message
      })
      .addCase(createAboutSection.fulfilled, (state, action) => {
        state.sections.push(action.payload)
        state.sections.sort((a, b) => a.order - b.order)
      })
      .addCase(updateAboutSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex((section) => section._id === action.payload._id)
        if (index >= 0) state.sections[index] = action.payload
        state.sections.sort((a, b) => a.order - b.order)
      })
      .addCase(deleteAboutSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((section) => section._id !== action.payload)
      })
  },
})

export const selectAboutSections = (state) => state.about.sections
export const selectAboutStatus = (state) => state.about.status

export default aboutSlice.reducer
