import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withDelay,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/utils/auth/useAuth';
import { useGoogleAuth } from '@/utils/auth/useGoogleAuth';

const { width, height } = Dimensions.get('window');

const FloatingTag = ({ label, color, rotate, top, left, delay, scale = 1 }: any) => {
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    useEffect(() => {
        translateY.value = withDelay(delay, withSpring(0, { damping: 12 }));
        opacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { rotate: `${rotate}deg` },
            { scale }
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.tag,
                { backgroundColor: color, top, left },
                animatedStyle
            ]}
        >
            <Text style={styles.tagText}>{label}</Text>
        </Animated.View>
    );
};

export default function LandingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { auth } = useAuth();
    const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

    // Routing guard will handle navigation based on auth and onboarding status
    // No need to redirect here as _layout.tsx handles it

    const handleGoogleLogin = async () => {
        await signInWithGoogle();
    };

    const handleEmailLogin = () => {
        router.push('/auth/login');
    };

    const handleCreateAccount = () => {
        router.push('/auth/signup');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.contentContainer}>
                {/* Logo Area */}
                <View style={[styles.logoContainer, { marginTop: insets.top + 20 }]}>
                    <View style={styles.logoBadge}>
                        <Text style={styles.logoText}>GrowEasy</Text>
                    </View>
                </View>

                {/* Floating Tags */}
                <View style={styles.tagsContainer}>
                    <FloatingTag label="Shopping" color="#FF6B4A" rotate={-15} top={40} left={20} delay={100} />
                    <FloatingTag label="Meeting" color="#FFC107" rotate={5} top={100} left={40} delay={300} />
                    <FloatingTag label="Birthday" color="#8BC34A" rotate={15} top={60} right={-20} delay={500} />
                    <FloatingTag label="Holiday" color="#2196F3" rotate={-5} top={160} left={-10} delay={700} />
                    <FloatingTag label="To do List" color="#FF5722" rotate={10} top={150} right={30} delay={900} />
                </View>

                {/* Main Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.headline}>
                        Weave Your{'\n'}Time, Design{'\n'}Your Destiny.
                    </Text>
                </View>

                {/* Buttons */}
                <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom + 20 }]}>
                    <TouchableOpacity 
                        style={[styles.googleButton, isGoogleLoading && styles.buttonDisabled]} 
                        onPress={handleGoogleLogin}
                        disabled={isGoogleLoading}
                    >
                        {isGoogleLoading ? (
                            <ActivityIndicator size="small" color="black" />
                        ) : (
                            <AntDesign name="google" size={24} color="black" />
                        )}
                        <Text style={styles.googleButtonText}>
                            {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.emailButton} onPress={handleEmailLogin}>
                        <Ionicons name="mail" size={24} color="white" />
                        <Text style={styles.emailButtonText}>Continue with Email</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.createAccountButton} onPress={handleCreateAccount}>
                        <Text style={styles.createAccountText}>
                            Don't have an account? <Text style={styles.createAccountLink}>Create Account</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    contentContainer: {
        flex: 1,
        position: 'relative',
    },
    logoContainer: {
        alignItems: 'center',
        zIndex: 10,
    },
    logoBadge: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 30,
        transform: [{ rotate: '-5deg' }],
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    tagsContainer: {
        height: height * 0.4,
        position: 'relative',
        marginTop: 20,
    },
    tag: {
        position: 'absolute',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    tagText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    textContainer: {
        paddingHorizontal: 30,
        marginBottom: 40,
    },
    headline: {
        fontSize: 48,
        fontWeight: 'bold',
        color: 'white',
        lineHeight: 56,
    },
    buttonsContainer: {
        paddingHorizontal: 30,
        gap: 16,
        marginTop: 'auto',
    },
    googleButton: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        gap: 12,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    emailButton: {
        backgroundColor: '#1F2937',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 30,
        gap: 12,
        borderWidth: 1,
        borderColor: '#374151',
    },
    emailButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    createAccountButton: {
        alignItems: 'center',
        marginTop: 10,
    },
    createAccountText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    createAccountLink: {
        color: '#FF6B4A',
        fontWeight: 'bold',
    },
});
