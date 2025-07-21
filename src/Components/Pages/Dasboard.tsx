import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Users, 
  BarChart3, 
  TrendingUp, 
  AlertCircle,
  Eye,
  Edit3,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import Navbar from '../Common/Header/Navbar';
import Sidebar from '../Common/Sideber/Sidebar';

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

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "API Integration",
      description: "Integrate payment gateway API",
      assignedTo: "John Doe",
      priority: "high",
      status: "in-progress",
      startDate: "2024-07-25",
      endDate: "2024-07-25",
      progress: 75,
      dependencies: [],
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "2",
      title: "UI/UX Design",
      description: "Create dashboard mockups",
      assignedTo: "Jane Smith",
      priority: "medium",
      status: "pending",
      startDate: "2024-07-30",
      endDate: "2024-07-30",
      progress: 25,
      dependencies: ["1"],
      color: "bg-gray-100 text-gray-800"
    },
    {
      id: "3",
      title: "Database Migration",
      description: "Migrate old data to new schema",
      assignedTo: "Mike Johnson",
      priority: "low",
      status: "completed",
      startDate: "2024-07-20",
      endDate: "2024-07-20",
      progress: 100,
      dependencies: [],
      color: "bg-green-100 text-green-800"
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Mock real-time presence simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => 
        prevTasks.map(task => ({
          ...task,
          // Remove or comment out any code that references task.viewers or task.editor
          // For example:
          // - Remove any <div> or logic that uses task.viewers or task.editor
          // - If you want to show presence, use a different approach or add those fields to the Task type
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

  const TaskCard = ({ task }: { task: Task }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Real-time Presence */}
          {/* Remove or comment out any code that references task.viewers or task.editor */}
          {/* For example:
          {(task.viewers.length > 0 || task.editor) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              {task.editor && (
                <div className="flex items-center gap-1">
                  <Edit3 className="w-3 h-3 text-green-500" />
                  <span>{task.editor} is editing</span>
                </div>
              )}
              {task.viewers.length > 0 && (
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-blue-500" />
                  <span>{task.viewers.length} viewing</span>
                </div>
              )}
            </div>
          )} */}
        </div>
        
        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{task.assignedTo}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{task.endDate}</span>
        </div>
      </div>
      
      {/* Dependencies */}
      {task.dependencies.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4" />
            <span>Depends on: Task {task.dependencies.join(', ')}</span>
          </div>
        </div>
      )}
    </div>
  );

  const GanttChart = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
      <div className="space-y-3">
        {tasks.map((task: Task) => (
          <div key={task.id} className="flex items-center gap-4">
            <div className="w-32 text-sm font-medium text-gray-700">{task.title}</div>
            <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
              <div 
                className={`h-6 rounded-full ${
                  task.status === 'completed' ? 'bg-green-500' : 
                  task.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: `${task.progress}%` }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium">
                {task.progress}%
              </div>
            </div>
            <div className="text-xs text-gray-500">{task.endDate}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
    <div className="flex-1 flex flex-col">
      <Navbar title="Dashboard" />
      
        <div className="flex-1 p-6">
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Management Dashboard</h1>
        <p className="text-gray-600">Manage your projects and track progress in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="mb-8">
        <GanttChart />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Tasks</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTasks.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Task</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Task description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 