import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@/constants/config';

interface AuthState {
    auth: string | null;
    isReady: boolean;
    onboardingCompleted: boolean | null;
    signIn: (email: string, password: string) => Promise<void>;
    signInWithGoogle: (idToken: string) => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    signOut: () => Promise<void>;
    initiate: () => Promise<void>;
    checkOnboarding: () => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
    auth: null,
    isReady: false,
    onboardingCompleted: null,

    signIn: async (email: string, password: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Login failed');
            }

            const data = await response.json();
            const token = data.access_token;

            await AsyncStorage.setItem('auth_token', token);
            set({ auth: token });
        } catch (error) {
            console.error('Sign in error:', error);
            throw error;
        }
    },

    signInWithGoogle: async (idToken: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_token: idToken }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Google login failed');
            }

            const data = await response.json();
            const token = data.access_token;

            await AsyncStorage.setItem('auth_token', token);
            set({ auth: token });
        } catch (error) {
            console.error('Google sign in error:', error);
            throw error;
        }
    },

    signUp: async (email: string, password: string, name?: string) => {
        try {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Signup failed');
            }

            const data = await response.json();
            const token = data.access_token;

            await AsyncStorage.setItem('auth_token', token);
            set({ auth: token });
        } catch (error) {
            console.error('Sign up error:', error);
            throw error;
        }
    },

    signOut: async () => {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('onboarding_completed');
        set({ auth: null, onboardingCompleted: null });
    },

    initiate: async () => {
        const token = await AsyncStorage.getItem('auth_token');
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        set({ 
            auth: token, 
            onboardingCompleted: onboardingCompleted === 'true',
            isReady: true 
        });
    },

    checkOnboarding: async () => {
        const onboardingCompleted = await AsyncStorage.getItem('onboarding_completed');
        set({ onboardingCompleted: onboardingCompleted === 'true' });
    },

    completeOnboarding: async () => {
        await AsyncStorage.setItem('onboarding_completed', 'true');
        set({ onboardingCompleted: true });
    },
}));
