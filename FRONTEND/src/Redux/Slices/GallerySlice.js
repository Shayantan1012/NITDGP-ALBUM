import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helper/axiosInstance"
import { getApiError } from "../apiError"
import { galleryConfig, GALLERY_TYPES } from "../galleryConfig"

const createCollection = () => ({
  items: [],
  status: "idle",
  error: null,
})

const initialState = {
  [GALLERY_TYPES.CAMPUS]: createCollection(),
  [GALLERY_TYPES.EVENT]: createCollection(),
  [GALLERY_TYPES.DEPARTMENT]: createCollection(),
}

function configFor(category) {
  const config = galleryConfig[category]
  if (!config) throw new Error(`Unsupported gallery category: ${category}`)
  return config
}

export const fetchGallery = createAsyncThunk(
  "gallery/fetch",
  async (category, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(configFor(category).publicPath)
      return {
        category,
        items: response.data?.data?.response || [],
      }
    } catch (error) {
      return rejectWithValue({ category, ...getApiError(error, "Unable to load images") })
    }
  },
  {
    condition: (category, { getState }) => getState().gallery[category]?.status !== "loading",
  },
)

export const uploadGalleryImage = createAsyncThunk(
  "gallery/upload",
  async ({ category, formData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(configFor(category).adminPath, formData)
      toast.success("Image uploaded")
      dispatch(fetchGallery(category))
      return { category, data: response.data }
    } catch (error) {
      const payload = getApiError(error, "Unable to upload image")
      toast.error(payload.message)
      return rejectWithValue({ category, ...payload })
    }
  },
)

export const deleteGalleryImage = createAsyncThunk(
  "gallery/delete",
  async ({ category, name, objectID, year }, { rejectWithValue }) => {
    try {
      const query = year ? `?year=${encodeURIComponent(year)}` : ""
      const response = await axiosInstance.delete(
        `${configFor(category).adminPath}/${encodeURIComponent(name)}/${objectID}${query}`,
      )
      toast.success("Image removed")
      return { category, objectID, data: response.data }
    } catch (error) {
      const payload = getApiError(error, "Unable to remove image")
      toast.error(payload.message)
      return rejectWithValue({ category, ...payload })
    }
  },
)

export const renameGallery = createAsyncThunk(
  "gallery/rename",
  async ({ category, oldName, newName, year }, { dispatch, rejectWithValue }) => {
    try {
      const query = year ? `?year=${encodeURIComponent(year)}` : ""
      const response = await axiosInstance.post(
        `${configFor(category).adminPath}/${encodeURIComponent(oldName)}/${encodeURIComponent(newName)}${query}`,
      )
      toast.success("Name updated")
      dispatch(fetchGallery(category))
      return { category, oldName, newName, data: response.data }
    } catch (error) {
      const payload = getApiError(error, "Unable to update name")
      toast.error(payload.message)
      return rejectWithValue({ category, ...payload })
    }
  },
)

export const deleteGalleryCollection = createAsyncThunk(
  "gallery/deleteCollection",
  async ({ category, collectionID }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${configFor(category).adminPath}/collection/${collectionID}`,
      )
      toast.success("Collection deleted")
      return { category, collectionID, data: response.data }
    } catch (error) {
      const payload = getApiError(error, "Unable to delete collection")
      toast.error(payload.message)
      return rejectWithValue({ category, ...payload })
    }
  },
)

const gallerySlice = createSlice({
  name: "gallery",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state, action) => {
        const collection = state[action.meta.arg]
        collection.status = "loading"
        collection.error = null
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        const collection = state[action.payload.category]
        collection.items = Array.isArray(action.payload.items) ? action.payload.items : []
        collection.status = "succeeded"
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        const category = action.payload?.category || action.meta.arg
        const collection = state[category]
        if (!collection) return
        collection.status = "failed"
        collection.error = action.payload?.message || action.error.message
      })
      .addCase(deleteGalleryImage.fulfilled, (state, action) => {
        const collection = state[action.payload.category]
        collection.items.forEach((group) => {
          group.image = (group.image || []).filter(
            (image) => image._id !== action.payload.objectID,
          )
        })
      })
      .addCase(deleteGalleryCollection.fulfilled, (state, action) => {
        const collection = state[action.payload.category]
        collection.items = collection.items.filter(
          (item) => item._id !== action.payload.collectionID,
        )
      })
  },
})

export const selectGalleryItems = (category) => (state) =>
  state.gallery[category]?.items || []

export const selectGalleryStatus = (category) => (state) =>
  state.gallery[category]?.status || "idle"

export const selectAllGalleryItems = (state) =>
  Object.values(state.gallery).flatMap((collection) => collection.items)

export default gallerySlice.reducer
