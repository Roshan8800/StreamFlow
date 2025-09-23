import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Camera, Edit3, Heart, History, Settings, User, Mail, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, login } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || 'A passionate content enthusiast exploring new worlds through premium entertainment.',
    avatar: user?.avatar || null
  });

  const [stats] = useState({
    videosWatched: 47,
    favorites: 12,
    commentsPosted: 23,
    memberSince: '2024-01-01'
  });

  const [recentActivity] = useState([
    {
      id: 1,
      type: 'watch',
      title: 'Epic Adventure Begins',
      timestamp: '2 hours ago',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=60&fit=crop'
    },
    {
      id: 2,
      type: 'favorite',
      title: 'Mystery Unveiled',
      timestamp: '1 day ago',
      thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=100&h=60&fit=crop'
    },
    {
      id: 3,
      type: 'comment',
      title: 'Tech Revolution',
      timestamp: '2 days ago',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=60&fit=crop'
    }
  ]);

  const handleSave = () => {
    // Update user data
    const updatedUser = { ...user, ...formData };
    login(updatedUser, localStorage.getItem('playNiteToken'));
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = () => {
    // Mock avatar upload
    toast.success('Avatar upload feature coming soon!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="glass-card p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white mx-auto">
                {formData.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button
                onClick={handleAvatarChange}
                className="absolute bottom-2 right-2 w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                data-testid="change-avatar-button"
              >
                <Camera size={16} className="text-white" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-white">{formData.username}</h2>
              <p className="text-gray-400">{formData.email}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                <Calendar size={16} />
                <span>Joined {formatDate(stats.memberSince)}</span>
              </div>
            </div>

            {/* Role Badge */}
            <div className="mb-6">
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                user?.role === 'admin' 
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black' 
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
              }`}>
                {user?.role === 'admin' ? 'Administrator' : 'Premium Member'}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">{stats.videosWatched}</div>
                <div className="text-sm text-gray-400">Videos Watched</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gradient">{stats.favorites}</div>
                <div className="text-sm text-gray-400">Favorites</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="btn-primary w-full flex items-center justify-center gap-2"
                data-testid="edit-profile-button"
              >
                <Edit3 size={16} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Settings size={16} />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Profile Information */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <User size={20} />
              Profile Information
            </h3>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input"
                    data-testid="username-edit-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                    data-testid="email-edit-input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="input resize-none"
                    rows="4"
                    data-testid="bio-edit-input"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="btn-primary flex items-center gap-2"
                    data-testid="save-profile-button"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                  <p className="text-white">{formData.username}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <div className="flex items-center gap-2 text-white">
                    <Mail size={16} />
                    <span>{formData.email}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                  <p className="text-gray-300">{formData.bio}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <History size={20} />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id}
                  className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-lg transition-colors"
                  data-testid={`activity-${activity.id}`}
                >
                  <img
                    src={activity.thumbnail}
                    alt={activity.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {activity.type === 'watch' && <History size={16} className="text-blue-400" />}
                      {activity.type === 'favorite' && <Heart size={16} className="text-pink-400" />}
                      {activity.type === 'comment' && <Edit3 size={16} className="text-green-400" />}
                      
                      <span className="text-sm text-gray-400 capitalize">
                        {activity.type === 'watch' ? 'Watched' : 
                         activity.type === 'favorite' ? 'Added to favorites' : 
                         'Commented on'}
                      </span>
                    </div>
                    
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    <p className="text-sm text-gray-400">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="btn-secondary">
                View All Activity
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings size={20} />
              Preferences
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-3">Privacy Settings</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300">Show activity to others</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-gray-300">Allow comments on profile</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="rounded" />
                    <span className="text-gray-300">Receive email notifications</span>
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-white mb-3">Display Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Theme</label>
                    <select className="input">
                      <option>Dark Mode</option>
                      <option>Light Mode</option>
                      <option>Auto</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Language</label>
                    <select className="input">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white border-opacity-10">
              <button className="btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;