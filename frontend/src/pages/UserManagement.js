import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Ban, 
  Shield, 
  Mail, 
  Calendar,
  Users,
  Eye,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  useEffect(() => {
    // Mock user data
    const mockUsers = [
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-15T10:30:00Z',
        lastActive: '2024-01-20T14:20:00Z',
        videosWatched: 47,
        favorites: 12,
        comments: 23,
        avatar: 'JD'
      },
      {
        id: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-10T09:15:00Z',
        lastActive: '2024-01-21T11:45:00Z',
        videosWatched: 89,
        favorites: 34,
        comments: 56,
        avatar: 'JS'
      },
      {
        id: '3',
        username: 'admin_user',
        email: 'admin@playnite.com',
        role: 'admin',
        status: 'active',
        joinDate: '2024-01-01T00:00:00Z',
        lastActive: '2024-01-21T16:30:00Z',
        videosWatched: 156,
        favorites: 67,
        comments: 89,
        avatar: 'AU'
      },
      {
        id: '4',
        username: 'suspended_user',
        email: 'suspended@example.com',
        role: 'user',
        status: 'suspended',
        joinDate: '2024-01-08T12:00:00Z',
        lastActive: '2024-01-18T10:20:00Z',
        videosWatched: 23,
        favorites: 5,
        comments: 12,
        avatar: 'SU'
      },
      {
        id: '5',
        username: 'new_member',
        email: 'new@example.com',
        role: 'user',
        status: 'pending',
        joinDate: '2024-01-20T18:45:00Z',
        lastActive: '2024-01-20T18:45:00Z',
        videosWatched: 2,
        favorites: 0,
        comments: 1,
        avatar: 'NM'
      }
    ];

    setUsers(mockUsers);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'suspended':
        return 'text-red-400 bg-red-900 bg-opacity-20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-900 bg-opacity-20';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleUserAction = (userId, action) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: action === 'activate' ? 'active' : 'suspended' }
        : user
    ));
    
    const actionText = action === 'activate' ? 'activated' : 'suspended';
    toast.success(`User ${actionText} successfully!`);
  };

  const handleBulkAction = (action) => {
    setUsers(prev => prev.map(user => 
      selectedUsers.includes(user.id)
        ? { ...user, status: action === 'activate' ? 'active' : 'suspended' }
        : user
    ));
    
    setSelectedUsers([]);
    setShowBulkActions(false);
    toast.success(`Bulk action completed for ${selectedUsers.length} users!`);
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">User Management</h1>
          <p className="text-gray-400">Manage and monitor user accounts</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="btn-primary flex items-center gap-2" data-testid="add-user-button">
            <Users size={16} />
            Add User
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
              data-testid="user-search-input"
            />
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
              data-testid="status-filter"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input"
              data-testid="role-filter"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={16} />
            More Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {showBulkActions && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-pink-500 bg-opacity-10 rounded-lg border border-pink-500 border-opacity-30">
            <span className="text-pink-400 font-medium">
              {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="btn-ghost text-green-400 hover:bg-green-500 hover:bg-opacity-20 px-3 py-1 text-sm"
                data-testid="bulk-activate-button"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('suspend')}
                className="btn-ghost text-red-400 hover:bg-red-500 hover:bg-opacity-20 px-3 py-1 text-sm"
                data-testid="bulk-suspend-button"
              >
                Suspend
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="btn-ghost text-gray-400 px-3 py-1 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white bg-opacity-5">
              <tr>
                <th className="text-left p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded"
                    data-testid="select-all-checkbox"
                  />
                </th>
                <th className="text-left p-4 text-gray-300 font-medium">User</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Role</th>
                <th className="text-left p-4 text-gray-300 font-medium">Activity</th>
                <th className="text-left p-4 text-gray-300 font-medium">Joined</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr 
                  key={user.id}
                  className="border-t border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors"
                  data-testid={`user-row-${user.id}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded"
                    />
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{user.username}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'text-yellow-400 bg-yellow-900 bg-opacity-20' 
                        : 'text-blue-400 bg-blue-900 bg-opacity-20'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' : 'User'}
                    </span>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="text-white">{user.videosWatched} videos</div>
                      <div className="text-gray-400">{user.comments} comments</div>
                    </div>
                  </td>
                  
                  <td className="p-4 text-sm text-gray-300">
                    {formatDate(user.joinDate)}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="btn-ghost p-2 hover:bg-blue-500 hover:bg-opacity-20 text-blue-400"
                        title="View Profile"
                        data-testid={`view-user-${user.id}`}
                      >
                        <Eye size={16} />
                      </button>
                      
                      <button
                        className="btn-ghost p-2 hover:bg-green-500 hover:bg-opacity-20 text-green-400"
                        title="Edit User"
                        data-testid={`edit-user-${user.id}`}
                      >
                        <Edit3 size={16} />
                      </button>
                      
                      {user.status === 'active' ? (
                        <button
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="btn-ghost p-2 hover:bg-red-500 hover:bg-opacity-20 text-red-400"
                          title="Suspend User"
                          data-testid={`suspend-user-${user.id}`}
                        >
                          <Ban size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="btn-ghost p-2 hover:bg-green-500 hover:bg-opacity-20 text-green-400"
                          title="Activate User"
                          data-testid={`activate-user-${user.id}`}
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-400">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          
          <div className="flex items-center gap-2">
            <button className="btn-ghost px-3 py-1">Previous</button>
            <button className="btn-primary px-3 py-1">1</button>
            <button className="btn-ghost px-3 py-1">2</button>
            <button className="btn-ghost px-3 py-1">3</button>
            <button className="btn-ghost px-3 py-1">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;