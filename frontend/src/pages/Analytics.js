import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Video, 
  Eye, 
  MessageSquare,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analytics, setAnalytics] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics = {
      overview: {
        totalViews: 245830,
        totalUsers: 1247,
        totalVideos: 89,
        totalComments: 3421,
        viewsChange: 15.2,
        usersChange: 8.7,
        videosChange: 12.3,
        commentsChange: 22.1
      },
      topVideos: [
        {
          id: '1',
          title: 'Epic Adventure Begins',
          views: 45200,
          likes: 2890,
          comments: 156,
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=60&fit=crop'
        },
        {
          id: '2',
          title: 'Mystery Unveiled',
          views: 23100,
          likes: 1205,
          comments: 89,
          thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=100&h=60&fit=crop'
        },
        {
          id: '3',
          title: 'Comedy Night Special',
          views: 18500,
          likes: 987,
          comments: 67,
          thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=100&h=60&fit=crop'
        }
      ],
      userGrowth: [
        { date: '2024-01-15', users: 980 },
        { date: '2024-01-16', users: 1020 },
        { date: '2024-01-17', users: 1085 },
        { date: '2024-01-18', users: 1134 },
        { date: '2024-01-19', users: 1198 },
        { date: '2024-01-20', users: 1225 },
        { date: '2024-01-21', users: 1247 }
      ],
      viewsByCategory: [
        { category: 'Adventure', views: 89420, percentage: 36.4 },
        { category: 'Comedy', views: 67830, percentage: 27.6 },
        { category: 'Mystery', views: 45230, percentage: 18.4 },
        { category: 'Tech', views: 28350, percentage: 11.5 },
        { category: 'Documentary', views: 15000, percentage: 6.1 }
      ],
      deviceStats: [
        { device: 'Desktop', percentage: 45.2 },
        { device: 'Mobile', percentage: 38.7 },
        { device: 'Tablet', percentage: 16.1 }
      ]
    };

    setTimeout(() => {
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Track your platform's performance and growth</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
            data-testid="time-range-select"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="btn-secondary flex items-center gap-2" data-testid="refresh-data-button">
            <RefreshCw size={16} />
            Refresh
          </button>
          
          <button className="btn-primary flex items-center gap-2" data-testid="export-data-button">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="admin-grid mb-8">
        <div className="glass-card stat-card" data-testid="views-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Eye size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(analytics.overview.totalViews)}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+{analytics.overview.viewsChange}% vs last period</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="users-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(analytics.overview.totalUsers)}</div>
              <div className="stat-label">Active Users</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+{analytics.overview.usersChange}% vs last period</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="videos-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
              <Video size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(analytics.overview.totalVideos)}</div>
              <div className="stat-label">Total Videos</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+{analytics.overview.videosChange}% vs last period</span>
          </div>
        </div>

        <div className="glass-card stat-card" data-testid="comments-stat">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <MessageSquare size={24} className="text-white" />
            </div>
            <div className="text-right">
              <div className="stat-value">{formatNumber(analytics.overview.totalComments)}</div>
              <div className="stat-label">Total Comments</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-green-400" />
            <span className="text-green-400">+{analytics.overview.commentsChange}% vs last period</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* User Growth Chart */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 size={20} />
              User Growth
            </h2>
            
            <div className="h-64 flex items-end justify-between gap-2">
              {analytics.userGrowth.map((data, index) => {
                const height = (data.users / Math.max(...analytics.userGrowth.map(d => d.users))) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="text-xs text-gray-400 mb-2">{data.users}</div>
                    <div 
                      className="w-full bg-gradient-to-t from-pink-500 to-purple-600 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{formatDate(data.date)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Videos */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Video size={20} />
              Top Performing Videos
            </h2>
            
            <div className="space-y-4">
              {analytics.topVideos.map((video, index) => (
                <div 
                  key={video.id}
                  className="flex items-center gap-4 p-4 hover:bg-white hover:bg-opacity-5 rounded-lg transition-colors"
                  data-testid={`top-video-${index}`}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-16 h-10 object-cover rounded"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-white">{video.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatNumber(video.views)} views</span>
                      <span>{formatNumber(video.likes)} likes</span>
                      <span>{video.comments} comments</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Views by Category */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Views by Category</h2>
            
            <div className="space-y-4">
              {analytics.viewsByCategory.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{item.category}</span>
                    <span className="text-white">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Statistics */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Device Usage</h2>
            
            <div className="space-y-4">
              {analytics.deviceStats.map((device) => (
                <div key={device.device} className="flex items-center justify-between">
                  <span className="text-gray-300">{device.device}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm font-medium w-12 text-right">
                      {device.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6">Performance Metrics</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Avg. Session Duration</span>
                <span className="text-white font-medium">12m 34s</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Bounce Rate</span>
                <span className="text-white font-medium">24.7%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Page Load Time</span>
                <span className="text-white font-medium">1.8s</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">User Retention</span>
                <span className="text-white font-medium">68.9%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;