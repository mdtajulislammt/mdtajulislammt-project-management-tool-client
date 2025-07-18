import React, { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Users,
  Clock,
  User,
  CheckCircle,
  Circle,
  Wifi,
  WifiOff,
} from "lucide-react";
import Sidebar from "../../Common/Sideber/Sidebar";
import Navbar from "../../Common/Header/Navbar";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

interface Presence {
  userId: string;
  taskId: string;
  action: "viewing" | "editing";
  timestamp: string;
}

const Presence: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [presences, setPresences] = useState<Presence[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("Ahmed Ali");

  // Mock data for users
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Ahmed Ali",
      email: "ahmed@company.com",
      avatar:
        "https://ui-avatars.com/api/?name=Ahmed+Ali&background=51B700&color=fff",
      isOnline: true,
      lastSeen: "Active now",
    },
    {
      id: "2",
      name: "Fatima Khan",
      email: "fatima@company.com",
      avatar:
        "https://ui-avatars.com/api/?name=Fatima+Khan&background=FFDF00&color=000",
      isOnline: true,
      lastSeen: "Active now",
    },
    {
      id: "3",
      name: "Mohammad Rahim",
      email: "rahim@company.com",
      avatar:
        "https://ui-avatars.com/api/?name=Mohammad+Rahim&background=FF6B6B&color=fff",
      isOnline: false,
      lastSeen: "5 minutes ago",
    },
    {
      id: "4",
      name: "Ayesha Siddika",
      email: "ayesha@company.com",
      avatar:
        "https://ui-avatars.com/api/?name=Ayesha+Siddika&background=4ECDC4&color=fff",
      isOnline: true,
      lastSeen: "Active now",
    },
    {
      id: "5",
      name: "Karim Uddin",
      email: "karim@company.com",
      avatar:
        "https://ui-avatars.com/api/?name=Karim+Uddin&background=45B7D1&color=fff",
      isOnline: false,
      lastSeen: "15 minutes ago",
    },
  ];

  // Mock tasks
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Complete website design",
      description: "Create UI/UX design for the new company website",
      assignedTo: "Ahmed Ali",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-07-25",
      createdAt: "2025-07-15",
    },
    {
      id: "2",
      title: "Database setup",
      description: "Configure database for production environment",
      assignedTo: "Fatima Khan",
      priority: "medium",
      status: "pending",
      dueDate: "2025-07-30",
      createdAt: "2025-07-16",
    },
    {
      id: "3",
      title: "API documentation",
      description: "Create detailed documentation for all APIs",
      assignedTo: "Mohammad Rahim",
      priority: "low",
      status: "completed",
      dueDate: "2025-07-28",
      createdAt: "2025-07-14",
    },
    {
      id: "4",
      title: "Testing & QA",
      description: "Complete system testing and quality assurance",
      assignedTo: "Ayesha Siddika",
      priority: "high",
      status: "in-progress",
      dueDate: "2025-08-01",
      createdAt: "2025-07-17",
    },
  ];

  // Initialize data
  useEffect(() => {
    setTasks(mockTasks);
    setUsers(mockUsers);

    // Simulate initial presence data
    const initialPresence: Presence[] = [
      {
        userId: "2",
        taskId: "1",
        action: "viewing",
        timestamp: new Date().toISOString(),
      },
      {
        userId: "4",
        taskId: "1",
        action: "editing",
        timestamp: new Date().toISOString(),
      },
      {
        userId: "1",
        taskId: "2",
        action: "viewing",
        timestamp: new Date().toISOString(),
      },
    ];
    setPresences(initialPresence);
  }, []);

  // Simulate real-time presence updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update presence
      const onlineUsers = users.filter((u) => u.isOnline);
      const randomUser =
        onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const randomAction = Math.random() > 0.7 ? "editing" : "viewing";

      if (randomUser && randomTask) {
        setPresences((prev) => {
          // Remove existing presence for this user-task combination
          const filtered = prev.filter(
            (p) => !(p.userId === randomUser.id && p.taskId === randomTask.id)
          );

          // Add new presence
          const newPresence: Presence = {
            userId: randomUser.id,
            taskId: randomTask.id,
            action: randomAction,
            timestamp: new Date().toISOString(),
          };

          return [...filtered, newPresence];
        });
      }

      // Occasionally remove old presence (simulate users leaving)
      if (Math.random() > 0.8) {
        setPresences((prev) => {
          if (prev.length > 0) {
            const randomIndex = Math.floor(Math.random() * prev.length);
            return prev.filter((_, index) => index !== randomIndex);
          }
          return prev;
        });
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [users, tasks]);

  // Handle task selection for viewing presence
  const handleTaskView = (taskId: string) => {
    setSelectedTask(taskId);

    // Add current user's viewing presence
    const currentUserId = users.find((u) => u.name === currentUser)?.id;
    if (currentUserId) {
      setPresences((prev) => {
        const filtered = prev.filter(
          (p) => !(p.userId === currentUserId && p.taskId === taskId)
        );
        return [
          ...filtered,
          {
            userId: currentUserId,
            taskId: taskId,
            action: "viewing",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    }
  };

  // Handle task edit simulation
  const handleTaskEdit = (taskId: string) => {
    const currentUserId = users.find((u) => u.name === currentUser)?.id;
    if (currentUserId) {
      setPresences((prev) => {
        const filtered = prev.filter(
          (p) => !(p.userId === currentUserId && p.taskId === taskId)
        );
        return [
          ...filtered,
          {
            userId: currentUserId,
            taskId: taskId,
            action: "editing",
            timestamp: new Date().toISOString(),
          },
        ];
      });
    }
  };

  // Get presence for a specific task
  const getTaskPresence = (taskId: string) => {
    return presences.filter((p) => p.taskId === taskId);
  };

  // Get user by ID
  const getUserById = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get total online users
  const onlineUsersCount = users.filter((u) => u.isOnline).length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <Navbar title="Presence" />
        <div className="flex min-h-screen bg-gray-50">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {onlineUsersCount}
                      </div>
                      <div className="text-gray-600">Online Users</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {presences.filter((p) => p.action === "viewing").length}
                      </div>
                      <div className="text-gray-600">Viewing</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {presences.filter((p) => p.action === "editing").length}
                      </div>
                      <div className="text-gray-600">Editing</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {tasks.length}
                      </div>
                      <div className="text-gray-600">Total Tasks</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tasks with Presence */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Tasks & Presence
                      </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                      {tasks.map((task) => {
                        const taskPresence = getTaskPresence(task.id);
                        const viewingUsers = taskPresence.filter(
                          (p) => p.action === "viewing"
                        );
                        const editingUsers = taskPresence.filter(
                          (p) => p.action === "editing"
                        );

                        return (
                          <div key={task.id} className="px-6 py-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900 mb-1">
                                  {task.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                  {task.description}
                                </p>

                                <div className="flex items-center gap-2 mb-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority === "high"
                                      ? "High"
                                      : task.priority === "medium"
                                      ? "Medium"
                                      : "Low"}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                      task.status
                                    )}`}
                                  >
                                    {task.status === "completed"
                                      ? "Completed"
                                      : task.status === "in-progress"
                                      ? "In Progress"
                                      : "Pending"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleTaskView(task.id)}
                                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleTaskEdit(task.id)}
                                  className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
                                >
                                  Edit
                                </button>
                              </div>
                            </div>

                            {/* Presence Indicators */}
                            <div className="space-y-2">
                              {editingUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Edit2 className="w-4 h-4 text-orange-600" />
                                  <span className="text-sm text-gray-600">
                                    Editing:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {editingUsers.map((presence) => {
                                      const user = getUserById(presence.userId);
                                      return user ? (
                                        <div
                                          key={presence.userId}
                                          className="flex items-center gap-1"
                                        >
                                          <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full border-2 border-orange-400"
                                          />
                                          <span className="text-sm font-medium text-orange-700">
                                            {user.name}
                                          </span>
                                          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}

                              {viewingUsers.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Eye className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-600">
                                    Viewing:
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {viewingUsers.map((presence) => {
                                      const user = getUserById(presence.userId);
                                      return user ? (
                                        <div
                                          key={presence.userId}
                                          className="flex items-center gap-1"
                                        >
                                          <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="w-6 h-6 rounded-full border-2 border-blue-400"
                                          />
                                          <span className="text-sm font-medium text-blue-700">
                                            {user.name}
                                          </span>
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}

                              {taskPresence.length === 0 && (
                                <div className="text-sm text-gray-500">
                                  No one is currently active on this task
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Online Users */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Online Users
                      </h2>
                    </div>

                    <div className="p-4 space-y-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-10 h-10 rounded-full"
                            />
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                user.isOnline ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                {user.name}
                              </span>
                              {user.isOnline ? (
                                <Wifi className="w-4 h-4 text-green-500" />
                              ) : (
                                <WifiOff className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600">
                              {user.lastSeen}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="bg-white rounded-lg shadow mt-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Recent Activity
                      </h2>
                    </div>

                    <div className="p-4 space-y-3">
                      {presences.slice(0, 10).map((presence, index) => {
                        const user = getUserById(presence.userId);
                        const task = tasks.find(
                          (t) => t.id === presence.taskId
                        );

                        return (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-2 rounded-lg"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                presence.action === "editing"
                                  ? "bg-orange-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {presence.action === "editing" ? (
                                <Edit2 className="w-4 h-4 text-orange-600" />
                              ) : (
                                <Eye className="w-4 h-4 text-blue-600" />
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="text-sm">
                                <span className="font-medium">
                                  {user?.name}
                                </span>
                                <span className="text-gray-600">
                                  {presence.action === "editing"
                                    ? " is editing "
                                    : " is viewing "}
                                </span>
                                <span className="font-medium">
                                  {task?.title}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  presence.timestamp
                                ).toLocaleTimeString("en-US")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Presence;
