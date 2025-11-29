
import { useAuth } from "@/utils/auth/useAuth";
import { AuthModal } from "@/utils/auth/useAuthModal";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootLayoutNav() {
  const { auth, isReady, onboardingCompleted } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const currentSegment = segments[0];
    const inAuthGroup = currentSegment === 'auth';
    const inOnboarding = currentSegment === 'onboarding';
    const inTabs = currentSegment === '(tabs)';
    const isLandingPage = !currentSegment || currentSegment === 'index';

    if (!auth) {
      // Not authenticated - must go to landing page from any protected area
      if (inTabs || inOnboarding) {
        router.replace('/');
      }
    } else {
      // Authenticated
      if (onboardingCompleted === false) {
        // Not onboarded - redirect to onboarding
        if (!inOnboarding) {
          router.replace('/onboarding');
        }
      } else if (onboardingCompleted === true) {
        // Onboarded - redirect to tabs if on landing or auth pages
        if (isLandingPage || inAuthGroup) {
          router.replace('/(tabs)');
        }
      }
    }
  }, [auth, isReady, onboardingCompleted, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const { initiate, isReady } = useAuth();

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
          <AuthModal />
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
