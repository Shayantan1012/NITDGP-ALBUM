import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import AuthReducer, {
  invalidateSession,
  Login,
  LogOut,
} from './Slices/AdminSlice'
import GalleryReducer from './Slices/GallerySlice'
import { clearSession, saveSession } from './sessionStorage'

const sessionListener = createListenerMiddleware()

sessionListener.startListening({
  matcher: (action) =>
    Login.fulfilled.match(action) ||
    LogOut.fulfilled.match(action) ||
    invalidateSession.match(action),
  effect: (_, listenerApi) => {
    const auth = listenerApi.getState().auth
    if (auth.isLoggedIn) {
      saveSession(auth)
    } else {
      clearSession()
    }
  },
})

export const store = configureStore({
  reducer: {
    auth: AuthReducer,
    gallery: GalleryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(sessionListener.middleware),
  devTools: import.meta.env.DEV,
})

export default store
