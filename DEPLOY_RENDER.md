# Deploy ringbudget to Render - Quick Start

This guide walks you through deploying the ringbudget application (FastAPI backend + React frontend) to Render.

## Prerequisites

- ✅ GitHub account with your ringbudget repository pushed
- ✅ Render account (create at https://render.com)
- ✅ Google Gemini API key (get from https://aistudio.google.com/app/apikey)
- ✅ Supabase credentials (from your Supabase project)

## Step 1: Connect GitHub to Render

1. Go to https://render.com and sign in
2. Click "New +" → "Web Service"
3. Select "Build and deploy from a Git repository"
4. Connect your GitHub account and select the `ringbudget` repository
5. Click "Connect"

## Step 2: Deploy Backend (FastAPI API)

### Create Web Service

1. **Service Name**: `ringbudget-api`
2. **Environment**: Python 3
3. **Region**: Choose closest to you (or `oregon` for US)
4. **Branch**: `main` (or your default branch)
5. **Build Command**: 
   ```
   pip install -r requirements.txt
   ```
6. **Start Command**:
   ```
   uvicorn budget_tracker.app.main:app --host 0.0.0.0 --port $PORT
   ```
7. **Plan**: Free (or upgrade for better performance)

### Add Environment Variables

Click "Advanced" and add these environment variables:

| Variable Name | Value |
|---|---|
| `GOOGLE_API_KEY` | Your Google Gemini API key |
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xxxxx.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Your Supabase public key |
| `SUPABASE_KEY` | Your Supabase private key |
| `PYTHON_VERSION` | `3.13.7` |

9. Click "Create Web Service"
10. Wait for deployment (2-5 minutes)
11. Copy the service URL (e.g., `https://ringbudget-api.onrender.com`)

## Step 3: Deploy Frontend (React)

1. Go back to Render dashboard
2. Click "New +" → "Static Site"
3. Connect the same GitHub repository (if not already connected)
4. 
   - **Service Name**: `ringbudget-frontend`
   - **Branch**: `main`
   - **Build Command**:
     ```
     cd frontend && npm install && npm run build
     ```
   - **Publish directory**: `frontend/dist`

### Add Environment Variables

Click "Advanced" and add:

| Variable Name | Value |
|---|---|
| `VITE_API_URL` | `https://ringbudget-api.onrender.com` (use the URL from Step 2) |

5. Click "Create Static Site"
6. Wait for deployment (2-3 minutes)
7. Copy the site URL (e.g., `https://ringbudget-frontend.onrender.com`)

## Step 4: Update Backend CORS (if needed)

The backend is already configured to accept Render domains. If you changed the service names, update [budget_tracker/app/main.py](../budget_tracker/app/main.py) line with the CORS regex if needed. Otherwise, it's already set to accept any `*.onrender.com` domain.

## Step 5: Test the Deployment

1. Go to your frontend URL: `https://ringbudget-frontend.onrender.com`
2. The dashboard should load with your budget data
3. Test the chat functionality
4. Open browser DevTools (F12) to check for errors

## Troubleshooting

### "Cannot reach backend" or "CORS error"

1. Check the backend service is running:
   - Go to Render dashboard → ringbudget-api
   - Scroll to "Logs" and look for "Uvicorn running on..."
   - If it shows "Build failed", check the build logs for errors

2. Verify environment variables are set:
   - Render dashboard → ringbudget-api → Environment
   - Ensure `GOOGLE_API_KEY`, `SUPABASE_URL`, etc. are all filled in

3. Check the frontend is pointing to correct API:
   - Browser DevTools → Console
   - Should show API calls to `https://ringbudget-api.onrender.com`

### "Build failed" on frontend

1. Check frontend build logs:
   - Render dashboard → ringbudget-frontend → Logs
   - Look for the error message
   
2. Common issues:
   - Missing dependencies: Run `npm install` locally and commit `package-lock.json`
   - Environment variable syntax: Check `VITE_API_URL` is correct

### Service keeps spinning down / slow first load

This is normal on Render's free tier. Services spin down after 15 minutes of inactivity. Upgrade to paid tier for always-on service.

## Next Steps

### Production Improvements

1. **Add a custom domain**:
   - Render → Static Site Settings → Custom Domain
   - Point your domain's DNS records to Render

2. **Enable auto-deploys**:
   - Both services auto-deploy on git push by default ✅

3. **Set up monitoring**:
   - Use Render's built-in logs for debugging
   - Consider adding error tracking (Sentry, LogRocket, etc.)

4. **Upgrade performance**:
   - Use paid tier to avoid service spin-downs
   - Add database backups for Supabase

5. **Secure environment variables**:
   - Never commit `.env` files
   - Use Render's encrypted environment variables (already set up)

## Cost Estimate

- **Free Tier**: $0/month
  - 0.5 CPU / 512 MB RAM per service
  - Services spin down after 15 min inactivity
  - Limited to 1 frontend static site, 1 backend service

- **Starter Plan**: $7/month per service
  - 1 CPU / 1 GB RAM
  - Always-on
  - Better for production use

## Support

If you run into issues:
1. Check Render logs in dashboard
2. Verify environment variables are set
3. Ensure GitHub repository is up to date
4. Test locally first with `npm run dev` and `uvicorn budget_tracker.app.main:app`

---

**Deployment Complete!** 🚀

Your ringbudget app is now live on Render and accessible to the world!
