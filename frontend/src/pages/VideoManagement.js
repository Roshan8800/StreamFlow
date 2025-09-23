import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Download,
  Upload,
  Play,
  Pause,
  Clock,
  BarChart3,
  Heart,
  MessageSquare
} from 'lucide-react';
import { toast } from 'sonner';

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [categories] = useState(['Adventure', 'Mystery', 'Tech', 'Comedy', 'Documentary', 'Action']);

  useEffect(() => {
    // Mock video data
    const mockVideos = [
      {
        id: '1',
        title: 'Epic Adventure Begins',
        description: 'An amazing journey through unknown territories with stunning visuals',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=169&fit=crop',
        category: 'Adventure',
        duration: 1800,
        views: 15420,
        likes: 892,
        comments: 47,
        uploadDate: '2024-01-15T10:30:00Z',
        status: 'published',
        fileSize: '2.1 GB',
        googleDriveUrl: 'https://drive.google.com/file/d/1example/view'
      },
      {
        id: '2',
        title: 'Mystery Unveiled',
        description: 'Uncover the secrets of the ancient world in this thrilling documentary',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=300&h=169&fit=crop',
        category: 'Mystery',
        duration: 2100,
        views: 23100,
        likes: 1205,
        comments: 89,
        uploadDate: '2024-01-14T15:45:00Z',
        status: 'published',
        fileSize: '3.2 GB',
        googleDriveUrl: 'https://drive.google.com/file/d/2example/view'
      },
      {
        id: '3',
        title: 'Tech Revolution Draft',
        description: 'Explore the latest in technology and innovation - Work in Progress',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=169&fit=crop',
        category: 'Tech',
        duration: 1650,
        views: 0,
        likes: 0,
        comments: 0,
        uploadDate: '2024-01-13T09:20:00Z',
        status: 'draft',
        fileSize: '1.8 GB',
        googleDriveUrl: 'https://drive.google.com/file/d/3example/view'
      },
      {
        id: '4',
        title: 'Comedy Night Special',
        description: 'Laugh out loud with the best comedy acts from around the world',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=300&h=169&fit=crop',
        category: 'Comedy',
        duration: 3600,
        views: 45200,
        likes: 2890,
        comments: 156,
        uploadDate: '2024-01-12T20:00:00Z',
        status: 'published',
        fileSize: '4.5 GB',
        googleDriveUrl: 'https://drive.google.com/file/d/4example/view'
      }
    ];

    setVideos(mockVideos);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'draft':
        return 'text-yellow-400 bg-yellow-900 bg-opacity-20';
      case 'processing':
        return 'text-blue-400 bg-blue-900 bg-opacity-20';
      default:
        return 'text-gray-400 bg-gray-900 bg-opacity-20';
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || video.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || video.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleVideoAction = (videoId, action) => {
    setVideos(prev => prev.map(video => 
      video.id === videoId 
        ? { ...video, status: action }
        : video
    ));
    
    toast.success(`Video ${action} successfully!`);
  };

  const handleDeleteVideo = (videoId) => {
    setVideos(prev => prev.filter(video => video.id !== videoId));
    toast.success('Video deleted successfully!');
  };

  const toggleVideoSelection = (videoId) => {
    setSelectedVideos(prev => 
      prev.includes(videoId)
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const UploadModal = () => {
    const [uploadData, setUploadData] = useState({
      title: '',
      description: '',
      category: '',
      googleDriveUrl: '',
      tags: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      
      const newVideo = {
        id: Date.now().toString(),
        ...uploadData,
        duration: 0,
        views: 0,
        likes: 0,
        comments: 0,
        uploadDate: new Date().toISOString(),
        status: 'processing',
        fileSize: 'Processing...',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=169&fit=crop'
      };

      setVideos(prev => [newVideo, ...prev]);
      setShowUploadModal(false);
      toast.success('Video upload started! Processing...');
    };

    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Upload New Video</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Video Title</label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                className="input"
                required
                data-testid="upload-title-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={uploadData.description}
                onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                className="input resize-none"
                rows="3"
                required
                data-testid="upload-description-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select
                  value={uploadData.category}
                  onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value }))}
                  className="input"
                  required
                  data-testid="upload-category-select"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <input
                  type="text"
                  value={uploadData.tags}
                  onChange={(e) => setUploadData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Separate with commas"
                  className="input"
                  data-testid="upload-tags-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Google Drive URL</label>
              <input
                type="url"
                value={uploadData.googleDriveUrl}
                onChange={(e) => setUploadData(prev => ({ ...prev, googleDriveUrl: e.target.value }))}
                placeholder="https://drive.google.com/file/d/..."
                className="input"
                required
                data-testid="upload-drive-url-input"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary flex-1" data-testid="upload-submit-button">
                Upload Video
              </button>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary flex-1"
                data-testid="upload-cancel-button"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">Video Management</h1>
          <p className="text-gray-400">Upload, edit, and manage your video content</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="upload-video-button"
          >
            <Upload size={16} />
            Upload Video
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
              data-testid="video-search-input"
            />
          </div>
          
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input"
              data-testid="category-filter"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input"
              data-testid="status-filter"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="processing">Processing</option>
            </select>
          </div>
          
          <button className="btn-secondary flex items-center gap-2">
            <Filter size={16} />
            Advanced
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="glass-card overflow-hidden" data-testid={`video-item-${video.id}`}>
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(video.status)}`}>
                  {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
                </span>
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
                {formatDuration(video.duration)}
              </div>
              
              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                <button className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur">
                  <Play size={24} className="text-white ml-1" fill="currentColor" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">{video.description}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{formatViews(video.views)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{video.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare size={14} />
                  <span>{video.comments}</span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="text-xs text-gray-500 mb-4">
                <div>Category: {video.category}</div>
                <div>Uploaded: {formatDate(video.uploadDate)}</div>
                <div>Size: {video.fileSize}</div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="btn-ghost p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20"
                    title="View Details"
                    data-testid={`view-video-${video.id}`}
                  >
                    <Eye size={16} />
                  </button>
                  
                  <button
                    className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20"
                    title="Edit Video"
                    data-testid={`edit-video-${video.id}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20"
                    title="Delete Video"
                    data-testid={`delete-video-${video.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {video.status === 'draft' && (
                  <button
                    onClick={() => handleVideoAction(video.id, 'published')}
                    className="btn-primary px-3 py-1 text-sm"
                    data-testid={`publish-video-${video.id}`}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No videos found</h3>
          <p className="text-gray-400 mb-6">Upload your first video or adjust your search criteria.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Upload size={16} />
            Upload Video
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal />
    </div>
  );
};

export default VideoManagement;