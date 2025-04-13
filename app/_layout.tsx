import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from 'expo-system-ui';
import * as NavigationBar from 'expo-navigation-bar';
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { useHealthStore } from '@/store/health-store';
import { useColorScheme } from 'react-native';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Set the system UI appearance
if (Platform.OS === 'android') {
  NavigationBar.setBackgroundColorAsync('#FFFFFF');
  NavigationBar.setButtonStyleAsync('dark');
}

// Auth state listener to handle navigation based on auth state
function AuthStateListener() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isFirstMount = useRef(true);

  // Handle deep navigation based on auth state
  useEffect(() => {
    // Skip navigation on first mount to avoid routing before layout is ready
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (!segments[0]) return;
    
    // Check if current segment is auth group
    const inAuthGroup = segments[0] === "auth";
    
    if (!user && !inAuthGroup) {
      // Redirect to login page
      router.replace({pathname: "/auth"} as any);
    } else if (user && inAuthGroup) {
      // Redirect to main app
      router.replace({pathname: "/"} as any);
    }
  }, [user, segments]);

  return null;
}

function RootLayoutNav() {
  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { checkStreak } = useHealthStore();

  const [loaded, error] = useFonts({
    ...FontAwesome.font,
    
    // RethinkSans fonts
    'RethinkSans-Regular': require('../assets/fonts/RethinkSans-Regular.ttf'),
    'RethinkSans-Medium': require('../assets/fonts/RethinkSans-Medium.ttf'),
    'RethinkSans-SemiBold': require('../assets/fonts/RethinkSans-SemiBold.ttf'),
    'RethinkSans-Bold': require('../assets/fonts/RethinkSans-Bold.ttf'),
  });

  useEffect(() => {
    if (error) {
      console.error("Font loading error:", error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Check streak status on app startup
  useEffect(() => {
    checkStreak();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor="transparent" translucent />
        <AuthStateListener />
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}
