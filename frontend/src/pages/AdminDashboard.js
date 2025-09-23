import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Video, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  Shield
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalViews: 0,
    totalComments: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockStats = {
      totalUsers: 1247,
      totalVideos: 89,
      totalViews: 125420,
      totalComments: 3421
    };

    const mockRecentActivity = [
      {
        id: 1,
        type: 'user_joined',
        description: 'New user registered: john_doe',
        timestamp: '5 minutes ago',
        icon: Users
      },
      {
        id: 2,
        type: 'video_uploaded',
        description: 'New video uploaded: Epic Adventure',
        timestamp: '15 minutes ago',
        icon: Video
      },
      {
        id: 3,
        type: 'comment_reported',
        description: 'Comment reported by user for review',
        timestamp: '30 minutes ago',
        icon: AlertTriangle
      },
      {
        id: 4,
        type: 'user_banned',
        description: 'User banned for policy violation',
        timestamp: '1 hour ago',
        icon: Shield
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High Server Load',
        description: 'Server CPU usage is above 80%',
        timestamp: '10 minutes ago'
      },
      {
        id: 2,
        type: 'info',
        title: 'Pending Content Reviews',
        description: '5 videos are waiting for approval',
        timestamp: '2 hours ago'
      },
      {
        id: 3,
        type: 'error',
        title: 'Failed Uploads',
        description: '3 video uploads failed in the last hour',
        timestamp: '3 hours ago'
      }
    ];

    setStats(mockStats);
    setRecentActivity(mockRecentActivity);
    setAlerts(mockAlerts);
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor and manage your PlayNite platform</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-grid mb-8">
        <div className="glass-card stat-card" data-testid="total-users-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(stats.totalUsers)}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+12% from last month</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="total-videos-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(stats.totalVideos)}</div>
              <div className="stat-label">Total Videos</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+8% from last month</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="total-views-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(stats.totalViews)}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+25% from last month</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="total-comments-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(stats.totalComments)}</div>
              <div className="stat-label">Total Comments</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+18% from last month</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock size={20} />
                Recent Activity
              </h2>
              <Link to="/admin/activity" className="text-pink-400 hover:text-pink-300 text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div 
                    key={activity.id}
                    className="flex items-start gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-lg transition-colors"
                    data-testid={`activity-${activity.id}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'user_joined' ? 'bg-blue-500' :
                      activity.type === 'video_uploaded' ? 'bg-purple-500' :
                      activity.type === 'comment_reported' ? 'bg-orange-500' :
                      'bg-red-500'
                    }`}>
                      <Icon size={16} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-white">{activity.description}</p>
                      <p className="text-sm text-gray-400">{activity.timestamp}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={20} />
              System Alerts
            </h2>

            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'error' ? 'bg-red-900 bg-opacity-20 border-red-500' :
                    alert.type === 'warning' ? 'bg-yellow-900 bg-opacity-20 border-yellow-500' :
                    'bg-blue-900 bg-opacity-20 border-blue-500'
                  }`}
                  data-testid={`alert-${alert.id}`}
                >
                  <h4 className="font-semibold text-white mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                  <p className="text-xs text-gray-400">{alert.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to="/admin/videos"
                className="btn-primary w-full flex items-center justify-center gap-2"
                data-testid="manage-videos-link"
              >
                <Video size={16} />
                Manage Videos
              </Link>
              
              <Link
                to="/admin/users"
                className="btn-secondary w-full flex items-center justify-center gap-2"
                data-testid="manage-users-link"
              >
                <Users size={16} />
                Manage Users
              </Link>
              
              <Link
                to="/admin/analytics"
                className="btn-secondary w-full flex items-center justify-center gap-2"
                data-testid="view-analytics-link"
              >
                <BarChart3 size={16} />
                View Analytics
              </Link>
              
              <button className="btn-secondary w-full flex items-center justify-center gap-2">
                <Calendar size={16} />
                Schedule Content
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">System Health</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Server CPU</span>
                  <span className="text-white">65%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-[65%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Memory Usage</span>
                  <span className="text-white">78%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-[78%]"></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Storage</span>
                  <span className="text-white">45%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full w-[45%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;