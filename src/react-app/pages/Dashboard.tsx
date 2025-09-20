import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  BarChart3,
  Eye,
  Clock,
  Heart,
  TrendingUp,
  Video,
  Users,
  Star,
  PlayCircle,
  Download,
  Share2,
  Award
} from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

interface DashboardStats {
  watchTime: number;
  videosWatched: number;
  favorites: number;
  reviews: number;
  subscriptions: number;
  downloads: number;
  achievements: number;
  streak: number;
}

interface RecentActivity {
  id: number;
  type: 'watch' | 'favorite' | 'review' | 'share';
  title: string;
  timestamp: string;
  duration?: number;
  rating?: number;
}

export default function DashboardPage() {
  const { user, isPending } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    watchTime: 0,
    videosWatched: 0,
    favorites: 0,
    reviews: 0,
    subscriptions: 0,
    downloads: 0,
    achievements: 0,
    streak: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, timeRange]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user stats
      const statsResponse = await fetch(`/api/user-stats?range=${timeRange}`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch recent activity
      const activityResponse = await fetch('/api/user-activity?limit=10');
      if (activityResponse.ok) {
        const activityData = await activityResponse.json();
        setRecentActivity(activityData);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'watch': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'favorite': return <Heart className="w-4 h-4 text-red-500" />;
      case 'review': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'share': return <Share2 className="w-4 h-4 text-green-500" />;
      default: return <Video className="w-4 h-4 text-gray-500" />;
    }
  };

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your dashboard.</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user.google_user_data.given_name || 'User'}!
              </h1>
              <p className="text-gray-400">Here's your streaming activity summary</p>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-600/20 rounded-lg">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{formatWatchTime(stats.watchTime)}</p>
              <p className="text-gray-400 text-sm">Watch Time</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600/20 rounded-lg">
                <Video className="w-6 h-6 text-purple-500" />
              </div>
              <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+12%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.videosWatched}</p>
              <p className="text-gray-400 text-sm">Videos Watched</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-600/20 rounded-lg">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xs text-green-500 bg-green-500/20 px-2 py-1 rounded">+5</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.favorites}</p>
              <p className="text-gray-400 text-sm">Favorites</p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-600/20 rounded-lg">
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <span className="text-xs text-purple-500 bg-purple-500/20 px-2 py-1 rounded">{stats.streak} day streak</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.achievements}</p>
              <p className="text-gray-400 text-sm">Achievements</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No recent activity</p>
                  <p className="text-gray-500 text-sm">Start watching videos to see your activity here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="flex-shrink-0">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{activity.title}</p>
                        <div className="flex items-center space-x-3 text-sm text-gray-400">
                          <span className="capitalize">{activity.type}</span>
                          {activity.duration && <span>{formatWatchTime(activity.duration)}</span>}
                          {activity.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{activity.rating}/5</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>Achievements</span>
              </h3>

              <div className="space-y-3">
                {[
                  { name: 'Early Bird', description: 'Watched 10 videos', unlocked: true },
                  { name: 'Binge Watcher', description: 'Watched for 5 hours straight', unlocked: true },
                  { name: 'Critic', description: 'Left 5 reviews', unlocked: false },
                  { name: 'Curator', description: 'Added 20 favorites', unlocked: false },
                ].map((achievement, index) => (
                  <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${achievement.unlocked ? 'bg-yellow-600/20' : 'bg-gray-800/30'}`}>
                    <Award className={`w-4 h-4 ${achievement.unlocked ? 'text-yellow-500' : 'text-gray-600'}`} />
                    <div>
                      <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-400">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <a
                  href="/favorites"
                  className="flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white">View Favorites</span>
                </a>

                <a
                  href="/profile"
                  className="flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Edit Profile</span>
                </a>

                <a
                  href="/settings"
                  className="flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5 text-green-400" />
                  <span className="text-white">Privacy Settings</span>
                </a>

                <button className="flex items-center space-x-3 p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors w-full text-left">
                  <Download className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Download Data</span>
                </button>
              </div>
            </div>

            {/* Subscription Status */}
            <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>

              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">Free Plan</h4>
                <p className="text-gray-400 text-sm mb-4">Enjoy basic features</p>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                  Upgrade to Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
