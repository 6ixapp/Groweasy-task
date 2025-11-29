import React from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import useUser from "@/utils/auth/useUser";
import {
    User,
    Moon,
    Sun,
    LogOut,
    Settings,
    HelpCircle,
    Info,
} from "lucide-react-native";
import { API_URL } from "@/constants/config";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const { colors, isDark, toggleTheme } = useTheme();
    const { auth, signOut } = useAuth();
    const { data: user, isLoading: userLoading } = useUser();
    const router = useRouter();

    // Fetch tasks to calculate stats
    const { data: tasks } = useQuery({
        queryKey: ["tasks", auth],
        queryFn: async () => {
            if (!auth) return [];
            const response = await fetch(`${API_URL}/todos`, {
                headers: {
                    'Authorization': `Bearer ${auth}`,
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }
            return response.json();
        },
        enabled: !!auth,
    });

    // Calculate stats from tasks
    const userStats = React.useMemo(() => {
        if (!tasks) return null;
        const completed = tasks.filter((t: any) => t.completed).length;
        const todo = tasks.filter((t: any) => !t.completed).length;
        return { completed, todo };
    }, [tasks]);

    const handleSignOut = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Sign Out",
                style: "destructive",
                onPress: async () => {
                    await signOut();
                    // The routing guard in _layout.tsx will handle navigation
                },
            },
        ]);
    };

    if (!auth) {
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: colors.background,
                    paddingTop: insets.top,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                }}
            >
                <StatusBar style={isDark ? "light" : "dark"} />
                <View
                    style={{
                        alignItems: "center",
                        marginBottom: 40,
                    }}
                >
                    <View
                        style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: colors.primary,
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: 20,
                        }}
                    >
                        <User size={60} color="white" />
                    </View>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: colors.text,
                            textAlign: "center",
                            marginBottom: 10,
                        }}
                    >
                        Profile
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: colors.textSecondary,
                            textAlign: "center",
                            marginBottom: 40,
                        }}
                    >
                        Sign in to view your profile
                    </Text>
                </View>

                <View style={{ width: "100%", marginBottom: 30 }}>
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 20,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {isDark ? (
                                    <Moon size={24} color={colors.text} />
                                ) : (
                                    <Sun size={24} color={colors.text} />
                                )}
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: colors.text,
                                        marginLeft: 12,
                                    }}
                                >
                                    Dark Mode
                                </Text>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{
                                    false: colors.border,
                                    true: colors.primary,
                                }}
                                thumbColor="white"
                            />
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => router.replace('/')}
                    style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 40,
                        paddingVertical: 15,
                        borderRadius: 25,
                    }}
                >
                    <Text
                        style={{
                            color: "white",
                            fontSize: 16,
                            fontWeight: "600",
                        }}
                    >
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const totalTasks = userStats
        ? userStats.completed + userStats.todo
        : 0;

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            <ScrollView
                style={{ flex: 1, paddingTop: insets.top + 20 }}
                contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            color: colors.text,
                            marginBottom: 30,
                        }}
                    >
                        Profile
                    </Text>

                    {/* User Info Card */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: 24,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 20,
                        }}
                    >
                        <View
                            style={{
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <View
                                style={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: colors.primary,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 12,
                                }}
                            >
                                <User size={40} color="white" />
                            </View>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                    color: colors.text,
                                    marginBottom: 4,
                                }}
                            >
                                {user?.name || "User"}
                            </Text>
                            <Text
                                style={{
                                    fontSize: 14,
                                    color: colors.textSecondary,
                                }}
                            >
                                {user?.email}
                            </Text>
                        </View>

                        {/* Stats */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingTop: 20,
                                borderTopWidth: 1,
                                borderTopColor: colors.border,
                            }}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        fontWeight: "bold",
                                        color: colors.text,
                                    }}
                                >
                                    {totalTasks}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.textSecondary,
                                        marginTop: 2,
                                    }}
                                >
                                    Total Tasks
                                </Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        fontWeight: "bold",
                                        color: colors.success,
                                    }}
                                >
                                    {userStats?.completed || 0}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.textSecondary,
                                        marginTop: 2,
                                    }}
                                >
                                    Completed
                                </Text>
                            </View>
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{
                                        fontSize: 24,
                                        fontWeight: "bold",
                                        color: colors.warning,
                                    }}
                                >
                                    {userStats?.todo || 0}
                                </Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: colors.textSecondary,
                                        marginTop: 2,
                                    }}
                                >
                                    Pending
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Settings */}
                <View style={{ paddingHorizontal: 20 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: colors.text,
                            marginBottom: 16,
                        }}
                    >
                        Settings
                    </Text>

                    {/* Theme Toggle */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                {isDark ? (
                                    <Moon size={24} color={colors.text} />
                                ) : (
                                    <Sun size={24} color={colors.text} />
                                )}
                                <View style={{ marginLeft: 12 }}>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "600",
                                            color: colors.text,
                                        }}
                                    >
                                        Dark Mode
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: 12,
                                            color: colors.textSecondary,
                                        }}
                                    >
                                        Toggle between light and dark theme
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{
                                    false: colors.border,
                                    true: colors.primary,
                                }}
                                thumbColor="white"
                            />
                        </View>
                    </View>

                    {/* Other Settings */}
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 12,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        activeOpacity={0.7}
                    >
                        <Settings size={24} color={colors.text} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: colors.text,
                                }}
                            >
                                App Settings
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.textSecondary,
                                }}
                            >
                                Notifications, preferences
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 12,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        activeOpacity={0.7}
                    >
                        <HelpCircle size={24} color={colors.text} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: colors.text,
                                }}
                            >
                                Help & Support
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.textSecondary,
                                }}
                            >
                                Get help with the app
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.border,
                            marginBottom: 30,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                        activeOpacity={0.7}
                    >
                        <Info size={24} color={colors.text} />
                        <View style={{ marginLeft: 12, flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: colors.text,
                                }}
                            >
                                About
                            </Text>
                            <Text
                                style={{
                                    fontSize: 12,
                                    color: colors.textSecondary,
                                }}
                            >
                                App version and info
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {/* Sign Out */}
                    <TouchableOpacity
                        onPress={handleSignOut}
                        style={{
                            backgroundColor: colors.error + "20",
                            borderRadius: 16,
                            padding: 20,
                            borderWidth: 1,
                            borderColor: colors.error,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        activeOpacity={0.7}
                    >
                        <LogOut size={24} color={colors.error} />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: colors.error,
                                marginLeft: 12,
                            }}
                        >
                            Sign Out
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
