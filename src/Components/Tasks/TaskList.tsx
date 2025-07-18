import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  User,
  Calendar,
  CheckCircle,
  Circle,
  Search,
} from "lucide-react";
import Navbar from "../Common/Header/Navbar";
import Sidebar from "../Common/Sideber/Sidebar";
import TaskModal from "../Common/Model/TaskModal";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { addTask, updateTask, deleteTask, setTasks, Task } from '../../slices/taskSlice';


interface TaskFormData {
  title: string;
  description: string;
  assignedTo: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  startDate?: string;
  dueDate: string; // End Date
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

// Mock data for team members
const teamMembers = [
  { id: "1", name: "Ahmed Ali", email: "ahmed@company.com" },
  { id: "2", name: "Fatima Khan", email: "fatima@company.com" },
  { id: "3", name: "Mohammad Rahim", email: "rahim@company.com" },
  { id: "4", name: "Ayesha Siddika", email: "ayesha@company.com" },
];

const TaskList: React.FC = () => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    assignedTo: "",
    priority: "medium",
    status: "pending",
    startDate: "",
    dueDate: "",
  });

  // Initialize with some sample tasks (only if tasks are empty)
  // Remove the useEffect that sets sampleTasks

  // Handle form submission
  const handleSubmit = () => {
    if (!formData.title || !formData.assignedTo || !formData.dueDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (editingTask) {
      // Update existing task
      dispatch(updateTask({
        ...editingTask,
        ...formData,
        startDate: String(formData.startDate ?? ""),
        endDate: String(formData.dueDate ?? ""),
        progress: editingTask.progress ?? 0,
        color: editingTask.color ?? "#3B82F6",
      }));
    } else {
      // Create new task
      const newTask: Task = {
        id: Date.now().toString(),
        ...formData,
        startDate: String(formData.startDate ?? ""),
        endDate: String(formData.dueDate ?? ""),
        progress: 0,
        color: "#3B82F6",
      };
      dispatch(addTask(newTask));
    }

    resetForm();
  };

  // Reset form and close modal
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      assignedTo: "",
      priority: "medium",
      status: "pending",
      startDate: "",
      dueDate: "",
    });
    setEditingTask(null);
    setShowModal(false);
  };

  // Handle edit task
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: String(task.title),
      description: String(task.description ?? ""),
      assignedTo: String(task.assignedTo ?? ""),
      priority: task.priority || "medium",
      status: task.status || "pending",
      startDate: String(task.startDate ?? ""),
      dueDate: String(task.endDate ?? ""),
    });
    setShowModal(true);
  };

  // Handle delete task
  const handleDelete = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      dispatch(deleteTask(taskId));
    }
  };

  // Handle status toggle
  const handleStatusToggle = (taskId: string) => {
    const task = tasks.find((t: { id: string }) => t.id === taskId);
    if (task) {
      dispatch(updateTask({ ...task, status: task.status === "completed" ? "pending" : "completed" }));
    }
  };

  // Show details modal when a task is clicked (not the edit button)
  const handleShowDetails = (task: Task) => {
    setDetailsTask(task);
    setShowDetailsModal(true);
  };

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task: Task) => {
    const matchesSearch =
      (task.title ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.assignedTo ?? "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || task.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Priority color mapping
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

  // Status color mapping
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

  // Add this handler for TaskModal
  const handleModalChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <Navbar title='Task Management' />
        <div className="flex min-h-screen bg-gray-50">
          {/* Main content area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6">
              {/* Task Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-gray-900">
                    {tasks.length}
                  </div>
                  <div className="text-gray-600">Total Tasks</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-blue-600">
                    {tasks.filter((t: Task) => t.status === "in-progress").length}
                  </div>
                  <div className="text-gray-600">In Progress</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-green-600">
                    {tasks.filter((t: Task) => t.status === "completed").length}
                  </div>
                  <div className="text-gray-600">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="text-2xl font-bold text-red-600">
                    {tasks.filter((t: Task) => t.status === "pending").length}
                  </div>
                  <div className="text-gray-600">Pending</div>
                </div>
              </div>
              {/* Action Bar */}
              <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  {/* Filters */}
                  <div className="flex gap-2">
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <select
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="all">All Priority</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                {/* Create Task Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create New Task
                </button>
              </div>
              {/* Task List */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Task List
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredTasks.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-500">
                      No tasks found
                    </div>
                  ) : (
                    filteredTasks.map((task: Task) => (
                      <div
                        key={task.id}
                        className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={e => {
                          // Prevent opening details if edit/delete is clicked
                          if ((e.target as HTMLElement).closest('.task-action-btn')) return;
                          handleShowDetails(task);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Status Toggle */}
                            <button
                              onClick={() => handleStatusToggle(task.id)}
                              className="text-gray-400 hover:text-green-600 transition-colors task-action-btn"
                            >
                              {task.status === "completed" ? (
                                <CheckCircle className="w-6 h-6 text-green-600" />
                              ) : (
                                <Circle className="w-6 h-6" />
                              )}
                            </button>
                            {/* Task Info */}
                            <div className="flex-1">
                              <h3
                                className={`font-medium ${
                                  task.status === "completed"
                                    ? "line-through text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                {task.description}
                              </p>
                              {/* Meta info */}
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <User className="w-4 h-4" />
                                  {task.assignedTo}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  {task.startDate ? `Start: ${task.startDate}` : null}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  End: {task.endDate}
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* Status and Priority Badges */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                task.priority ?? "medium"
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
                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={e => { e.stopPropagation(); handleEdit(task); }}
                              className="text-gray-400 hover:text-blue-600 transition-colors task-action-btn"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(task.id); }}
                              className="text-gray-400 hover:text-red-600 transition-colors task-action-btn"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Modal for Create/Edit Task */}
          {showModal && (
            <TaskModal
              open={showModal}
              editingTask={!!editingTask}
              formData={formData}
              teamMembers={teamMembers}
              onChange={handleModalChange}
              onClose={resetForm}
              onSubmit={handleSubmit}
            />
          )}
          {/* Modal for Task Details */}
          {showDetailsModal && detailsTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Task Details</h2>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <span className="block text-sm text-gray-500">Title</span>
                    <span className="font-medium text-gray-900">{detailsTask.title}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Description</span>
                    <span className="text-gray-800">{detailsTask.description}</span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Assigned To</span>
                    <span className="text-gray-800">{detailsTask.assignedTo}</span>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Start Date</span>
                      <span className="text-gray-800">{detailsTask.startDate || '-'}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">End Date</span>
                      <span className="text-gray-800">{detailsTask.endDate}</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div>
                      <span className="block text-sm text-gray-500">Priority</span>
                      <span className="text-gray-800 capitalize">{detailsTask.priority}</span>
                    </div>
                    <div>
                      <span className="block text-sm text-gray-500">Status</span>
                      <span className="text-gray-800 capitalize">{detailsTask.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
