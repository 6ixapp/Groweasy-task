import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const Colors = {
    light: {
        background: '#FFFFFF',
        text: '#1A1A1A',
        textSecondary: '#666666',
        primary: '#4F46E5', // Indigo 600
        card: '#F3F4F6',
        border: '#E5E7EB',
        tabBar: '#FFFFFF',
        tabBarActive: '#4F46E5',
        tabBarInactive: '#9CA3AF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        accent: '#8B5CF6',
        surface: '#F9FAFB',
        priority: {
            low: '#10B981',
            medium: '#F59E0B',
            high: '#EF4444',
        },
        statusBg: {
            todo: '#E0E7FF',
            in_progress: '#FEF3C7',
            review: '#EDE9FE',
            completed: '#D1FAE5',
        },
        statusText: {
            todo: '#4338CA',
            in_progress: '#B45309',
            review: '#6D28D9',
            completed: '#065F46',
        },
    },
    dark: {
        background: '#111827',
        text: '#F9FAFB',
        textSecondary: '#9CA3AF',
        primary: '#6366F1', // Indigo 500
        card: '#1F2937',
        border: '#374151',
        tabBar: '#1F2937',
        tabBarActive: '#6366F1',
        tabBarInactive: '#6B7280',
        success: '#34D399',
        warning: '#FBBF24',
        error: '#F87171',
        accent: '#A78BFA',
        surface: '#374151',
        priority: {
            low: '#34D399',
            medium: '#FBBF24',
            high: '#F87171',
        },
        statusBg: {
            todo: '#312E81',
            in_progress: '#78350F',
            review: '#4C1D95',
            completed: '#064E3B',
        },
        statusText: {
            todo: '#E0E7FF',
            in_progress: '#FEF3C7',
            review: '#EDE9FE',
            completed: '#D1FAE5',
        },
    },
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemScheme === 'dark');

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = isDark ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider value={{ colors: theme, isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
