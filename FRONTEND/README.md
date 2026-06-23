# Campus Chronicles Frontend

## Deploy to Vercel

Use these project settings:

- Root Directory: `FRONTEND`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

Add this environment variable:

```env
VITE_BACKEND_URL=https://your-deployed-backend.example.com
```

The included `vercel.json` sends browser routes such as `/events` and
`/admin/login` to `index.html` so React Router can handle them.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
