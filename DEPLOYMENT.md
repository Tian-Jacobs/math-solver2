# Deployment Instructions

## Frontend (Vercel)

Your frontend is already deployed at: https://math-solver2.vercel.app/

To redeploy with the updated configuration:

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure production environment"
   git push
   ```

2. **Vercel will automatically redeploy** (if connected to your repo)
   - Or manually redeploy from the Vercel dashboard

3. **Environment Variable** (if not using vercel.json):
   - Go to Vercel Dashboard > Your Project > Settings > Environment Variables
   - Add: `REACT_APP_API_URL` = `https://math-solver2.onrender.com`
   - Redeploy

## Backend (Render)

Your backend is already deployed at: https://math-solver2.onrender.com

To redeploy with the updated CORS configuration:

1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Update CORS configuration"
   git push
   ```

2. **Render will automatically redeploy** (if auto-deploy is enabled)
   - Or manually redeploy from the Render dashboard

3. **Verify Environment Variables** in Render Dashboard:
   - `GEMINI_API_KEY` = Your API key
   - `GEMINI_MODEL` = `gemini-2.5-flash`
   - `NODE_ENV` = `production`
   - `PORT` = `10000` (or leave empty for Render default)

## Testing the Connection

1. Visit your frontend: https://math-solver2.vercel.app/
2. Check the connection status banner at the top
3. Try solving a math problem
4. Check browser console for any errors (F12)

## Troubleshooting

### If connection fails:

1. **Check Backend Health**:
   - Visit: https://math-solver2.onrender.com/health
   - Should return: `{"status":"ok","ai":"available"}`

2. **Check CORS in Browser Console**:
   - Look for CORS errors
   - Verify the origin is allowed in server logs

3. **Render Free Tier**:
   - Free tier spins down after inactivity
   - First request may take 30-60 seconds to wake up
   - Add a note to users about initial load time

4. **API Key Issues**:
   - Verify `GEMINI_API_KEY` is set in Render environment variables
   - Test the key with a direct API call

## Local Development

Backend:
```bash
npm start
```

Frontend:
```bash
cd frontend
npm start
```

The local setup will use `http://localhost:3000` for the backend automatically.
