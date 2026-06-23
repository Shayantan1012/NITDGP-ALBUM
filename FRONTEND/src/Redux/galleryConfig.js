export const GALLERY_TYPES = {
  CAMPUS: "campus",
  EVENT: "event",
  DEPARTMENT: "department",
}

export const galleryConfig = {
  [GALLERY_TYPES.CAMPUS]: {
    publicPath: "/user/campus",
    adminPath: "/admin/campus",
    nameField: "placeName",
  },
  [GALLERY_TYPES.EVENT]: {
    publicPath: "/user/event",
    adminPath: "/admin/events",
    nameField: "eventName",
  },
  [GALLERY_TYPES.DEPARTMENT]: {
    publicPath: "/user/department",
    adminPath: "/admin/departments",
    nameField: "departmentName",
  },
}
