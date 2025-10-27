# Render Environment Variables Setup

## Required Environment Variables for Render

Go to your Render Dashboard → Your Service → Environment → Add Environment Variable

### 1. GEMINI_API_KEY
- **Value**: `AIzaSyB4M-gY8BVfC_UsXWtD_54ZcCK3vkOSvpA`
- **Description**: Your Google Gemini API key

### 2. GEMINI_MODEL
- **Value**: `gemini-2.0-flash-exp`
- **Description**: The Gemini model to use
- **Options**: 
  - `gemini-2.0-flash-exp` (recommended - latest experimental)
  - `gemini-1.5-pro` (more capable, slower)
  - `gemini-1.5-flash-latest` (stable version)

### 3. NODE_ENV
- **Value**: `production`
- **Description**: Sets the environment mode

### 4. PORT (Optional)
- **Value**: Leave empty or `10000`
- **Description**: Render automatically sets this

## How to Update on Render

1. Go to https://dashboard.render.com/
2. Click on your `math-solver2` service
3. Click **Environment** in the left sidebar
4. Find `GEMINI_MODEL` variable
5. Click **Edit** 
6. Change value to: `gemini-2.0-flash-exp`
7. Click **Save Changes**
8. Service will automatically redeploy

## Important Notes

⚠️ **Model Name Changed**: 
- Old: `gemini-1.5-flash` (deprecated)
- New: `gemini-2.0-flash-exp` (current)

✅ **After updating**: Wait 2-3 minutes for Render to redeploy with the new model name.

## Testing

After deployment, test your backend:
```bash
curl https://math-solver2.onrender.com/health
```

Should return:
```json
{"status":"ok","ai":"available"}
```
