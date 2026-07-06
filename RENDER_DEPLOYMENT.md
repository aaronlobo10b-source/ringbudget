# Render.com deployment configuration for ringbudget

This project is set up to be deployed to Render using the `render.yaml` configuration file.

## Manual Deployment Steps

### 1. Create Account on Render
- Go to https://render.com and sign up
- Connect your GitHub account

### 2. Backend Deployment (FastAPI)
- Create a new Web Service
- Connect your GitHub repository (ringbudget)
- Set the root directory: (leave blank or specify `/`)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn budget_tracker.app.main:app --host 0.0.0.0 --port $PORT`
- Add Environment Variables:
  - `GOOGLE_API_KEY`: Your Google Gemini API key
  - `SUPABASE_URL`: Your Supabase project URL
  - `SUPABASE_PUBLISHABLE_KEY`: Your Supabase public key
  - `SUPABASE_KEY`: Your Supabase private key

### 3. Frontend Deployment (React)
- Create a new Static Site
- Connect your GitHub repository
- Build command: `cd frontend && npm install && npm run build`
- Publish directory: `frontend/dist`
- Add Environment Variable:
  - `VITE_API_URL`: https://your-ringbudget-api.onrender.com

### 4. Update Backend CORS
The backend CORS is already configured to accept origins matching `https?://(localhost|127\.0\.0\.1|.*\.onrender\.com)(:\d+)?`

This allows:
- Local development: http://localhost:5173, http://127.0.0.1:5173
- Production: https://your-frontend.onrender.com

## Important Notes

- The free tier on Render has limitations:
  - Services spin down after 15 minutes of inactivity
  - First load after spin-down may take 30+ seconds
  - Limited resources for concurrent requests

- For production use, consider upgrading to paid plans

- Ensure all environment variables are set in Render's dashboard before deploying

## Testing Deployed App

After deployment:
1. Visit the frontend URL
2. Verify the dashboard loads data
3. Test chat functionality
4. Check browser console for any CORS errors

If there are issues, check:
- Render logs for both services
- Environment variables are correctly set
- Backend service is running (not spun down)
