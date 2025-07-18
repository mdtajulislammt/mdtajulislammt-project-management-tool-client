import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Circle,
  Users,
  Link,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Shield,
  Settings,
  Eye,
  Lock,
  UserCheck,
  Crown,
  User,
  UserX,
} from "lucide-react";
import Sidebar from "../Common/Sideber/Sidebar";
import Navbar from "../Common/Header/Navbar";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  color: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "member" | "viewer";
  avatar: string;
  permissions: string[];
}

interface RolePermissions {
  [key: string]: {
    name: string;
    permissions: string[];
    color: string;
    icon: React.ReactNode;
  };
}

const RoleBasedTimeline: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.5);
  const [viewMode, setViewMode] = useState<"days" | "weeks" | "months">("weeks");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Role definitions with permissions
  const rolePermissions: RolePermissions = {
    admin: {
      name: "Admin",
      permissions: [
        "view_all_tasks",
        "edit_all_tasks",
        "delete_all_tasks",
        "manage_users",
        "manage_dependencies",
        "change_settings",
        "export_data",
        "view_reports"
      ],
      color: "bg-red-500",
      icon: <Crown className="w-4 h-4" />
    },
    manager: {
      name: "Manager",
      permissions: [
        "view_all_tasks",
        "edit_all_tasks",
        "create_tasks",
        "assign_tasks",
        "manage_dependencies",
        "view_reports",
        "export_data"
      ],
      color: "bg-blue-500",
      icon: <UserCheck className="w-4 h-4" />
    },
    member: {
      name: "Member",
      permissions: [
        "view_assigned_tasks",
        "edit_own_tasks",
        "update_progress",
        "view_timeline",
        "add_comments"
      ],
      color: "bg-green-500",
      icon: <User className="w-4 h-4" />
    },
    viewer: {
      name: "Viewer",
      permissions: [
        "view_timeline",
        "view_assigned_tasks"
      ],
      color: "bg-gray-500",
      icon: <Eye className="w-4 h-4" />
    }
  };

  // Mock users
  const mockUsers: User[] = [
    {
      id: "1",
      name: "Ahmed Ali",
      email: "ahmed@company.com",
      role: "admin",
      avatar: "AA",
      permissions: rolePermissions.admin.permissions
    },
    {
      id: "2",
      name: "Fatima Khan",
      email: "fatima@company.com",
      role: "manager",
      avatar: "FK",
      permissions: rolePermissions.manager.permissions
    },
    {
      id: "3",
      name: "Mohammad Rahim",
      email: "rahim@company.com",
      role: "member",
      avatar: "MR",
      permissions: rolePermissions.member.permissions
    },
    {
      id: "4",
      name: "Ayesha Siddika",
      email: "ayesha@company.com",
      role: "viewer",
      avatar: "AS",
      permissions: rolePermissions.viewer.permissions
    }
  ];

  // Mock tasks
  const mockTasks: Task[] = [
    {
      id: "1",
      title: "Project Planning",
      description: "Define project scope and requirements",
      assignedTo: "Ahmed Ali",
      priority: "high",
      status: "completed",
      startDate: "2025-07-01",
      endDate: "2025-07-10",
      progress: 100,
      dependencies: [],
      color: "#3B82F6",
    },
    {
      id: "2",
      title: "UI/UX Design",
      description: "Create wireframes and design mockups",
      assignedTo: "Fatima Khan",
      priority: "high",
      status: "in-progress",
      startDate: "2025-07-08",
      endDate: "2025-07-25",
      progress: 75,
      dependencies: ["1"],
      color: "#10B981",
    },
    {
      id: "3",
      title: "Database Setup",
      description: "Configure database and schema",
      assignedTo: "Mohammad Rahim",
      priority: "medium",
      status: "pending",
      startDate: "2025-07-15",
      endDate: "2025-07-28",
      progress: 0,
      dependencies: ["1"],
      color: "#F59E0B",
    },
    {
      id: "4",
      title: "Frontend Development",
      description: "Implement user interface components",
      assignedTo: "Ayesha Siddika",
      priority: "high",
      status: "pending",
      startDate: "2025-07-20",
      endDate: "2025-08-15",
      progress: 0,
      dependencies: ["2"],
      color: "#EF4444",
    }
  ];

  useEffect(() => {
    setTasks(mockTasks);
    setCurrentUser(mockUsers[0]); // Default to admin user
  }, []);

  // Permission checking function
  const hasPermission = (permission: string): boolean => {
    return currentUser?.permissions.includes(permission) || false;
  };

  // Get filtered tasks based on role
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    // Apply role-based filtering
    if (currentUser?.role === "member") {
      // Members can only see their assigned tasks
      filtered = filtered.filter(task => task.assignedTo === currentUser.name);
    } else if (currentUser?.role === "viewer") {
      // Viewers can see all tasks but with limited actions
      filtered = filtered.filter(task => task.assignedTo === currentUser.name);
    }

    return filtered;
  };

  // Calculate timeline dates
  const getTimelineRange = () => {
    const allDates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);
    
    return { minDate, maxDate };
  };

  // Generate timeline columns
  const generateTimelineColumns = () => {
    const { minDate, maxDate } = getTimelineRange();
    const columns = [];
    const currentDate = new Date(minDate);
    
    while (currentDate <= maxDate) {
      columns.push(new Date(currentDate));
      
      if (viewMode === "days") {
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (viewMode === "weeks") {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    return columns;
  };

  // Calculate task position
  const calculateTaskPosition = (task: Task) => {
    const { minDate } = getTimelineRange();
    const columns = generateTimelineColumns();
    const columnWidth = 120 * zoomLevel;
    
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    let startIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] <= taskStart) {
        startIndex = i;
      }
    }
    
    const durationMs = taskEnd.getTime() - taskStart.getTime();
    const totalDurationMs = columns[columns.length - 1].getTime() - columns[0].getTime();
    const widthRatio = durationMs / totalDurationMs;
    const width = Math.max(columnWidth * widthRatio, 60);
    
    return {
      left: startIndex * columnWidth,
      width: width,
    };
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "pending": return <Circle className="w-4 h-4 text-gray-600" />;
      default: return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  // Handle task actions based on permissions
  const handleTaskAction = (action: string, taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (action === "edit" && hasPermission("edit_all_tasks")) {
      // Allow editing
      console.log("Editing task:", taskId);
    } else if (action === "edit" && hasPermission("edit_own_tasks") && task?.assignedTo === currentUser?.name) {
      // Allow editing own tasks
      console.log("Editing own task:", taskId);
    } else if (action === "delete" && hasPermission("delete_all_tasks")) {
      // Allow deleting
      console.log("Deleting task:", taskId);
    } else {
      alert("You don't have permission to perform this action");
    }
  };

  const timelineColumns = generateTimelineColumns();
  const filteredTasks = getFilteredTasks();

  return (

    <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar */}
    <div className="hidden md:block">
      <Sidebar />
    </div>

    {/* Main content area */}
    <div className="flex-1 flex flex-col">
      <Navbar title="Role" />
    <div className="min-h-screen bg-gray-50">
      {/* Role Selector Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Role-Based Access Control</h1>
            </div>
            
            {/* Current User Display */}
            {currentUser && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <div className={`w-6 h-6 rounded-full ${rolePermissions[currentUser.role].color} text-white flex items-center justify-center text-xs font-bold`}>
                  {currentUser.avatar}
                </div>
                <span className="text-sm font-medium">{currentUser.name}</span>
                <div className="flex items-center gap-1">
                  {rolePermissions[currentUser.role].icon}
                  <span className="text-xs text-gray-600">{rolePermissions[currentUser.role].name}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setShowRoleModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Switch Role
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Permission Status Banner */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Permissions</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentUser?.permissions.map((permission) => (
              <span
                key={permission}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {permission.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>

        {/* Header Controls */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
              {hasPermission("view_timeline") && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <select 
                    value={viewMode} 
                    onChange={(e) => setViewMode(e.target.value as any)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-600" />
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Tasks</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Zoom Controls - Only for certain roles */}
              {hasPermission("view_timeline") && (
                <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                    className="p-1 hover:bg-gray-100 rounded-l-lg"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 py-1 text-sm border-x border-gray-300">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                    className="p-1 hover:bg-gray-100 rounded-r-lg"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Add Task Button - Only for managers and admins */}
              {(hasPermission("create_tasks") || hasPermission("edit_all_tasks")) && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredTasks.length}</div>
                <div className="text-gray-600">
                  {currentUser?.role === "member" ? "My Tasks" : "Total Tasks"}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredTasks.filter(t => t.status === 'completed').length}
                </div>
                <div className="text-gray-600">Completed</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredTasks.filter(t => t.status === 'in-progress').length}
                </div>
                <div className="text-gray-600">In Progress</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{mockUsers.length}</div>
                <div className="text-gray-600">Team Members</div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Denied Message for Viewers */}
        {!hasPermission("view_timeline") && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h3>
            <p className="text-gray-600 mb-4">
              You don't have permission to view the timeline. Please contact your administrator.
            </p>
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                Current Role: {rolePermissions[currentUser?.role || "viewer"].name}
              </span>
            </div>
          </div>
        )}

        {/* Gantt Chart - Only show if user has permission */}
        {hasPermission("view_timeline") && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Gantt Chart</h2>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-full">
                {/* Timeline Header */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <div className="w-80 p-4 font-semibold text-gray-900 border-r border-gray-200">
                    Task
                  </div>
                  <div className="flex-1 flex">
                    {timelineColumns.map((date, index) => (
                      <div
                        key={index}
                        className="border-r border-gray-200 p-2 text-center text-sm font-medium text-gray-700"
                        style={{ width: `${120 * zoomLevel}px`, minWidth: `${120 * zoomLevel}px` }}
                      >
                        {viewMode === "days" 
                          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : viewMode === "weeks"
                          ? `Week ${Math.ceil(date.getDate() / 7)}`
                          : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        }
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                <div className="relative">
                  {filteredTasks.map((task) => {
                    const position = calculateTaskPosition(task);
                    const canEdit = hasPermission("edit_all_tasks") || 
                                  (hasPermission("edit_own_tasks") && task.assignedTo === currentUser?.name);
                    const canDelete = hasPermission("delete_all_tasks");
                    
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center border-b border-gray-200 hover:bg-gray-50 ${
                          selectedTask === task.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      >
                        {/* Task Info */}
                        <div className="w-80 p-4 border-r border-gray-200">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{task.title}</span>
                                {!canEdit && (
                                  <Lock className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{task.assignedTo}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {task.progress}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex items-center gap-1">
                              {canEdit && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskAction("edit", task.id);
                                  }}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTaskAction("delete", task.id);
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex-1 relative h-16 flex items-center">
                          {/* Task Bar */}
                          <div
                            className="absolute h-6 rounded-lg shadow-sm flex items-center justify-center text-white text-xs font-medium"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                              backgroundColor: task.color,
                            }}
                          >
                            {task.progress}%
                          </div>

                          {/* Progress Bar */}
                          <div
                            className="absolute h-6 rounded-lg bg-gray-200 opacity-30"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width}px`,
                            }}
                          />
                          <div
                            className="absolute h-6 rounded-lg opacity-80"
                            style={{
                              left: `${position.left}px`,
                              width: `${position.width * (task.progress / 100)}px`,
                              backgroundColor: task.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Details - Only show if user has permission */}
        {selectedTask && hasPermission("view_timeline") && (
          <div className="mt-6 bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
            </div>
            <div className="p-6">
              {(() => {
                const task = tasks.find(t => t.id === selectedTask);
                if (!task) return null;
                
                return (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-gray-600 mt-1">{task.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Assigned To:</span>
                        <p className="font-medium">{task.assignedTo}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Status:</span>
                        <p className="font-medium">{task.status}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Priority:</span>
                        <p className="font-medium">{task.priority}</p>
      </div>
                      <div>
                        <span className="text-sm text-gray-500">Progress:</span>
                        <p className="font-medium">{task.progress}%</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Start Date:</span>
                        <p className="font-medium">
                          {new Date(task.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">End Date:</span>
                        <p className="font-medium">
                          {new Date(task.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Role Switch Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Switch User Role</h3>
            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    currentUser?.id === user.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowRoleModal(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${rolePermissions[user.role].color} text-white flex items-center justify-center text-sm font-bold`}>
                      {user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600">{rolePermissions[user.role].name}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="mt-6 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              onClick={() => setShowRoleModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default RoleBasedTimeline;