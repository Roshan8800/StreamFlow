import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Heart, Grid, List, SlidersHorizontal, Trash2, Share2, Download } from 'lucide-react';
import VideoCard from '@/react-app/components/VideoCard';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import type { Video } from '@/shared/types';

export default function FavoritesPage() {
  const { user, isPending } = useAuth();
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title' | 'duration'>('newest');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, sortBy]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?sort=${sortBy}`);
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (videoId: number) => {
    try {
      const response = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_id: videoId }),
      });

      if (response.ok) {
        setFavorites(prev => prev.filter(video => video.id !== videoId));
        setSelectedItems(prev => prev.filter(id => id !== videoId));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(
        selectedItems.map(videoId =>
          fetch('/api/favorites', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ video_id: videoId }),
          })
        )
      );

      setFavorites(prev => prev.filter(video => !selectedItems.includes(video.id)));
      setSelectedItems([]);
    } catch (error) {
      console.error('Error bulk deleting favorites:', error);
    }
  };

  const toggleSelectItem = (videoId: number) => {
    setSelectedItems(prev =>
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const selectAll = () => {
    setSelectedItems(favorites.map(video => video.id));
  };

  const clearSelection = () => {
    setSelectedItems([]);
  };

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your favorites.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-white">My Favorites</h1>
          </div>
          <p className="text-gray-400">
            {favorites.length} video{favorites.length !== 1 ? 's' : ''} saved to favorites
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="newest">Recently Added</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="duration">Duration</option>
            </select>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                showFilters ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-gray-400 text-sm">
                {selectedItems.length} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
              <button
                onClick={clearSelection}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Selection Controls */}
        {favorites.length > 0 && (
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={selectedItems.length === favorites.length ? clearSelection : selectAll}
              className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              {selectedItems.length === favorites.length ? 'Deselect All' : 'Select All'}
            </button>
            {selectedItems.length > 0 && (
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors text-sm">
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-400 mb-3">No favorites yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Start adding videos to your favorites by clicking the heart icon on any video you love.
            </p>
            <a
              href="/search"
              className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <span>Discover Videos</span>
            </a>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((video) => (
                  <div key={video.id} className="relative group">
                    {/* Selection Checkbox */}
                    <div className="absolute top-2 left-2 z-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(video.id)}
                        onChange={() => toggleSelectItem(video.id)}
                        className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                      />
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromFavorites(video.id)}
                      className="absolute top-2 right-2 z-10 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((video) => (
                  <div key={video.id} className="flex items-center space-x-4 bg-gray-900/30 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(video.id)}
                      onChange={() => toggleSelectItem(video.id)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                    />

                    <div className="w-24 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                      {video.thumbnail_url ? (
                        <img src={video.thumbnail_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-600"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium truncate">{video.title}</h3>
                      <p className="text-gray-400 text-sm truncate">{video.description}</p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{video.view_count.toLocaleString()} views</span>
                        <span>{video.duration ? `${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')}` : 'N/A'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromFavorites(video.id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
