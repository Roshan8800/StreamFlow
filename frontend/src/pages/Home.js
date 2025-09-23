import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Eye, Clock, Filter, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockVideos = [
      {
        id: '1',
        title: 'Epic Adventure Begins',
        description: 'An amazing journey through unknown territories',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        category: 'Adventure',
        duration: 1800,
        views: 15420,
        likes: 892,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Mystery Unveiled',
        description: 'Uncover the secrets of the ancient world',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        category: 'Mystery',
        duration: 2100,
        views: 23100,
        likes: 1205,
        created_at: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        title: 'Tech Revolution',
        description: 'Explore the latest in technology and innovation',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        category: 'Tech',
        duration: 1650,
        views: 8920,
        likes: 547,
        created_at: '2024-01-13T09:20:00Z'
      },
      {
        id: '4',
        title: 'Comedy Night Special',
        description: 'Laugh out loud with the best comedy acts',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        category: 'Comedy',
        duration: 3600,
        views: 45200,
        likes: 2890,
        created_at: '2024-01-12T20:00:00Z'
      },
      {
        id: '5',
        title: 'Nature Documentary',
        description: 'Witness the beauty of untouched wilderness',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        category: 'Documentary',
        duration: 2700,
        views: 12800,
        likes: 678,
        created_at: '2024-01-11T14:30:00Z'
      },
      {
        id: '6',
        title: 'Action Packed Thriller',
        description: 'Heart-pounding action from start to finish',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        category: 'Action',
        duration: 1950,
        views: 78900,
        likes: 4200,
        created_at: '2024-01-10T18:15:00Z'
      }
    ];

    const mockCategories = ['All', 'Adventure', 'Mystery', 'Tech', 'Comedy', 'Documentary', 'Action'];

    setVideos(mockVideos);
    setCategories(mockCategories);
    setIsLoading(false);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (videoId) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, likes: video.likes + 1 }
        : video
    ));
    toast.success('Added to favorites!');
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
      {/* Hero Section */}
      <div className="relative mb-8 glass-card p-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-600/20"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-gradient font-['Poppins'] mb-4">
            Welcome to PlayNite
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl">
            Discover premium content, connect with creators, and enjoy an unparalleled streaming experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary flex items-center gap-2" data-testid="explore-button">
              <TrendingUp size={20} />
              Explore Trending
            </button>
            <button className="btn-secondary flex items-center gap-2" data-testid="categories-button">
              <Filter size={20} />
              Browse Categories
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input search-input text-lg py-4"
            data-testid="home-search-input"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`category-pill ${activeCategory === category ? 'active' : ''}`}
            data-testid={`category-${category.toLowerCase()}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="glass-card video-card slide-up" data-testid={`video-card-${video.id}`}>
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="video-thumbnail"
                loading="lazy"
              />
              
              {/* Play Overlay */}
              <Link 
                to={`/video/${video.id}`}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur rounded-full flex items-center justify-center">
                  <Play size={24} className="text-white ml-1" fill="currentColor" />
                </div>
              </Link>

              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-sm font-medium">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="video-title text-white hover:text-pink-400 transition-colors">
                {video.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                {video.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{formatViews(video.views)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{getTimeAgo(video.created_at)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleLike(video.id)}
                  className="flex items-center gap-1 hover:text-pink-400 transition-colors"
                  data-testid={`like-button-${video.id}`}
                >
                  <Heart size={14} />
                  <span>{video.likes}</span>
                </button>
              </div>

              {/* Category Badge */}
              <div className="mt-3">
                <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-1 rounded-full text-xs font-semibold">
                  {video.category}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-white mb-2">No videos found</h3>
          <p className="text-gray-400">Try adjusting your search or browse different categories.</p>
        </div>
      )}

      {/* Load More Button */}
      {filteredVideos.length > 0 && (
        <div className="text-center mt-12">
          <button className="btn-secondary px-8 py-3" data-testid="load-more-button">
            Load More Videos
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;