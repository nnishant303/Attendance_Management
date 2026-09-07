# Frontend deploy (Netlify)

Full steps: see backend repo `DEPLOY.md`.

Quick settings:
- Repo: `nnishant303/Attendance_Management`
- Branch: `develop`
- Build: `npm run build`
- Publish: `dist`
- Env: `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api`

`netlify.toml` in this repo configures SPA redirects.
