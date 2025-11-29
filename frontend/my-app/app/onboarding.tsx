import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolate,
} from 'react-native-reanimated';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/utils/auth/useAuth';

const ONBOARDING_STEPS = [
    {
        id: 1,
        title: 'Welcome to GrowEasy',
        description: 'Your personal task management companion to help you stay organized and productive.',
        icon: '📝',
    },
    {
        id: 2,
        title: 'Organize Your Life',
        description: 'Create tasks, set priorities, and track your progress all in one place.',
        icon: '✅',
    },
    {
        id: 3,
        title: 'Stay Productive',
        description: 'Never miss a deadline. Get reminders and keep your goals on track.',
        icon: '🚀',
    },
];

export default function OnboardingScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const { auth, completeOnboarding } = useAuth();
    const [currentStep, setCurrentStep] = useState(0);
    const translateX = useSharedValue(0);
    
    // Responsive sizing
    const isSmallScreen = height < 700;
    const iconSize = isSmallScreen ? 80 : 120;
    const titleSize = isSmallScreen ? 24 : 32;
    const descSize = isSmallScreen ? 14 : 18;

    const handleNext = () => {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            translateX.value = withSpring(-(currentStep + 1) * width, {
                damping: 20,
                stiffness: 90,
            });
        } else {
            handleComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    const handleComplete = async () => {
        try {
            await completeOnboarding();
            // Routing guard will handle navigation to tabs
            if (auth) {
                router.replace('/(tabs)');
            } else {
                router.replace('/');
            }
        } catch (error) {
            console.error('Error saving onboarding status:', error);
            if (auth) {
                router.replace('/(tabs)');
            } else {
                router.replace('/');
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            translateX.value = withSpring(-(currentStep - 1) * width, {
                damping: 20,
                stiffness: 90,
            });
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            
            {/* Skip Button */}
            <View style={[styles.skipContainer, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
                <Animated.View style={[styles.stepsContainer, animatedStyle]}>
                    {ONBOARDING_STEPS.map((step, index) => (
                        <View key={step.id} style={[styles.step, { width }]}>
                            <View style={[
                                styles.iconContainer,
                                { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }
                            ]}>
                                <Text style={[styles.icon, { fontSize: iconSize * 0.5 }]}>{step.icon}</Text>
                            </View>
                            <Text style={[styles.title, { fontSize: titleSize }]}>{step.title}</Text>
                            <Text style={[styles.description, { fontSize: descSize }]}>{step.description}</Text>
                        </View>
                    ))}
                </Animated.View>
            </View>

            {/* Indicators */}
            <View style={styles.indicatorsContainer}>
                {ONBOARDING_STEPS.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentStep === index && styles.indicatorActive,
                        ]}
                    />
                ))}
            </View>

            {/* Navigation Buttons */}
            <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom + 20 }]}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={handlePrevious}
                    >
                        <Text style={styles.backButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.nextButton, currentStep === 0 && styles.nextButtonFull]}
                    onPress={handleNext}
                >
                    <Text style={styles.nextButtonText}>
                        {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                    {currentStep < ONBOARDING_STEPS.length - 1 && (
                        <ArrowRight size={20} color="white" style={{ marginLeft: 8 }} />
                    )}
                    {currentStep === ONBOARDING_STEPS.length - 1 && (
                        <CheckCircle size={20} color="white" style={{ marginLeft: 8 }} />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    skipContainer: {
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        zIndex: 10,
    },
    skipText: {
        color: '#9CA3AF',
        fontSize: 16,
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
        overflow: 'hidden',
    },
    stepsContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    step: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        backgroundColor: '#1F2937',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    icon: {
        // fontSize set dynamically
    },
    title: {
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    indicatorsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#374151',
    },
    indicatorActive: {
        width: 24,
        backgroundColor: '#FF6B4A',
    },
    buttonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        alignItems: 'center',
    },
    backButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButtonText: {
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '600',
    },
    nextButton: {
        flex: 1,
        backgroundColor: '#FF6B4A',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    nextButtonFull: {
        flex: 1,
    },
    nextButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
    },
});

