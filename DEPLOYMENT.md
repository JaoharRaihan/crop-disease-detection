# Crop Disease Detection App - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

Your Expo React Native app is now ready for deployment to Vercel! Follow these steps:

### 1. Push to GitHub (or GitLab/Bitbucket)

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name your repository (e.g., `crop-disease-app`)
   - Keep it public or private as preferred
   - Don't initialize with README (we already have one)

2. Add the remote and push:
   ```bash
   cd /home/raihan/Desktop/crop/CropDiseaseApp
   git remote add origin https://github.com/YOUR_USERNAME/crop-disease-app.git
   git branch -M main
   git push -u origin main
   ```

### 2. Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to https://vercel.com
   - Sign up or login with GitHub

2. **Import Project:**
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it as an Expo project

3. **Configure Deployment:**
   - **Framework Preset:** Expo
   - **Build Command:** `npm run build:web` (already configured)
   - **Output Directory:** `dist` (already configured)
   - **Install Command:** `npm install` (already configured)

4. **Deploy:**
   - Click "Deploy"
   - Wait for the build to complete (~2-5 minutes)
   - Your app will be live at a Vercel URL (e.g., `your-app.vercel.app`)

### 3. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

## 📁 Project Structure

This app is configured as:
- **Framework:** Expo (React Native for Web)
- **Build Output:** Static files in `dist/` directory
- **Routes:** File-based routing with Expo Router
- **Deployment:** Static site deployment on Vercel

## 🔧 Configuration Files

### vercel.json
```json
{
  "buildCommand": "npm run build:web",
  "outputDirectory": "dist",
  "devCommand": "npm run web",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### package.json Scripts
- `build:web`: Exports the app for web deployment
- `web`: Starts the development server for web
- `build`: Same as build:web (Vercel default)

## 🛠️ Development

To run locally:
```bash
npm install
npm run web
```

To build for deployment:
```bash
npm run build:web
```

## 📱 Features

- **Crop Disease Detection:** AI-powered disease identification
- **Camera Integration:** Real-time image capture
- **Cross-Platform:** Works on web, iOS, and Android
- **Machine Learning:** ONNX model integration
- **Modern UI:** Beautiful, responsive interface

## 🔍 Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm install`
- Clear cache: `npx expo start --clear`
- Check Node.js version (recommended: 18+)

### Deployment Issues
- Verify `vercel.json` configuration
- Check build logs in Vercel dashboard
- Ensure `.gitignore` excludes `dist/` and `node_modules/`

### Runtime Errors
- Check browser console for errors
- Verify model files are accessible
- Test locally before deployment

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Test the build locally with `npm run build:web`
3. Review Expo documentation: https://docs.expo.dev/guides/expo-web/
4. Check Vercel documentation: https://vercel.com/docs

---

**Note:** This is a static web deployment. Some React Native features (like camera access) may have limitations in web browsers compared to native apps.
