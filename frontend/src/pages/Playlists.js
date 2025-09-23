import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { 
  Plus, 
  Search, 
  Play, 
  MoreVertical, 
  Heart, 
  Share2, 
  Edit3, 
  Trash2,
  Lock,
  Globe,
  Clock,
  Eye,
  Grid,
  List
} from 'lucide-react';
import { toast } from 'sonner';

const Playlists = () => {
  const { user } = useContext(AppContext);
  const [playlists, setPlaylists] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    // Mock playlists data
    const mockPlaylists = [
      {
        id: '1',
        name: 'Favorites Collection',
        description: 'My all-time favorite videos',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        videoCount: 24,
        duration: 14400, // total seconds
        isPublic: false,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:20:00Z',
        views: 156
      },
      {
        id: '2',
        name: 'Action Adventures',
        description: 'High-energy action packed content',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=225&fit=crop',
        videoCount: 18,
        duration: 10800,
        isPublic: true,
        createdAt: '2024-01-12T08:15:00Z',
        updatedAt: '2024-01-19T16:45:00Z',
        views: 89
      },
      {
        id: '3',
        name: 'Comedy Collection',
        description: 'Funny and entertaining videos to brighten your day',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop',
        videoCount: 31,
        duration: 18600,
        isPublic: true,
        createdAt: '2024-01-10T12:00:00Z',
        updatedAt: '2024-01-18T20:30:00Z',
        views: 234
      }
    ];

    setPlaylists(mockPlaylists);
  }, []);

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredPlaylists = playlists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = (playlistData) => {
    const newPlaylist = {
      id: Date.now().toString(),
      ...playlistData,
      videoCount: 0,
      duration: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };

    setPlaylists([newPlaylist, ...playlists]);
    setShowCreateModal(false);
    toast.success('Playlist created successfully!');
  };

  const handleDeletePlaylist = (playlistId) => {
    setPlaylists(playlists.filter(p => p.id !== playlistId));
    toast.success('Playlist deleted successfully!');
  };

  const CreatePlaylistModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      isPublic: false
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      handleCreatePlaylist(formData);
    };

    if (!showCreateModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Playlist</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Playlist Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input"
                placeholder="Enter playlist name"
                required
                data-testid="playlist-name-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="input resize-none"
                rows="3"
                placeholder="Describe your playlist"
                data-testid="playlist-description-input"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isPublic" className="text-gray-300">Make playlist public</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary flex-1" data-testid="create-playlist-button">
                Create Playlist
              </button>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary flex-1"
                data-testid="cancel-create-playlist"
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
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">My Playlists</h1>
          <p className="text-gray-400">Organize and manage your favorite video collections</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="create-playlist-button"
          >
            <Plus size={16} />
            Create Playlist
          </button>
        </div>
      </div>

      {/* Search and View Controls */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search playlists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-12"
              data-testid="playlist-search-input"
            />
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

      {/* Playlists Grid/List */}
      {viewMode === 'grid' ? (
        <div className="video-grid">
          {filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="glass-card overflow-hidden" data-testid={`playlist-card-${playlist.id}`}>
              <div className="relative">
                <img
                  src={playlist.thumbnail}
                  alt={playlist.name}
                  className="w-full h-48 object-cover"
                />
                
                {/* Privacy Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    playlist.isPublic 
                      ? 'bg-green-500 bg-opacity-20 text-green-400' 
                      : 'bg-gray-500 bg-opacity-20 text-gray-400'
                  }`}>
                    {playlist.isPublic ? <Globe size={12} /> : <Lock size={12} />}
                    {playlist.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                
                {/* Video Count */}
                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 px-2 py-1 rounded text-sm">
                  {playlist.videoCount} videos
                </div>
                
                {/* Play Overlay */}
                <Link 
                  to={`/playlist/${playlist.id}`}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                >
                  <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur rounded-full flex items-center justify-center">
                    <Play size={24} className="text-white ml-1" fill="currentColor" />
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">{playlist.name}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{playlist.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{formatDuration(playlist.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{playlist.views}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Updated {formatDate(playlist.updatedAt)}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20">
                      <Edit3 size={16} />
                    </button>
                    <button className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20">
                      <Share2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeletePlaylist(playlist.id)}
                      className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20"
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
          {filteredPlaylists.map((playlist) => (
            <div key={playlist.id} className="glass-card p-6 flex items-center gap-6" data-testid={`playlist-item-${playlist.id}`}>
              <img
                src={playlist.thumbnail}
                alt={playlist.name}
                className="w-24 h-16 object-cover rounded"
              />
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">{playlist.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    {playlist.isPublic ? <Globe size={14} /> : <Lock size={14} />}
                    <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 mb-3">{playlist.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-400">
                  <span>{playlist.videoCount} videos</span>
                  <span>{formatDuration(playlist.duration)}</span>
                  <span>{playlist.views} views</span>
                  <span>Updated {formatDate(playlist.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/playlist/${playlist.id}`}
                  className="btn-primary flex items-center gap-2 px-4 py-2"
                >
                  <Play size={16} />
                  Play
                </Link>
                <button className="btn-ghost p-2">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredPlaylists.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No playlists found</h3>
          <p className="text-gray-400 mb-6">Create your first playlist to organize your favorite videos.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Create Playlist
          </button>
        </div>
      )}

      <CreatePlaylistModal />
    </div>
  );
};

export default Playlists;