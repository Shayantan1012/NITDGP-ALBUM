function sendSuccess(res, { status = 200, message = "Success", data = {} } = {}) {
  return res.status(status).json({
    success: true,
    message,
    massage: message,
    error: {},
    data,
  })
}

module.exports = { sendSuccess }
