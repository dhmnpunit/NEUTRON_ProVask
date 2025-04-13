import 'dotenv/config';

export default {
  name: "ProVask",
  slug: "provask",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash-icon.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.provask.app"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.provask.app",
    permissions: ["INTERNET"]
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true
  },
  fonts: [
    "./assets/fonts/RethinkSans-Regular.ttf",
    "./assets/fonts/RethinkSans-Medium.ttf", 
    "./assets/fonts/RethinkSans-SemiBold.ttf",
    "./assets/fonts/RethinkSans-Bold.ttf"
  ],
  extra: {
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
    eas: {
      projectId: "your-project-id"
    }
  }
}; 