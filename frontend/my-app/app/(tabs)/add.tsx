import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Calendar, ChevronDown } from "lucide-react-native";
import { router } from "expo-router";
import { API_URL } from "@/constants/config";
import KeyboardAvoidingAnimatedView from "@/components/KeyboardAvoidingAnimatedView";

const categories = [
  "🛒 Shopping",
  "🤝 Meeting",
  "🎂 Birthday",
  "🏖️ Holiday",
  "💻 Development",
  "🎨 Design",
  "📧 Email",
  "📱 Personal",
];

const priorities = ["low", "medium", "high"];
const statuses = ["todo", "in_progress", "review", "completed"];

export default function AddTaskScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { auth, signIn } = useAuth();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("medium");
  const [selectedStatus, setSelectedStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  // Animation and keyboard handling
  const focusedPadding = 12;
  const paddingAnimation = useRef(
    new Animated.Value(insets.bottom + focusedPadding),
  ).current;

  const animateTo = (value: number) => {
    Animated.timing(paddingAnimation, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleInputFocus = () => {
    if (Platform.OS === "web") return;
    animateTo(focusedPadding);
  };

  const handleInputBlur = () => {
    if (Platform.OS === "web") return;
    animateTo(insets.bottom + focusedPadding);
  };

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: {
      title: string;
    }) => {
      if (!auth) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      Alert.alert("Success", "Task created successfully!");
      setTitle("");
      setDescription("");
      router.back();
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to create task");
    },
  });

  const handleCreateTask = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }
    createTaskMutation.mutate({ title: title.trim() });
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
        <Text
          style={{
            fontSize: 18,
            color: colors.text,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Please sign in to create tasks
        </Text>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 30,
            paddingVertical: 12,
            borderRadius: 20,
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

  return (
    <KeyboardAvoidingAnimatedView style={{ flex: 1 }} behavior="padding">
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <Animated.View
          style={{
            flex: 1,
            paddingBottom: paddingAnimation,
          }}
        >
          <ScrollView
            style={{ flex: 1, paddingTop: insets.top + 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ paddingHorizontal: 20, marginBottom: 30 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 15,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 15,
                  }}
                >
                  <Text style={{ fontSize: 24 }}>➕</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: colors.text,
                    }}
                  >
                    Add New Task
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                    }}
                  >
                    Create a new task to stay organized
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 20 }}>
              {/* Task Title */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Task Title *
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter task title"
                  placeholderTextColor={colors.textSecondary}
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.text,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </View>

              {/* Description */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Description
                </Text>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter task description"
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.text,
                    minHeight: 80,
                    textAlignVertical: "top",
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </View>

              {/* Categories */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 12,
                  }}
                >
                  Category
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() =>
                        setSelectedCategory(
                          category === selectedCategory ? "" : category,
                        )
                      }
                      style={{
                        backgroundColor:
                          category === selectedCategory
                            ? colors.primary
                            : colors.card,
                        borderWidth: 1,
                        borderColor:
                          category === selectedCategory
                            ? colors.primary
                            : colors.border,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color:
                            category === selectedCategory
                              ? "white"
                              : colors.text,
                        }}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Priority */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 12,
                  }}
                >
                  Priority
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      onPress={() => setSelectedPriority(priority)}
                      style={{
                        flex: 1,
                        backgroundColor:
                          priority === selectedPriority
                            ? colors.priority[priority]
                            : colors.card,
                        borderWidth: 1,
                        borderColor:
                          priority === selectedPriority
                            ? colors.priority[priority]
                            : colors.border,
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color:
                            priority === selectedPriority
                              ? "white"
                              : colors.priority[priority],
                          textTransform: "capitalize",
                        }}
                      >
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Status */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 12,
                  }}
                >
                  Status
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                  }}
                >
                  {statuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      onPress={() => setSelectedStatus(status)}
                      style={{
                        backgroundColor:
                          status === selectedStatus
                            ? colors.statusBg[status]
                            : colors.card,
                        borderWidth: 1,
                        borderColor:
                          status === selectedStatus
                            ? colors.statusText[status]
                            : colors.border,
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color:
                            status === selectedStatus
                              ? colors.statusText[status]
                              : colors.text,
                          textTransform: "capitalize",
                        }}
                      >
                        {status.replace("_", " ")}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Due Date */}
              <View style={{ marginBottom: 30 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: colors.text,
                    marginBottom: 8,
                  }}
                >
                  Due Date (Optional)
                </Text>
                <TextInput
                  value={dueDate}
                  onChangeText={setDueDate}
                  placeholder="YYYY-MM-DD HH:MM (e.g., 2024-12-31 15:30)"
                  placeholderTextColor={colors.textSecondary}
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: colors.text,
                  }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </View>

              {/* Create Button */}
              <TouchableOpacity
                onPress={handleCreateTask}
                disabled={createTaskMutation.isPending || !title.trim()}
                style={{
                  backgroundColor: colors.primary,
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  marginBottom: 20,
                  opacity:
                    createTaskMutation.isPending || !title.trim() ? 0.6 : 1,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "600",
                  }}
                >
                  {createTaskMutation.isPending
                    ? "Creating Task..."
                    : "Create Task"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </KeyboardAvoidingAnimatedView>
  );
}
