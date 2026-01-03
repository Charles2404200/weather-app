# Railway Deployment Guide

## For Backend Only (FastAPI)

### Step 1: Create a new Railway project
1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Select this repository

### Step 2: Configure Railway
Railway should automatically detect Python project. If not:

**Build Command:**
```bash
pip install -r backend/requirements.txt
```

**Start Command:**
```bash
cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Step 3: Environment Variables
Add these in Railway dashboard:
```
PYTHONUNBUFFERED=1
PORT=8000
```

### Step 4: Deploy
Push to main branch or click "Deploy" in Railway dashboard.

Backend will be live at: `https://your-project.up.railway.app`

---

## For Frontend (Next.js) - Separate Project

### Step 1: Create separate Railway project for frontend
1. Same as above but point to your repo
2. Point to `/frontend` directory

### Step 2: Configure Frontend
**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm start
```

### Step 3: Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
```

### Step 4: Deploy
Frontend will be live at: `https://your-frontend.up.railway.app`

---

## Troubleshooting

### Error: "railpack process exited with an error"
**Fix:** Make sure Procfile and railway.json are in root directory.

### Error: "Cannot find module 'fastapi'"
**Fix:** Check `requirements.txt` is properly formatted and no blank lines at end.

### Error: "ModuleNotFoundError: No module named 'app'"
**Fix:** Make sure working directory is `/backend` in Procfile:
```
web: cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Port binding error
**Fix:** Use `$PORT` environment variable (Railway assigns dynamically):
```
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### CORS issues with frontend
**Fix:** Update backend CORS settings if frontend is on different domain:
- Backend: `app/core/config.py` → Update `CORS_ORIGINS`
- Or update `NEXT_PUBLIC_API_URL` in frontend `.env`

---

## Quick Deploy Checklist

- [ ] `Procfile` exists in root with correct start command
- [ ] `railway.json` exists (optional but recommended)
- [ ] `backend/requirements.txt` has all dependencies
- [ ] No syntax errors in Python files
- [ ] Environment variables set in Railway dashboard
- [ ] Git repo is up to date and pushed

That's it! 🚀
