import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Filter, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight, Users, BarChart3, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Task } from '../../slices/taskSlice';
import Navbar from '../Common/Header/Navbar';
import Sidebar from '../Common/Sideber/Sidebar';
import { useGetProjectsQuery } from '../../services/projectApi';
import { useGetTasksQuery } from '../../services/taskApi';

// Sample data based on your structure
const initialTasks = [
  {
    "id": "687df6d61cbee635c95298a5",
    "title": "Authentication System",
    "description": "Implement user authentication and authorization",
    "status": "active",
    "createdAt": "2025-07-21T08:14:14.550Z",
    "updatedAt": "2025-07-21T08:14:14.550Z",
    "startDate": "2025-07-23T00:00:00.000Z",
    "endDate": "2025-07-31T00:00:00.000Z",
    "ownerName": "MD Tajul Islam",
    "progress": 65
  },
  {
    "id": "687df6d61cbee635c95298b1",
    "title": "Database Design",
    "description": "Design and implement database schema",
    "status": "completed",
    "createdAt": "2025-07-15T08:14:14.550Z",
    "updatedAt": "2025-07-20T08:14:14.550Z",
    "startDate": "2025-07-15T00:00:00.000Z",
    "endDate": "2025-07-25T00:00:00.000Z",
    "ownerName": "Sarah Ahmed",
    "progress": 100
  },
  {
    "id": "687df6d61cbee635c95298b2",
    "title": "Frontend Development",
    "description": "Build responsive user interface",
    "status": "pending",
    "createdAt": "2025-07-21T08:14:14.550Z",
    "updatedAt": "2025-07-21T08:14:14.550Z",
    "startDate": "2025-07-25T00:00:00.000Z",
    "endDate": "2025-08-10T00:00:00.000Z",
    "ownerName": "Ahmed Rahman",
    "progress": 0
  },
  {
    "id": "687df6d61cbee635c95298b3",
    "title": "API Integration",
    "description": "Integrate third-party APIs",
    "status": "active",
    "createdAt": "2025-07-18T08:14:14.550Z",
    "updatedAt": "2025-07-21T08:14:14.550Z",
    "startDate": "2025-07-20T00:00:00.000Z",
    "endDate": "2025-08-05T00:00:00.000Z",
    "ownerName": "Fatima Khan",
    "progress": 30
  },
  {
    "id": "687df6d61cbee635c95298b4",
    "title": "Testing & QA",
    "description": "Comprehensive testing and quality assurance",
    "status": "pending",
    "createdAt": "2025-07-21T08:14:14.550Z",
    "updatedAt": "2025-07-21T08:14:14.550Z",
    "startDate": "2025-08-01T00:00:00.000Z",
    "endDate": "2025-08-15T00:00:00.000Z",
    "ownerName": "Mohammad Rahim",
    "progress": 0
  }
];

const Timeline = () => {
  const [tasks] = useState(initialTasks);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewMode, setViewMode] = useState('weeks');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: projects = [] } = useGetProjectsQuery();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const { data: apiTasksRaw = [] } = useGetTasksQuery();
  const apiTasks: Task[] = Array.isArray(apiTasksRaw) ? apiTasksRaw : Array.isArray((apiTasksRaw as any)?.data) ? (apiTasksRaw as any).data : [];

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { 
          icon: CheckCircle, 
          color: 'text-green-600', 
          bg: 'bg-green-50 border-green-200',
          badge: 'bg-green-100 text-green-800'
        };
      case 'active':
        return { 
          icon: Clock, 
          color: 'text-blue-600', 
          bg: 'bg-blue-50 border-blue-200',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'pending':
        return { 
          icon: Circle, 
          color: 'text-gray-600', 
          bg: 'bg-gray-50 border-gray-200',
          badge: 'bg-gray-100 text-gray-800'
        };
      default:
        return { 
          icon: AlertCircle, 
          color: 'text-orange-600', 
          bg: 'bg-orange-50 border-orange-200',
          badge: 'bg-orange-100 text-orange-800'
        };
    }
  };

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return filterStatus === 'all' ? apiTasks : apiTasks.filter((task: Task) => task.status === filterStatus);
  }, [apiTasks, filterStatus]);

  // Calculate timeline range
  const getTimelineRange = () => {
    const allDates = apiTasks.flatMap((task: Task) => [
      new Date((task as any).startDate),
      new Date((task as any).endDate)
    ]);
    
    if (allDates.length === 0) {
      const today = new Date();
      return { minDate: today, maxDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000) };
    }
    
    const minDate = new Date(Math.min(...allDates.map((d: Date) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d: Date) => d.getTime())));
    
    // Add padding
    minDate.setDate(minDate.getDate() - 3);
    maxDate.setDate(maxDate.getDate() + 3);
    
    return { minDate, maxDate };
  };

  // Generate timeline columns
  const generateTimelineColumns = () => {
    const { minDate, maxDate } = getTimelineRange();
    const columns = [];
    const currentDate = new Date(minDate);
    if (viewMode === 'days') {
      for (let i = 0; i < 7; i++) {
        columns.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return columns;
    }
    while (currentDate <= maxDate) {
      columns.push(new Date(currentDate));
      if (viewMode === 'weeks') {
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
    
    // Use (task as any).startDate and (task as any).endDate to avoid TS2339
    const taskStart = new Date((task as any).startDate);
    const taskEnd = new Date((task as any).endDate);
    
    // Find start and end positions
    let startIndex = 0;
    let endIndex = 0;
    
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] <= taskStart) {
        startIndex = i;
      }
      if (columns[i] <= taskEnd) {
        endIndex = i;
      }
    }
    
    const width = Math.max(columnWidth * 0.8, (endIndex - startIndex + 1) * columnWidth * 0.8);
    
    return {
      left: startIndex * columnWidth + columnWidth * 0.1,
      width: width,
    };
  };

  // Get task bar color based on status
  const getTaskBarColor = (task: Task) => {
    switch (task.status) {
      case 'completed':
        return 'bg-green-600';
      case 'active':
        return 'bg-[#50B800]';
      case 'pending':
        return 'bg-gray-500';
      default:
        return 'bg-orange-500';
    }
  };

  // Project Gantt helpers
  const getProjectTimelineRange = () => {
    const allDates = projects
      .map(project => [project.startDate, project.endDate])
      .flat()
      .filter(Boolean)
      .map(date => new Date(date!));
    if (allDates.length === 0) {
      const today = new Date();
      return { minDate: today, maxDate: today };
    }
    const minDate = new Date(Math.min(...allDates.map((d: Date) => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map((d: Date) => d.getTime())));
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);
    return { minDate, maxDate };
  };
  const generateProjectTimelineColumns = () => {
    const { minDate, maxDate } = getProjectTimelineRange();
    const columns = [];
    const currentDate = new Date(minDate);
    if (viewMode === 'days') {
      for (let i = 0; i < 10; i++) {
        columns.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return columns;
    }
    while (currentDate <= maxDate) {
      columns.push(new Date(currentDate));
      if (viewMode === 'weeks') {
        currentDate.setDate(currentDate.getDate() + 7);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    return columns;
  };
  const calculateProjectBarPosition = (project: any) => {
    const { minDate } = getProjectTimelineRange();
    const columns = generateProjectTimelineColumns();
    const columnWidth = 120 * zoomLevel;
    const start = project.startDate ? new Date(project.startDate) : new Date();
    const end = project.endDate ? new Date(project.endDate) : new Date();
    let startIndex = 0;
    let endIndex = 0;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i] <= start) startIndex = i;
      if (columns[i] <= end) endIndex = i;
    }
    const left = startIndex * columnWidth;
    const width = (endIndex - startIndex + 1) * columnWidth;
    return { left, width };
  };

  const timelineColumns = generateTimelineColumns();
  // Use apiTasks instead of local tasks for stats
  const stats = {
    total: apiTasks.length,
    completed: apiTasks.filter((t: Task) => t.status === 'completed').length,
    active: apiTasks.filter((t: Task) => t.status === 'active').length,
    pending: apiTasks.filter((t: Task) => t.status === 'pending').length,
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <Navbar title="Timeline" />
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="mx-auto space-y-6">
            
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Project Timeline
                    </h1>
                    <p className="text-gray-600">Dynamic project management dashboard</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode */}
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>

                  {/* Filter */}
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="text-sm focus:outline-none bg-transparent"
                    >
                      <option value="all">All Tasks</option>
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm">
                    <button
                      onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
                      className="p-2 hover:bg-gray-50 rounded-l-xl transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-2 text-sm border-x border-gray-200 font-medium">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.25))}
                      className="p-2 hover:bg-gray-50 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel(1)}
                      className="p-2 hover:bg-gray-50 rounded-r-xl transition-colors border-l border-gray-200"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#50B800] rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                    <div className="text-gray-600 text-sm">Total Tasks</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.completed}</div>
                    <div className="text-gray-600 text-sm">Completed</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                    <div className="text-gray-600 text-sm">Active</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center">
                    <Circle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
                    <div className="text-gray-600 text-sm">Pending</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gantt Chart */}
            <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Gantt Chart
                </h2>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  {/* Timeline Header */}
                  <div className="flex border-b border-gray-200 bg-gray-50">
                    <div className="w-80 p-4 font-semibold text-gray-900 border-r border-gray-200">
                      Project
                    </div>
                    <div className="flex-1 flex">
                      {generateProjectTimelineColumns().map((date, index) => (
                        <div
                          key={index}
                          className="border-r border-gray-200 p-2 text-center text-sm font-medium text-gray-700"
                          style={{
                            width: `${120 * zoomLevel}px`,
                            minWidth: `${120 * zoomLevel}px`,
                          }}
                        >
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Projects */}
                  <div className="relative">
                    {projects.filter(p => p.startDate && p.endDate).map((project) => {
                      const position = calculateProjectBarPosition(project);
                      return (
                        <div
                          key={project.id}
                          className="flex items-center border-b border-gray-200 hover:bg-blue-50 cursor-pointer"
                          onClick={() => setSelectedProject(project)}
                        >
                          {/* Project Info */}
                          <div className="w-80 p-4 border-r border-gray-200">
                            <div className="font-medium text-gray-900">{project.title}</div>
                            <div className="text-sm text-gray-600">
                              {project.startDate && project.endDate
                                ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`
                                : "No date set"}
                            </div>
                          </div>
                          {/* Timeline Bar */}
                          <div className="flex-1 relative h-10 flex items-center overflow-x-auto">
                            <div
                              className="absolute h-6 rounded-lg bg-blue-400 opacity-80 flex items-center justify-center text-white text-xs font-medium shadow"
                              style={{
                                left: `${position.left}px`,
                                width: `${position.width}px`,
                              }}
                            >
                              {project.title}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Task Details Panel */}
            {selectedTask && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
                {(() => {
                  const task = apiTasks.find((t: Task) => t.id === selectedTask);
                  if (!task) return null;
                  
                  const statusConfig = getStatusConfig(task.status ?? '');
                  const StatusIcon = statusConfig.icon;
                  
                  return (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-900">Task Details</h3>
                        <button
                          onClick={() => setSelectedTask(null)}
                          className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl border-2 ${statusConfig.bg}`}>
                            <div className="flex items-center gap-3 mb-3">
                              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
                              <h4 className="text-xl font-bold text-gray-900">{task.title}</h4>
                            </div>
                            <p className="text-gray-700">{task.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <span className="text-sm font-medium text-gray-500">Owner</span>
                              <p className="text-lg font-semibold text-gray-900">{(task as any).ownerName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <span className="text-sm font-medium text-gray-500">Status</span>
                              <p className="text-lg font-semibold text-gray-900 capitalize">{task.status}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="bg-blue-50 p-4 rounded-xl">
                            <span className="text-sm font-medium text-gray-500">Progress</span>
                            <div className="mt-2">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-2xl font-bold text-gray-900">{(task as any).progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className={`h-3 rounded-full ${getTaskBarColor(task)}`}
                                  style={{ width: `${(task as any).progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <span className="text-sm font-medium text-gray-500">Start Date</span>
                              <p className="text-lg font-semibold text-gray-900">
                                {new Date((task as any).startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl">
                              <span className="text-sm font-medium text-gray-500">End Date</span>
                              <p className="text-lg font-semibold text-gray-900">
                                {new Date((task as any).endDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Project Details</h2>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <span className="block text-sm text-gray-500">Title</span>
                <span className="font-medium text-gray-900">{selectedProject.title}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Description</span>
                <span className="text-gray-800">{selectedProject.description}</span>
              </div>
              <div className="flex gap-4">
                <div>
                  <span className="block text-sm text-gray-500">Start Date</span>
                  <span className="text-gray-800">{selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : '-'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-500">End Date</span>
                  <span className="text-gray-800">{selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : '-'}</span>
                </div>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Owner</span>
                <span className="text-gray-800">{selectedProject.ownerName || selectedProject.ownerId || '-'}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Status</span>
                <span className="text-gray-800 capitalize">{selectedProject.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timeline;