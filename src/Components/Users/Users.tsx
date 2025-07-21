import React, { useState } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Mail, 
  Shield, 
  Search,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Filter,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import Sidebar from "../Common/Sideber/Sidebar";
import Navbar from "../Common/Header/Navbar";
import { useGetUsersQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../../services/userApi';
import type { User } from '../../slices/userSlice';

// Remove ExtendedUser, use UserForm for form state

type UserForm = {
  name: string;
  email: string;
  role: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  status?: number;
};

const emptyForm: UserForm = {
  name: '',
  email: '',
  role: 'member',
  password: '',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: 1,
};

const Users: React.FC = () => {
  // API hooks
  const { data: users = [], refetch } = useGetUsersQuery();
  const [addUserApi] = useAddUserMutation();
  const [updateUserApi] = useUpdateUserMutation();
  const [deleteUserApi] = useDeleteUserMutation();

  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear password error when user starts typing
    if (name === 'password' && passwordError) {
      setPasswordError('');
    }
  };

  const validatePassword = (password: string): boolean => {
    // if (!password) {
    //   setPasswordError('Password is required');
    //   return false;
    // }
    
    // if (password.length < 6) {
    //   setPasswordError('Password must be at least 6 characters long');
    //   return false;
    // }
    
    // // Check for at least one uppercase letter, one lowercase letter, and one number
    // const hasUppercase = /[A-Z]/.test(password);
    // const hasLowercase = /[a-z]/.test(password);
    // const hasNumber = /\d/.test(password);
    
    // if (!hasUppercase || !hasLowercase || !hasNumber) {
    //   setPasswordError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
    //   return false;
    // }
    
    // setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    if (editingId) {
      // Update user via API
      await updateUserApi({ id: editingId, ...form });
      setEditingId(null);
    } else {
      // Add user via API
      await addUserApi(form);
    }
    refetch();
    setForm(emptyForm);
    setIsModalOpen(false);
    setPasswordError('');
  };

  const handleEdit = (user: User) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '', // Don't populate password for security
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      status: user.status,
    });
    setEditingId(user.id);
    setIsModalOpen(true);
    setPasswordError('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      await deleteUserApi(id);
      refetch();
    }
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingId(null);
    setIsModalOpen(true);
    setPasswordError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setShowPassword(false);
    setPasswordError('');
  };

  const getFilteredUsers = () => {
    let filtered = users;
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-[#51B700] text-[#51B700]';
      case 'member': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar title="Users" />

        <div className="flex-1 p-6">
          {/* Header Controls */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  User Management
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Filter:</span>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#51B700]"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="member">Member</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#51B700]"
                  />
                </div>

                <button
                  onClick={openCreateModal}
                  className="px-4 py-2 bg-[#51B700] text-white rounded-lg hover:bg-[#51B700] flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#51B700] rounded-full flex items-center justify-center">
                  <UsersIcon className="w-5 h-5 text-[#000000]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {users.length}
                  </div>
                  <div className="text-gray-600">Total Users</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'admin').length}
                  </div>
                  <div className="text-gray-600">Admins</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#51B700] rounded-full flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-[#000000]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'manager').length}
                  </div>
                  <div className="text-gray-600">Managers</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <UserX className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {users.filter(u => u.role === 'member').length}
                  </div>
                  <div className="text-gray-600">Members</div>
                </div>
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                All Users
              </h2>
            </div>

            {filteredUsers.length === 0 ? (
              <div className="text-center py-16">
                <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterRole !== 'all' ? 'Try adjusting your search or filter' : 'Get started by adding your first user'}
                </p>
                {!searchTerm && filterRole === 'all' && (
                  <button
                    onClick={openCreateModal}
                    className="inline-flex items-center px-4 py-2 bg-[#51B700] text-white rounded-lg hover:bg-[#51B700] transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add User
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#52b7002f] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#51B700] to-[#51B700] flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-900">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-[#51B700] hover:text-[#51B700] mr-4 p-1 rounded-full hover:bg-[#51B700] transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51B700] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51B700] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingId ? 'New Password (leave blank to keep current)' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={editingId ? "Enter new password (optional)" : "Enter password"}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51B700] focus:border-transparent ${
                      passwordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required={!editingId}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
                {!editingId && (
                  <p className="mt-1 text-xs text-gray-500">
                    Password must be at least 6 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51B700] focus:border-transparent"
                >
                  <option value="MEMBER">Member</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#51B700] text-white rounded-lg hover:bg-[#51B700]"
                >
                  {editingId ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;