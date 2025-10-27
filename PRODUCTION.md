# Production URLs

## Frontend
- **URL**: https://math-solver2.vercel.app/
- **Platform**: Vercel
- **Repository**: Connected to GitHub (auto-deploy on push)

## Backend
- **URL**: https://math-solver2.onrender.com
- **Platform**: Render
- **Repository**: Connected to GitHub (auto-deploy on push)

## Configuration Summary

### Frontend Environment Variables
- `REACT_APP_API_URL=https://math-solver2.onrender.com` (set in `.env.production`)

### Backend Environment Variables (Render)
- `GEMINI_API_KEY` = Your Gemini API key
- `GEMINI_MODEL` = `gemini-2.5-flash`
- `NODE_ENV` = `production`

### CORS Configuration
Backend allows requests from:
- `https://math-solver2.vercel.app` (production frontend)
- `http://localhost:3000`, `http://localhost:3001`, `http://localhost:3002` (local development)

## After Pushing Changes

1. **Commit and push**:
   ```bash
   git add .
   git commit -m "Configure production deployment"
   git push
   ```

2. **Both platforms will auto-deploy** (if configured)

3. **Test the connection**:
   - Visit https://math-solver2.vercel.app/
   - Check connection status
   - Try solving a problem

## Important Notes

⚠️ **Render Free Tier**: 
- Service spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Consider upgrading for better performance or using a cron job to keep it alive

✅ **To Keep Backend Alive** (optional):
Use a service like [UptimeRobot](https://uptimerobot.com/) or [Cron-job.org](https://cron-job.org/) to ping:
`https://math-solver2.onrender.com/health` every 10-14 minutes
