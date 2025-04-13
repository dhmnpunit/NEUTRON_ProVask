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
  ios: {
    supportsTablet: true
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    }
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
    // Access values from the .env file
    geminiApiKey: process.env.EXPO_PUBLIC_GEMINI_API_KEY || null,
    eas: {
      projectId: "your-project-id"
    }
  }
}; 