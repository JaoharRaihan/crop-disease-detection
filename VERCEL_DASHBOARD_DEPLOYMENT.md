# 🎯 Deploy to Vercel via Dashboard

Since the Vercel CLI is experiencing issues, follow these steps to deploy via the Vercel Dashboard:

## 📋 Prerequisites ✅
- GitHub repository: `https://github.com/JaoharRaihan/crop-disease-detection`
- Vercel account connected to GitHub
- All files committed and pushed

## 🚀 Deployment Steps

### 1. Access Vercel Dashboard
1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Sign in with your GitHub account if not already signed in

### 2. Import Project
1. Click **"Add New..."** → **"Project"**
2. In the "Import Git Repository" section, find your repository:
   - `JaoharRaihan/crop-disease-detection`
3. Click **"Import"** next to your repository

### 3. Configure Project
1. **Project Name**: Leave as `crop-disease-detection` or customize
2. **Framework Preset**: Should auto-detect as "Other" (correct)
3. **Root Directory**: Leave as `./` (default)
4. **Build Settings**:
   - **Build Command**: `npm run build:web`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 4. Environment Variables (if any)
- No environment variables needed for this project
- Skip this section

### 5. Deploy
1. Click **"Deploy"**
2. Wait for deployment to complete (usually 2-3 minutes)
3. Once complete, you'll get a live URL like: `https://crop-disease-detection-xyz.vercel.app`

## 🎉 Post-Deployment

### Verify Deployment
1. Click on the deployment URL
2. Test navigation between pages
3. Verify the crop disease detection functionality works

### Custom Domain (Optional)
1. Go to project settings
2. Add a custom domain if desired
3. Follow Vercel's domain verification steps

## 📁 Project Configuration Files

The following files are already configured for Vercel:

### `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### `package.json` Build Scripts
```json
{
  "scripts": {
    "build:web": "expo export --platform web"
  }
}
```

## 🔧 If Issues Arise

### Build Fails
1. Check the build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify the build command is correct

### Routing Issues
1. Check that `vercel.json` routes are configured correctly
2. Ensure Expo Router is set up properly

### Assets Not Loading
1. Verify assets are in the `dist` folder after build
2. Check asset paths in the build output

## 📞 Support

If you encounter any issues:
1. Check Vercel's documentation: [https://vercel.com/docs](https://vercel.com/docs)
2. Review the build logs in the Vercel dashboard
3. Ensure all configuration files match this guide

---

🎯 **Goal**: Get your Crop Disease Detection App live on Vercel at a URL like:
`https://crop-disease-detection.vercel.app`
