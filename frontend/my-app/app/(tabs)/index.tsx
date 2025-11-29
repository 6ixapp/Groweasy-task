import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/utils/auth/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Clock, CheckCircle, Plus, Trash2 } from "lucide-react-native";
import { router } from "expo-router";
import { API_URL } from "@/constants/config";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  userId: string;
  createdAt: string;
}

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks
  const {
    data: tasksData,
    isLoading: tasksLoading,
    refetch,
  } = useQuery({
    queryKey: ["tasks", auth],
    queryFn: async (): Promise<Todo[]> => {
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
  const stats = React.useMemo(() => {
    if (!tasksData) return { completed: 0, todo: 0, total: 0 };
    const completed = tasksData.filter(t => t.completed).length;
    const todo = tasksData.filter(t => !t.completed).length;
    return { completed, todo, total: tasksData.length };
  }, [tasksData]);

  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      if (!auth) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${auth}`,
        },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to update task");
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!auth) throw new Error('Not authenticated');
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${auth}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      Alert.alert("Error", "Failed to delete task");
    },
  });

  const handleTaskStatusToggle = useCallback(
    (task: Todo) => {
      updateTaskMutation.mutate({ id: task.id, completed: !task.completed });
    },
    [updateTaskMutation],
  );

  const handleDeleteTask = useCallback(
    (task: Todo) => {
      Alert.alert(
        "Delete Task",
        `Are you sure you want to delete "${task.title}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => deleteTaskMutation.mutate(task.id),
          },
        ]
      );
    },
    [deleteTaskMutation],
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
              borderRadius: 30,
              backgroundColor: colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 50 }}>📝</Text>
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: colors.text,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            Task List
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: 40,
            }}
          >
            Weave Your Time, Design Your Destiny
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 40,
            paddingVertical: 15,
            borderRadius: 25,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600",
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView
        style={{ flex: 1, paddingTop: insets.top + 20 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={tasksLoading}
            onRefresh={() => {
              refetch();
            }}
            tintColor={colors.primary}
          />
        }
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
              <Text style={{ fontSize: 24 }}>📝</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                Task List
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/add")}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plus size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Stats Cards */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <CheckCircle size={16} color={colors.success} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.success,
                    marginLeft: 6,
                  }}
                >
                  Completed
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                {stats?.completed || 0}
              </Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Clock size={16} color={colors.warning} />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: colors.warning,
                    marginLeft: 6,
                  }}
                >
                  Pending
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: colors.text,
                }}
              >
                {stats?.todo || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Tasks List */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: colors.text,
              marginBottom: 16,
            }}
          >
            Your Tasks
          </Text>

          {tasksData?.length ? (
            tasksData.slice(0, 20).map((task) => (
              <View
                key={task.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => handleTaskStatusToggle(task)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: task.completed ? colors.success : colors.border,
                      backgroundColor: task.completed ? colors.success : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    {task.completed && <Check size={16} color="white" />}
                  </TouchableOpacity>

                  {/* Task Title */}
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: colors.text,
                        textDecorationLine: task.completed ? "line-through" : "none",
                        opacity: task.completed ? 0.6 : 1,
                      }}
                    >
                      {task.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginTop: 4,
                      }}
                    >
                      {formatDate(task.createdAt)}
                    </Text>
                  </View>

                  {/* Status Badge */}
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: task.completed 
                        ? colors.success + "20" 
                        : colors.warning + "20",
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: task.completed ? colors.success : colors.warning,
                      }}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </Text>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteTask(task)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: colors.error + "15",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Trash2 size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                alignItems: "center",
                paddingVertical: 40,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: colors.textSecondary,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                No tasks yet. Create your first task!
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/add")}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  Add Task
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
