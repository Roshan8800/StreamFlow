import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Users,
  Video,
  Heart,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

interface AnalyticsData {
  views: { date: string; count: number }[];
  engagement: { date: string; likes: number; shares: number; comments: number }[];
  demographics: { age: string; percentage: number }[];
  topVideos: { title: string; views: number; engagement: number }[];
  watchTime: { date: string; minutes: number }[];
}

export default function AnalyticsPage() {
  const { user, isPending } = useAuth();
  const [, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'engagement' | 'audience' | 'content'>('overview');

  // Check if user has analytics access (creator, admin, or premium)
  const hasAnalyticsAccess = user?.email?.includes('admin') || user?.email?.includes('creator');

  useEffect(() => {
    if (user && hasAnalyticsAccess) {
      fetchAnalytics();
    }
  }, [user, timeRange, hasAnalyticsAccess]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'engagement', label: 'Engagement', icon: Heart },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'content', label: 'Content', icon: Video },
  ];

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view analytics.</p>
        </div>
      </div>
    );
  }

  if (!hasAnalyticsAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analytics Access Required</h2>
          <p className="text-gray-400 mb-6">
            Analytics are available for content creators and premium subscribers.
            Upgrade your account to access detailed insights about your content performance.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
            Upgrade to Creator Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-400">Track your content performance and audience insights</p>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>

              <button
                onClick={fetchAnalytics}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-900/50 p-1 rounded-xl mb-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+15%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">24.5K</p>
                  <p className="text-gray-400 text-sm">Total Views</p>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <Clock className="w-6 h-6 text-purple-500" />
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+8%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1.2K</p>
                  <p className="text-gray-400 text-sm">Watch Hours</p>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-red-600/20 rounded-lg">
                    <Heart className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+22%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3.4K</p>
                  <p className="text-gray-400 text-sm">Engagements</p>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <Users className="w-6 h-6 text-green-500" />
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+5%</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">892</p>
                  <p className="text-gray-400 text-sm">Unique Viewers</p>
                </div>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Views Over Time</h3>
                <div className="h-64 flex items-center justify-center bg-gray-800/30 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Chart visualization</p>
                    <p className="text-gray-500 text-sm">Interactive charts coming soon</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Engagement Rate</h3>
                <div className="h-64 flex items-center justify-center bg-gray-800/30 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Engagement metrics</p>
                    <p className="text-gray-500 text-sm">Detailed breakdown available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Engagement Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-gray-800/30 rounded-lg">
                  <Heart className="w-8 h-8 text-red-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">89.2%</p>
                  <p className="text-gray-400">Like Rate</p>
                </div>

                <div className="text-center p-6 bg-gray-800/30 rounded-lg">
                  <Share2 className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">12.4%</p>
                  <p className="text-gray-400">Share Rate</p>
                </div>

                <div className="text-center p-6 bg-gray-800/30 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-white">3:24</p>
                  <p className="text-gray-400">Avg. Watch Time</p>
                </div>
              </div>

              <div className="h-64 flex items-center justify-center bg-gray-800/30 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Engagement trends visualization</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Demographics</h3>
                <div className="space-y-4">
                  {[
                    { age: '18-24', percentage: 35 },
                    { age: '25-34', percentage: 28 },
                    { age: '35-44', percentage: 22 },
                    { age: '45-54', percentage: 10 },
                    { age: '55+', percentage: 5 },
                  ].map((demo) => (
                    <div key={demo.age} className="flex items-center justify-between">
                      <span className="text-gray-300">{demo.age}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${demo.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-8">{demo.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Top Locations</h3>
                <div className="space-y-3">
                  {[
                    { country: 'United States', views: '8.2K', percentage: 34 },
                    { country: 'United Kingdom', views: '3.1K', percentage: 13 },
                    { country: 'Canada', views: '2.8K', percentage: 12 },
                    { country: 'Germany', views: '2.1K', percentage: 9 },
                    { country: 'Australia', views: '1.9K', percentage: 8 },
                  ].map((location) => (
                    <div key={location.country} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                      <span className="text-white">{location.country}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-gray-400 text-sm">{location.views}</span>
                        <span className="text-purple-400 text-sm">{location.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-8">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Top Performing Content</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm">
                      <th className="pb-4">Video</th>
                      <th className="pb-4">Views</th>
                      <th className="pb-4">Engagement</th>
                      <th className="pb-4">Watch Time</th>
                      <th className="pb-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-3">
                    {[
                      { title: 'Getting Started with React Hooks', views: '5.2K', engagement: '94%', watchTime: '4:32', trend: '+12%' },
                      { title: 'Advanced TypeScript Patterns', views: '3.8K', engagement: '89%', watchTime: '6:18', trend: '+8%' },
                      { title: 'Building REST APIs with Node.js', views: '4.1K', engagement: '91%', watchTime: '5:45', trend: '+15%' },
                      { title: 'CSS Grid vs Flexbox', views: '2.9K', engagement: '86%', watchTime: '3:22', trend: '+5%' },
                    ].map((video, index) => (
                      <tr key={index} className="border-t border-gray-700">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-8 bg-gray-700 rounded"></div>
                            <span className="text-white font-medium">{video.title}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{video.views}</td>
                        <td className="py-4 text-gray-300">{video.engagement}</td>
                        <td className="py-4 text-gray-300">{video.watchTime}</td>
                        <td className="py-4">
                          <span className="text-green-500 text-sm">{video.trend}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="flex items-center justify-end space-x-4 pt-8">
          <button className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share Report</span>
          </button>
        </div>
      </div>
    </div>
  );
}
