# 🚗 Hitchr Project Setup Commands

# 1. Create main project directory
mkdir hitchr-app
cd hitchr-app

# 2. Initialize Expo project
npx create-expo-app@latest . --template blank

# 3. Create complete directory structure
mkdir -p src/config
mkdir -p src/contexts
mkdir -p src/navigation
mkdir -p src/screens/auth
mkdir -p src/screens/main
mkdir -p src/store/slices
mkdir -p assets/images
mkdir -p assets/fonts

# 4. Create all the main files (you'll copy content from artifacts)

# Root files
touch .env.example
touch .gitignore
touch babel.config.js
touch README.md

# Config files
touch src/config/firebase.config.js

# Context files
touch src/contexts/AuthContext.js

# Navigation files
touch src/navigation/AppNavigator.js
touch src/navigation/AuthNavigator.js
touch src/navigation/MainTabNavigator.js

# Screen files
touch src/screens/LoadingScreen.js
touch src/screens/auth/OnboardingScreen.js
touch src/screens/auth/LoginScreen.js
touch src/screens/auth/SignUpScreen.js
touch src/screens/main/HomeScreen.js
touch src/screens/main/MapScreen.js
touch src/screens/main/TokensScreen.js
touch src/screens/main/SocialScreen.js
touch src/screens/main/ProfileScreen.js

# Store files
touch src/store/store.js
touch src/store/slices/ridesSlice.js
touch src/store/slices/tokensSlice.js
touch src/store/slices/socialSlice.js

# 5. Install all required dependencies
npm install expo@~49.0.15
npm install expo-status-bar@~1.6.0
npm install expo-linear-gradient@~12.3.0
npm install expo-blur@~12.4.1
npm install expo-font@~11.4.0
npm install expo-splash-screen@~0.20.5
npm install expo-location@~16.1.0
npm install expo-camera@~13.4.4
npm install expo-image-picker@~14.3.2
npm install expo-notifications@~0.20.1
npm install react@18.2.0
npm install react-native@0.72.6
npm install @react-navigation/native@^6.1.9
npm install @react-navigation/stack@^6.3.20
npm install @react-navigation/bottom-tabs@^6.5.11
npm install @react-navigation/drawer@^6.6.6
npm install react-native-screens@~3.22.0
npm install react-native-safe-area-context@4.6.3
npm install react-native-gesture-handler@~2.12.0
npm install react-native-reanimated@~3.3.0
npm install react-native-maps@1.7.1
npm install react-native-elements@^3.4.3
npm install react-native-vector-icons@^10.0.2
npm install @react-native-async-storage/async-storage@1.18.2
npm install firebase@^10.7.1
npm install @reduxjs/toolkit@^1.9.7
npm install react-redux@^8.1.3
npm install lottie-react-native@6.0.1
npm install react-native-paper@^5.11.6
npm install react-native-animatable@^1.3.3

# 6. Install development dependencies
npm install --save-dev @babel/core@^7.20.0

# 7. For iOS (Mac users only)
# cd ios && pod install && cd ..

# 8. Create environment file
cp .env.example .env

echo "✅ Directory structure created!"
echo "📁 Project structure:"
tree -I 'node_modules'

echo ""
echo "🔥 NEXT STEPS:"
echo "1. Copy all file contents from the artifacts into respective files"
echo "2. Update .env with your Firebase and Google Maps keys"
echo "3. Update src/config/firebase.config.js with your Firebase config"
echo "4. Run 'npm start' to launch the app"
echo ""
echo "🚀 Your Hitchr app will be ready to run!"