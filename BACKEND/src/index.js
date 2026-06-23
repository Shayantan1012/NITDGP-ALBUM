const app = require("./app")
const connectDatabase = require("./config/database")
const env = require("./config/env")

async function startServer() {
  try {
    await connectDatabase()
    const server = app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`)
    })

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${env.port} is already in use. Stop the existing server or set a different PORT in .env.`)
      } else {
        console.error("HTTP server failed", error)
      }
      process.exitCode = 1
    })
  } catch (error) {
    console.error("Server startup failed", error)
    process.exitCode = 1
  }
}

startServer()
