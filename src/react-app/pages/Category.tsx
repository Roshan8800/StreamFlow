import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, Grid3X3, Filter, SortAsc } from 'lucide-react';
import VideoCard from '@/react-app/components/VideoCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import type { Video, Category } from '@/shared/types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);

  const [filters, setFilters] = useState({
    quality: '',
    duration_min: '',
    duration_max: '',
    sort: 'newest' as 'newest' | 'oldest' | 'popular' | 'rating'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    if (slug) {
      fetchCategory();
      fetchVideos();
    }
  }, [slug]);

  useEffect(() => {
    fetchVideos();
  }, [filters, pagination.page]);

  const fetchCategory = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const categories = await response.json();
        const foundCategory = categories.find((cat: Category) => cat.slug === slug);
        setCategory(foundCategory || null);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async (page = pagination.page) => {
    if (!slug) return;

    setVideosLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('category', slug);
      params.set('sort', filters.sort);
      params.set('page', page.toString());
      params.set('limit', pagination.limit.toString());

      if (filters.quality) params.set('quality', filters.quality);
      if (filters.duration_min) params.set('duration_min', filters.duration_min);
      if (filters.duration_max) params.set('duration_max', filters.duration_max);

      const response = await fetch(`/api/videos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data.videos || []);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setVideosLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    fetchVideos(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Category not found</h2>
          <p className="text-gray-400">The category you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center space-x-4 mb-6">
            {category.icon_url ? (
              <img
                src={category.icon_url}
                alt={category.name}
                className="w-12 h-12 rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
            )}

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-gray-400 mt-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900/50 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-white">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Quality Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Quality</label>
              <select
                value={filters.quality}
                onChange={(e) => handleFilterChange('quality', e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Any Quality</option>
                <option value="4K">4K Ultra HD</option>
                <option value="HD">HD</option>
                <option value="SD">SD</option>
              </select>
            </div>

            {/* Duration Min */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Min Duration (min)</label>
              <input
                type="number"
                value={filters.duration_min}
                onChange={(e) => handleFilterChange('duration_min', e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Duration Max */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Max Duration (min)</label>
              <input
                type="number"
                value={filters.duration_max}
                onChange={(e) => handleFilterChange('duration_max', e.target.value)}
                placeholder="∞"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sort by</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <SortAsc className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">
              {videosLoading ? 'Loading...' : `${pagination.total} videos found`}
            </span>
          </div>

          <div className="text-sm text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        </div>

        {/* Videos Grid */}
        {videosLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 aspect-video rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded"></div>
                  <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} showCategory={false} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === pagination.page;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Grid3X3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No videos found</h3>
            <p className="text-gray-500">
              Try adjusting your filters to find content in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
