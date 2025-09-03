# 📝 File Content Copy Guide

After running the directory setup commands, copy the content from each artifact into the corresponding file:

## 📦 Root Files

### `package.json`
```bash
# Replace the entire content with the package.json artifact
```

### `app.json`
```bash
# Replace with app.json artifact content
```

### `App.js`
```bash
# Replace with App.js artifact content
```

### `babel.config.js`
```bash
# Copy babel.config.js artifact content
```

### `.env.example`
```bash
# Copy .env.example artifact content
```

### `.gitignore`
```bash
# Copy .gitignore artifact content
```

### `README.md`
```bash
# Copy README.md artifact content
```

## 🔧 Source Files

### Config
```bash
# src/config/firebase.config.js
# Copy from firebase_config artifact
```

### Context
```bash
# src/contexts/AuthContext.js
# Copy from auth_context artifact
```

### Navigation
```bash
# src/navigation/AppNavigator.js
# Copy from app_navigator artifact

# src/navigation/AuthNavigator.js  
# Copy from auth_navigator artifact

# src/navigation/MainTabNavigator.js
# Copy from main_tab_navigator artifact
```

### Screens
```bash
# src/screens/LoadingScreen.js
# Copy from loading_screen artifact

# src/screens/auth/OnboardingScreen.js
# Copy from onboarding_screen artifact

# src/screens/auth/LoginScreen.js
# Copy from login_screen artifact

# src/screens/auth/SignUpScreen.js
# Copy from signup_screen artifact

# src/screens/main/HomeScreen.js
# Copy from home_screen artifact

# src/screens/main/MapScreen.js
# Copy from map_screen artifact

# src/screens/main/TokensScreen.js
# Copy from tokens_screen artifact

# src/screens/main/SocialScreen.js
# Copy from social_screen artifact

# src/screens/main/ProfileScreen.js
# Copy from profile_screen artifact
```

### Store/Redux
```bash
# src/store/store.js
# Copy from store_config artifact

# src/store/slices/ridesSlice.js
# Copy from rides_slice artifact

# src/store/slices/tokensSlice.js
# Copy from tokens_slice artifact

# src/store/slices/socialSlice.js
# Copy from social_slice artifact
```

## 🎯 Quick Setup Script

Here's a complete script to set everything up at once:

```bash
#!/bin/bash

# Run this after creating the directory structure and copying all files

echo "🔥 Setting up Hitchr App..."

# Copy environment file
cp .env.example .env

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup iOS (Mac only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Setting up iOS dependencies..."
    cd ios && pod install && cd ..
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🔧 IMPORTANT: Update these files with your keys:"
echo "1. .env - Add your Firebase and Google Maps API keys"
echo "2. src/config/firebase.config.js - Add your Firebase config"
echo ""
echo "🚀 Then run: npm start"
echo ""
echo "🎉 Your Hitchr app will be ready!"
```

## 📋 Checklist

- [ ] Created directory structure
- [ ] Installed all dependencies  
- [ ] Copied all 20+ file contents from artifacts
- [ ] Updated .env with API keys
- [ ] Updated Firebase config
- [ ] Tested with `npm start`

## 🔑 Required API Keys

1. **Firebase Config** (from Firebase Console):
   - API Key
   - Auth Domain  
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

2. **Google Maps API Key** (from Google Cloud Console):
   - Enable Maps SDK for Android/iOS
   - Generate API key
   - Add to app.json

Your app will be **100% functional** once these steps are complete! 🚗✨