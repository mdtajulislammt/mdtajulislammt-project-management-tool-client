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

interface Dependency {
  id: string;
  fromTask: string;
  toTask: string;
  type: "finish-to-start" | "start-to-start" | "finish-to-finish" | "start-to-finish";
}

const Timeline: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showDependencyModal, setShowDependencyModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0.5); // Default to 50%
  const [viewMode, setViewMode] = useState<"days" | "weeks" | "months">("weeks");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Mock data for tasks
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
    },
    {
      id: "5",
      title: "Backend Development",
      description: "Develop API endpoints and business logic",
      assignedTo: "Karim Uddin",
      priority: "high",
      status: "pending",
      startDate: "2025-07-25",
      endDate: "2025-08-20",
      progress: 0,
      dependencies: ["3"],
      color: "#8B5CF6",
    },
    {
      id: "6",
      title: "Integration Testing",
      description: "Test integration between frontend and backend",
      assignedTo: "Ahmed Ali",
      priority: "medium",
      status: "pending",
      startDate: "2025-08-18",
      endDate: "2025-08-30",
      progress: 0,
      dependencies: ["4", "5"],
      color: "#06B6D4",
    },
    {
      id: "7",
      title: "Deployment",
      description: "Deploy application to production",
      assignedTo: "Mohammad Rahim",
      priority: "high",
      status: "pending",
      startDate: "2025-08-28",
      endDate: "2025-09-05",
      progress: 0,
      dependencies: ["6"],
      color: "#84CC16",
    },
  ];

  // Mock dependencies
  const mockDependencies: Dependency[] = [
    { id: "1", fromTask: "1", toTask: "2", type: "finish-to-start" },
    { id: "2", fromTask: "1", toTask: "3", type: "finish-to-start" },
    { id: "3", fromTask: "2", toTask: "4", type: "finish-to-start" },
    { id: "4", fromTask: "3", toTask: "5", type: "finish-to-start" },
    { id: "5", fromTask: "4", toTask: "6", type: "finish-to-start" },
    { id: "6", fromTask: "5", toTask: "6", type: "finish-to-start" },
    { id: "7", fromTask: "6", toTask: "7", type: "finish-to-start" },
  ];

  useEffect(() => {
    setTasks(mockTasks);
    setDependencies(mockDependencies);
  }, []);

  // Get filtered tasks
  const getFilteredTasks = () => {
    if (filterStatus === "all") return tasks;
    return tasks.filter(task => task.status === filterStatus);
  };

  // Get task by ID
  const getTaskById = (id: string) => {
    return tasks.find(task => task.id === id);
  };

  // Calculate timeline dates
  const getTimelineRange = () => {
    const allDates = tasks.flatMap(task => [new Date(task.startDate), new Date(task.endDate)]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    
    // Add some padding
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

  // Calculate task position and width
  const calculateTaskPosition = (task: Task) => {
    const { minDate } = getTimelineRange();
    const columns = generateTimelineColumns();
    const columnWidth = 120 * zoomLevel;
    
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);
    
    // Find start position
    let startIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] <= taskStart) {
        startIndex = i;
      }
    }
    
    // Calculate duration
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

  // Add new dependency
  const addDependency = (fromTask: string, toTask: string) => {
    const newDependency: Dependency = {
      id: Date.now().toString(),
      fromTask,
      toTask,
      type: "finish-to-start",
    };
    
    setDependencies([...dependencies, newDependency]);
  };

  // Remove dependency
  const removeDependency = (dependencyId: string) => {
    setDependencies(dependencies.filter(dep => dep.id !== dependencyId));
  };

  // Get task dependencies
  const getTaskDependencies = (taskId: string) => {
    return dependencies.filter(dep => dep.toTask === taskId);
  };

  // Get dependent tasks
  const getDependentTasks = (taskId: string) => {
    return dependencies.filter(dep => dep.fromTask === taskId);
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
        <Navbar title="Timeline" />
        
        <div className="flex-1 p-6">
          {/* Header Controls */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Project Timeline</h1>
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

                {/* Zoom Controls */}
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

                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
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
                  <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
                  <div className="text-gray-600">Total Tasks</div>
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
                    {tasks.filter(t => t.status === 'completed').length}
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
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </div>
                  <div className="text-gray-600">In Progress</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Link className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{dependencies.length}</div>
                  <div className="text-gray-600">Dependencies</div>
                </div>
              </div>
            </div>
          </div>

          {/* Gantt Chart */}
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
                  {filteredTasks.map((task, taskIndex) => {
                    const position = calculateTaskPosition(task);
                    const taskDependencies = getTaskDependencies(task.id);
                    const dependentTasks = getDependentTasks(task.id);
                    
                    return (
                      <div
                        key={task.id}
                        className={`flex items-center border-b border-gray-200 hover:bg-[#52b7002f] cursor-pointer ${
                          selectedTask === task.id ? 'bg-[#52b70056]' : ''
                        }`}
                        onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                      >
                        {/* Task Info */}
                        <div className="w-80 p-4 border-r border-gray-200">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(task.status)}
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{task.title}</div>
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
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="flex-1 relative h-16 flex items-center overflow-x-auto">
                          {/* Task Bar */}
                          <div
                            className="absolute h-6 rounded-lg shadow-sm flex items-center justify-center text-black text-xs font-medium"
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
                            className="absolute h-6 rounded-lg bg-gray-100 opacity-30"
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

          {/* Task Details & Dependencies */}
          {selectedTask && (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Task Details */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Task Details</h3>
                </div>
                <div className="p-6">
                  {(() => {
                    const task = getTaskById(selectedTask);
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

              {/* Dependencies */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Dependencies</h3>
                  <button
                    onClick={() => setShowDependencyModal(true)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 inline mr-1" />
                    Add
                  </button>
                </div>
                
                <div className="p-6">
                  {(() => {
                    const taskDependencies = getTaskDependencies(selectedTask);
                    const dependentTasks = getDependentTasks(selectedTask);
                    
                    return (
                      <div className="space-y-4">
                        {/* Prerequisites */}
                        {taskDependencies.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Prerequisites</h4>
                            <div className="space-y-2">
                              {taskDependencies.map((dep) => {
                                const fromTask = getTaskById(dep.fromTask);
                                return (
                                  <div key={dep.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span className="flex-1">{fromTask?.title}</span>
                                    <button
                                      onClick={() => removeDependency(dep.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Dependent Tasks */}
                        {dependentTasks.length > 0 && (
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Dependent Tasks</h4>
                            <div className="space-y-2">
                              {dependentTasks.map((dep) => {
                                const toTask = getTaskById(dep.toTask);
                                return (
                                  <div key={dep.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span className="flex-1">{toTask?.title}</span>
                                    <button
                                      onClick={() => removeDependency(dep.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {taskDependencies.length === 0 && dependentTasks.length === 0 && (
                          <div className="text-center py-8 text-gray-500">
                            <Link className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p>No dependencies set for this task</p>
                            <p className="text-sm mt-1">Click "Add" to create dependencies</p>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Dependency Modal */}
      {showDependencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Dependency</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Task (Prerequisite)
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Select a task</option>
                  {tasks.filter(t => t.id !== selectedTask).map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Task (Dependent)
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-lg">
                  <option value="">Select a task</option>
                  {tasks.filter(t => t.id !== selectedTask).map(task => (
                    <option key={task.id} value={task.id}>{task.title}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowDependencyModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add dependency logic here
                  setShowDependencyModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Dependency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;