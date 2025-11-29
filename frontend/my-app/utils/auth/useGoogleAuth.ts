import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useAuth } from './useAuth';

// Complete auth session for web browser
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Client IDs
// You need to create these in Google Cloud Console:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing
// 3. Enable Google+ API
// 4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
// 5. Create Web, Android, and iOS client IDs

// Replace these with your actual client IDs from Google Cloud Console
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
const IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';

export function useGoogleAuth() {
    const { signInWithGoogle } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: ANDROID_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        webClientId: WEB_CLIENT_ID,
    });

    const handleGoogleResponse = useCallback(async () => {
        if (response?.type === 'success') {
            setIsSigningIn(true);
            try {
                // Get the access token or id_token
                const { authentication } = response;
                
                if (authentication?.idToken) {
                    await signInWithGoogle(authentication.idToken);
                } else if (authentication?.accessToken) {
                    // If no id_token, fetch user info with access token
                    const userInfoResponse = await fetch(
                        'https://www.googleapis.com/userinfo/v2/me',
                        {
                            headers: { Authorization: `Bearer ${authentication.accessToken}` },
                        }
                    );
                    const userInfo = await userInfoResponse.json();
                    
                    // For this case, we need to handle it differently on the backend
                    // or use the access token verification
                    Alert.alert(
                        'Google Sign In',
                        `Welcome ${userInfo.name}! Please note: Full Google OAuth requires additional backend setup.`
                    );
                }
            } catch (error: any) {
                console.error('Google sign in error:', error);
                Alert.alert(
                    'Sign In Failed',
                    error.message || 'Failed to sign in with Google'
                );
            } finally {
                setIsSigningIn(false);
            }
        } else if (response?.type === 'error') {
            console.error('Google auth error:', response.error);
            Alert.alert(
                'Authentication Error',
                response.error?.message || 'Failed to authenticate with Google'
            );
        }
    }, [response, signInWithGoogle]);

    useEffect(() => {
        handleGoogleResponse();
    }, [handleGoogleResponse]);

    const signInWithGoogleAsync = async () => {
        if (!WEB_CLIENT_ID && !ANDROID_CLIENT_ID && !IOS_CLIENT_ID) {
            Alert.alert(
                'Google Sign-In Not Configured',
                'To enable Google Sign-In:\n\n' +
                '1. Go to Google Cloud Console\n' +
                '2. Create OAuth 2.0 credentials\n' +
                '3. Add client IDs to your .env file:\n' +
                '   - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID\n' +
                '   - EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID\n' +
                '   - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID',
                [{ text: 'OK' }]
            );
            return;
        }

        try {
            await promptAsync();
        } catch (error: any) {
            console.error('Google prompt error:', error);
            Alert.alert('Error', 'Failed to open Google sign in');
        }
    };

    return {
        signInWithGoogle: signInWithGoogleAsync,
        isLoading: !request || isSigningIn,
        isConfigured: !!(WEB_CLIENT_ID || ANDROID_CLIENT_ID || IOS_CLIENT_ID),
    };
}
