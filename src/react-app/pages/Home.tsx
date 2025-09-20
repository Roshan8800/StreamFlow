import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@getmocha/users-service/react';
import {
  Play,
  TrendingUp,
  Star,
  Clock,
  Eye,
  ChevronRight,
  Zap
} from 'lucide-react';
import VideoCard from '@/react-app/components/VideoCard';
import CategorySlider from '@/react-app/components/CategorySlider';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import type { Video } from '@/shared/types';

export default function HomePage() {
  const { user } = useAuth();
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [trendingVideos, setTrendingVideos] = useState<Video[]>([]);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeContent();
  }, [user]);

  const fetchHomeContent = async () => {
    try {
      // Fetch featured videos (top rated)
      const featuredResponse = await fetch('/api/videos?sort=rating&limit=5');
      if (featuredResponse.ok) {
        const featuredData = await featuredResponse.json();
        setFeaturedVideos(featuredData.videos || []);
      }

      // Fetch trending videos (most viewed)
      const trendingResponse = await fetch('/api/videos?sort=popular&limit=8');
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json();
        setTrendingVideos(trendingData.videos || []);
      }

      // Fetch recent videos
      const recentResponse = await fetch('/api/videos?sort=newest&limit=8');
      if (recentResponse.ok) {
        const recentData = await recentResponse.json();
        setRecentVideos(recentData.videos || []);
      }

      // Fetch recommended videos (for authenticated users, otherwise show popular)
      const recommendedResponse = await fetch('/api/videos?sort=popular&limit=6');
      if (recommendedResponse.ok) {
        const recommendedData = await recommendedResponse.json();
        setRecommendedVideos(recommendedData.videos || []);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/50 to-transparent z-10"></div>

        {featuredVideos.length > 0 && (
          <div className="absolute inset-0">
            {featuredVideos[0].thumbnail_url ? (
              <img
                src={featuredVideos[0].thumbnail_url}
                alt={featuredVideos[0].title}
                className="w-full h-full object-cover opacity-30"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-blue-900/30"></div>
            )}
          </div>
        )}

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Welcome to
              <span className="block gradient-text">StreamFlow</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Discover premium video content with AI-powered recommendations,
              4K streaming, and personalized experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {user ? (
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover-glow focus-visible"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Watching</span>
                </Link>
              ) : (
                <button className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all hover-glow focus-visible">
                  <Play className="w-5 h-5" />
                  <span>Sign In to Watch</span>
                </button>
              )}

              <Link
                to="/search"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all focus-visible"
              >
                <Eye className="w-5 h-5" />
                <span>Browse Content</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Categories Section */}
        <section className="animate-fadeIn">
          <CategorySlider />
        </section>

        {/* Trending Section */}
        {trendingVideos.length > 0 && (
          <section className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-red-500" />
                <span>Trending Now</span>
              </h2>

              <Link
                to="/search?sort=popular"
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Recommended Section */}
        {user && recommendedVideos.length > 0 && (
          <section className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                <span>Recommended for You</span>
              </h2>

              <Link
                to="/profile"
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Customize</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Uploads Section */}
        {recentVideos.length > 0 && (
          <section className="animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <span>Latest Uploads</span>
              </h2>

              <Link
                to="/search?sort=newest"
                className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          </section>
        )}

        {/* Features Section */}
        <section className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-8 md:p-12 animate-fadeIn">
          <div className="text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Experience Premium Streaming
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Enjoy 4K quality, AI-powered recommendations, and seamless streaming
              across all your devices with advanced privacy controls.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">4K Quality</h3>
                <p className="text-gray-400">Crystal clear streaming with adaptive quality for all devices</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">AI Recommendations</h3>
                <p className="text-gray-400">Personalized content discovery powered by machine learning</p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">Privacy First</h3>
                <p className="text-gray-400">Advanced privacy controls and secure streaming technology</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
