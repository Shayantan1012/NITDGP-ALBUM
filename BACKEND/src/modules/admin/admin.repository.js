const Admin = require("../../models/Admin")

const findByRegistration = (regNo, includePassword = false) => {
  const query = Admin.findOne({ regNo: regNo?.toUpperCase() })
  return includePassword ? query.select("+password") : query
}

const create = (details) => Admin.create(details)
const removeByRegistration = (regNo) => Admin.findOneAndDelete({ regNo: regNo?.toUpperCase() })

module.exports = { findByRegistration, create, removeByRegistration }
