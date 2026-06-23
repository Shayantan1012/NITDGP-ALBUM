# Campus Chronicles API

## Structure

```text
src/
  config/       Environment, MongoDB, and Cloudinary configuration
  middleware/   Authentication, uploads, and error handling
  models/       Mongoose schemas
  modules/
    admin/      Administrator account feature
    auth/       Login and logout feature
    gallery/    Shared campus, event, and department gallery feature
  routes/       Application route composition
  utils/        Reusable errors, async handlers, and responses
  app.js        Express application
  index.js      Database connection and HTTP server startup
```

## Commands

```bash
npm run dev
npm start
npm run check
```

Copy `.env.example` to `.env` and provide the required credentials before starting.
