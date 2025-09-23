import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  Play, 
  Heart, 
  Eye, 
  Trash2, 
  Filter, 
  Grid, 
  List,
  Search,
  Plus,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dateAdded');

  useEffect(() => {
    // Mock watchlist data
    const mockWatchlist = [
      {
        id: '1',
        videoId: 'v1',
        title: 'Epic Adventure Begins',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        duration: 1800,
        addedAt: '2024-01-20T14:30:00Z',
        watchProgress: 0,
        category: 'Adventure',
        status: 'unwatched'
      },
      {
        id: '2',
        videoId: 'v2',
        title: 'Mystery Unveiled',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        duration: 2100,
        addedAt: '2024-01-19T10:15:00Z',
        watchProgress: 45,
        category: 'Mystery',
        status: 'watching'
      },
      {
        id: '3',
        videoId: 'v3',
        title: 'Comedy Night Special',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        duration: 3600,
        addedAt: '2024-01-18T16:45:00Z',
        watchProgress: 100,
        category: 'Comedy',
        status: 'watched'
      },
      {
        id: '4',
        videoId: 'v4',
        title: 'Tech Revolution',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        duration: 1650,
        addedAt: '2024-01-17T08:20:00Z',
        watchProgress: 25,
        category: 'Tech',
        status: 'watching'
      }
    ];

    setWatchlist(mockWatchlist);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'watched':
        return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'watching':
        return 'text-blue-400 bg-blue-900 bg-opacity-20';
      case 'unwatched':
        return 'text-gray-400 bg-gray-900 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-900 bg-opacity-20';
    }
  };

  const filteredWatchlist = watchlist
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateAdded':
          return new Date(b.addedAt) - new Date(a.addedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'duration':
          return b.duration - a.duration;
        case 'progress':
          return b.watchProgress - a.watchProgress;
        default:
          return 0;
      }
    });

  const handleRemoveFromWatchlist = (itemId) => {
    setWatchlist(watchlist.filter(item => item.id !== itemId));
    toast.success('Removed from watchlist!');
  };

  const handleMarkAsWatched = (itemId) => {
    setWatchlist(watchlist.map(item => 
      item.id === itemId 
        ? { ...item, status: 'watched', watchProgress: 100 }
        : item
    ));
    toast.success('Marked as watched!');
  };

  const WatchlistStats = () => {
    const totalItems = watchlist.length;
    const watchedItems = watchlist.filter(item => item.status === 'watched').length;
    const totalDuration = watchlist.reduce((acc, item) => acc + item.duration, 0);
    const completionRate = totalItems > 0 ? Math.round((watchedItems / totalItems) * 100) : 0;

    return (
      <div className="glass-card p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4">Watchlist Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{totalItems}</div>
            <div className="text-sm text-gray-400">Total Videos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{watchedItems}</div>
            <div className="text-sm text-gray-400">Watched</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{Math.floor(totalDuration / 3600)}h</div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gradient">{completionRate}%</div>
            <div className="text-sm text-gray-400">Completion Rate</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">My Watchlist</h1>
          <p className="text-gray-400">Keep track of videos you want to watch</p>
        </div>
      </div>

      <WatchlistStats />

      {/* Filters and Controls */}
      <div className="glass-card p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search watchlist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
              data-testid="watchlist-search-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status Filter</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
              data-testid="status-filter"
            >
              <option value="all">All Status</option>
              <option value="unwatched">Unwatched</option>
              <option value="watching">Currently Watching</option>
              <option value="watched">Watched</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
              data-testid="sort-filter"
            >
              <option value="dateAdded">Date Added</option>
              <option value="title">Title</option>
              <option value="duration">Duration</option>
              <option value="progress">Progress</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-ghost p-2 ${viewMode === 'grid' ? 'text-pink-400' : 'text-gray-400'}`}
              data-testid="grid-view-button"
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn-ghost p-2 ${viewMode === 'list' ? 'text-pink-400' : 'text-gray-400'}`}
              data-testid="list-view-button"
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Watchlist Content */}
      {viewMode === 'grid' ? (
        <div className="video-grid">
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="glass-card overflow-hidden" data-testid={`watchlist-item-${item.id}`}>
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
                  {formatDuration(item.duration)}
                </div>
                
                {/* Progress Bar */}
                {item.watchProgress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50">
                    <div 
                      className="h-full bg-pink-500"
                      style={{ width: `${item.watchProgress}%` }}
                    ></div>
                  </div>
                )}
                
                {/* Play Overlay */}
                <Link 
                  to={`/video/${item.videoId}`}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur rounded-full flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" fill="currentColor" />
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">{item.title}</h3>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span>{item.category}</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(item.addedAt)}</span>
                  </div>
                </div>

                {item.watchProgress > 0 && item.watchProgress < 100 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{item.watchProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${item.watchProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Link
                    to={`/video/${item.videoId}`}
                    className="btn-primary flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Play size={14} />
                    {item.status === 'unwatched' ? 'Watch' : 'Continue'}
                  </Link>
                  
                  <div className="flex items-center gap-2">
                    {item.status !== 'watched' && (
                      <button
                        onClick={() => handleMarkAsWatched(item.id)}
                        className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20"
                        title="Mark as Watched"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.id)}
                      className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20"
                      title="Remove from Watchlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="glass-card p-6 flex items-center gap-6" data-testid={`watchlist-item-${item.id}`}>
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-32 h-20 object-cover rounded"
                />
                {item.watchProgress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50 rounded-b">
                    <div 
                      className="h-full bg-pink-500 rounded-b"
                      style={{ width: `${item.watchProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-400 mb-3">
                  <span>{item.category}</span>
                  <span>{formatDuration(item.duration)}</span>
                  <span>Added {formatDate(item.addedAt)}</span>
                  {item.watchProgress > 0 && (
                    <span>{item.watchProgress}% watched</span>
                  )}
                </div>

                {item.watchProgress > 0 && item.watchProgress < 100 && (
                  <div className="w-48 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${item.watchProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to={`/video/${item.videoId}`}
                  className="btn-primary flex items-center gap-2 px-4 py-2"
                >
                  <Play size={16} />
                  {item.status === 'unwatched' ? 'Watch' : 'Continue'}
                </Link>
                
                {item.status !== 'watched' && (
                  <button
                    onClick={() => handleMarkAsWatched(item.id)}
                    className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20"
                    title="Mark as Watched"
                  >
                    <Eye size={16} />
                  </button>
                )}
                
                <button
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20"
                  title="Remove from Watchlist"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredWatchlist.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No videos found' : 'Your watchlist is empty'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Add videos to your watchlist to keep track of what you want to watch.'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Link to="/" className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={16} />
              Browse Videos
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;