import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  BarChart3,
  Users,
  Video,
  Upload,
  Settings,
  Database,
  FileText,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  Activity,
  ExternalLink,
  Check
} from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import type { Video as VideoType, Category } from '@/shared/types';

export default function AdminPage() {
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalUsers: 0,
    totalViews: 0,
    totalCategories: 0
  });
  const [loading, setLoading] = useState(true);

  // Check if user is admin (for demo purposes, assuming admin email)
  const isAdmin = user?.email === 'admin@streamflow.com' || user?.email?.includes('admin');

  useEffect(() => {
    if (user && isAdmin) {
      fetchAdminData();
    }
  }, [user, isAdmin]);

  const fetchAdminData = async () => {
    try {
      // Fetch videos
      const videosResponse = await fetch('/api/videos?limit=100');
      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        setVideos(videosData.videos || []);
        setStats(prev => ({ ...prev, totalVideos: videosData.videos?.length || 0 }));
      }

      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        setStats(prev => ({ ...prev, totalCategories: categoriesData.length }));
      }

      // Calculate total views
      const totalViews = videos.reduce((sum, video) => sum + video.view_count, 0);
      setStats(prev => ({ ...prev, totalViews }));
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please sign in to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Admin Access Required</h2>
          <p className="text-gray-400">You don't have permission to access the admin panel.</p>
          <p className="text-gray-500 text-sm mt-2">Contact support if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'videos', label: 'Videos', icon: Video },
    { id: 'categories', label: 'Categories', icon: FileText },
    { id: 'content', label: 'Content Review', icon: Eye },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Manage your StreamFlow platform</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-gray-900/50 rounded-xl p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Videos</p>
                        <p className="text-2xl font-bold text-white">{stats.totalVideos}</p>
                      </div>
                      <Video className="w-8 h-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Categories</p>
                        <p className="text-2xl font-bold text-white">{stats.totalCategories}</p>
                      </div>
                      <FileText className="w-8 h-8 text-green-500" />
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Total Views</p>
                        <p className="text-2xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                      </div>
                      <Eye className="w-8 h-8 text-purple-500" />
                    </div>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Active Users</p>
                        <p className="text-2xl font-bold text-white">1,234</p>
                      </div>
                      <Users className="w-8 h-8 text-yellow-500" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                    <Activity className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Video uploaded', item: 'New Technology Tutorial', time: '2 hours ago' },
                      { action: 'Category created', item: 'Web Development', time: '4 hours ago' },
                      { action: 'User registered', item: 'john.doe@example.com', time: '6 hours ago' },
                      { action: 'Video viewed', item: 'React Best Practices', time: '8 hours ago' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                        <div>
                          <p className="text-white font-medium">{activity.action}</p>
                          <p className="text-gray-400 text-sm">{activity.item}</p>
                        </div>
                        <span className="text-gray-500 text-sm">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Video Management</h2>
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Video</span>
                  </button>
                </div>

                <div className="bg-gray-900/50 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Video</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Quality</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700">
                        {videos.slice(0, 10).map((video) => (
                          <tr key={video.id} className="hover:bg-gray-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-8 bg-gray-700 rounded overflow-hidden">
                                  {video.thumbnail_url ? (
                                    <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-600"></div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-white font-medium">{video.title}</p>
                                  <p className="text-gray-400 text-sm">{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-gray-300">{(video as any).category_name || 'Uncategorized'}</td>
                            <td className="px-6 py-4 text-gray-300">{video.view_count.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-sm">{video.quality}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-400 hover:text-blue-300">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="text-red-400 hover:text-red-300">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Category Management</h2>
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-gray-900/50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-3">{category.description || 'No description'}</p>
                      <div className="text-xs text-gray-500">
                        Slug: {category.slug}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white">Content Upload</h2>

                <div className="bg-gray-900/50 rounded-xl p-8">
                  <div className="text-center py-12">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Upload Content</h3>
                    <p className="text-gray-400 mb-6">
                      Upload videos, manage metadata, and organize your content library.
                    </p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                      Select Files to Upload
                    </button>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center space-x-3 p-4 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                      <Video className="w-5 h-5 text-blue-400" />
                      <span className="text-white">Bulk Upload</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                      <Database className="w-5 h-5 text-green-400" />
                      <span className="text-white">Import Metadata</span>
                    </button>
                    <button className="flex items-center space-x-3 p-4 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <span className="text-white">Upload Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Content Review & Management</h2>
                  <a
                    href="/admin/content-manager"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Open Content Manager</span>
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Pending Submissions</h3>
                      <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">12</p>
                    <p className="text-gray-400 text-sm">Awaiting review</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Video Embeds</h3>
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <Video className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">3</p>
                    <p className="text-gray-400 text-sm">Active embeds</p>
                  </div>

                  <div className="bg-gray-900/50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">External Links</h3>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-2">4</p>
                    <p className="text-gray-400 text-sm">Active links</p>
                  </div>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Content Management Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white">YouTube embed validation</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white">External link security checks</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white">Automated content categorization</span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-lg">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-white">Tag management system</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'users' || activeTab === 'settings') && (
              <div className="bg-gray-900/50 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'users' ? <Users className="w-8 h-8 text-gray-400" /> : <Settings className="w-8 h-8 text-gray-400" />}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activeTab === 'users' ? 'User Management' : 'Settings'}
                </h3>
                <p className="text-gray-400">
                  This section is under development. More features coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
