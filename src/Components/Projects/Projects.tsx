import React, { useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Filter,
  MoreVertical,
  Calendar,
  User,
  Clock,
  GripVertical,
} from "lucide-react";
import Sidebar from "../Common/Sideber/Sidebar";
import Navbar from "../Common/Header/Navbar";
import { useGetProjectsQuery, useAddProjectMutation, useUpdateProjectMutation, useDeleteProjectMutation } from '../../services/projectApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';

interface Project {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName?: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  order: number;
  startDate?: string;
  endDate?: string;
}

const emptyForm: Omit<Project, "id" | "createdAt" | "updatedAt" | "order"> = {
  title: "",
  description: "",
  ownerId: "",
  status: "active",
  startDate: "",
  endDate: "",
};

const Projects: React.FC = () => {
  const { data: projects = [], refetch } = useGetProjectsQuery();
  const [addProjectApi] = useAddProjectMutation();
  const [updateProjectApi] = useUpdateProjectMutation();
  const [deleteProjectApi] = useDeleteProjectMutation();
  const authUser = useSelector((state: RootState) => state.auth.user);

  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);

  console.log("project data",projects )

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description) return;
    const ownerId = authUser?.id || form.ownerId || "";
    if (!ownerId) {
      alert("Owner ID missing. Please login.");
      return;
    }
    if (editingId) {
      await updateProjectApi({ id: editingId, ...form, ownerId });
      setEditingId(null);
    } else {
      await addProjectApi({ ...form, ownerId });
    }
    refetch();
    setForm(emptyForm);
    setIsModalOpen(false);
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      description: project.description,
      status: project.status,
      ownerId: authUser?.id || project.ownerId || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
    });
    setEditingId(project.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProjectApi(id);
      refetch();
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.ownerId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || project.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => a.order - b.order);

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    if (status === "active") {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    setDraggedItem(projectId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", projectId);

    // Add visual feedback to the dragged element
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedItem(null);
    setDragOverItem(null);

    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent, projectId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(projectId);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: React.DragEvent, targetProjectId: string) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetProjectId) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedProject = projects.find((p) => p.id === draggedItem);
    const targetProject = projects.find((p) => p.id === targetProjectId);

    if (!draggedProject || !targetProject) return;

    // Reorder projects
    const updatedProjects = projects.map((project) => {
      if (project.id === draggedItem) {
        return { ...project, order: targetProject.order };
      }
      if (project.id === targetProjectId) {
        return { ...project, order: draggedProject.order };
      }
      return project;
    });

    // setProjects(updatedProjects); // This line is removed as per the new_code
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Main content area */}
      <div className="flex-1 flex flex-col ">
        <Navbar title="Project" />
        <div className="flex min-h-screen bg-gray-50 ">
          {/* Content */}
          <div className="mx-auto px-8 sm:px-6 lg:px-8 py-8 w-full">
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </button>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProjects.length === 0 ? (
                <div className="col-span-full">
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 mb-2">
                      No projects found
                    </h3>
                    <p className="text-slate-500 mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={openCreateModal}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Project
                    </button>
                  </div>
                </div>
              ) : (
                filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, project.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, project.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, project.id)}
                    className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 cursor-move ${
                      draggedItem === project.id
                        ? "border-blue-400 shadow-lg scale-105"
                        : dragOverItem === project.id
                        ? "border-blue-300 shadow-md scale-102"
                        : "border-slate-200 hover:shadow-md"
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1 cursor-grab active:cursor-grabbing">
                            <GripVertical className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                              {project.title}
                            </h3>
                            <p className="text-slate-600 text-sm mb-3 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                        </div>
                        <div className="relative ml-2">
                          <button className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                            <MoreVertical className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <User className="w-4 h-4" />
                          <span>{project.ownerName ? project.ownerName : project.ownerId || "Author"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          <span>Created {formatDate(project.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          <span>Updated {formatDate(project.updatedAt)}</span>
                        </div>
                        {project.startDate && project.endDate && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>Start: {formatDate(project.startDate)}</span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            <span>End: {formatDate(project.endDate)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={getStatusBadge(project.status)}>
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(project)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Drag indicator */}
                    {draggedItem === project.id && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Dragging...
                      </div>
                    )}

                    {dragOverItem === project.id &&
                      draggedItem !== project.id && (
                        <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-dashed border-blue-300 rounded-xl flex items-center justify-center">
                          <div className="bg-blue-500 text-white text-sm px-3 py-1 rounded">
                            Drop here
                          </div>
                        </div>
                      )}
                  </div>
                ))
              )}
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {editingId ? "Edit Project" : "Create New Project"}
                      </h3>
                      <button
                        onClick={closeModal}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5 transform rotate-45" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Enter project title"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Enter project description"
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={form.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={form.endDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-5 py-2.5 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                      >
                        {editingId ? "Update Project" : "Create Project"}
                      </button>
                    </div>
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

export default Projects;
