import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Heart, 
  Share2, 
  ThumbsUp, 
  ThumbsDown,
  Send,
  Clock,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AppContext);
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);

  useEffect(() => {
    // Mock video data - replace with API call
    const mockVideo = {
      id: id,
      title: 'Epic Adventure Begins - The Ultimate Journey',
      description: 'Join us on an incredible adventure through mystical lands and discover the secrets that lie within. This epic journey will take you through beautiful landscapes, challenging obstacles, and unforgettable moments that will keep you on the edge of your seat.',
      embed_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Mock embed URL
      google_drive_url: 'https://drive.google.com/file/d/example/view',
      category: 'Adventure',
      tags: ['adventure', 'epic', 'journey', 'mystery'],
      duration: 1800,
      views: 15420,
      likes: 892,
      dislikes: 23,
      created_at: '2024-01-15T10:30:00Z',
      uploaded_by: 'admin-user-id',
      uploader: 'PlayNite Studio'
    };

    const mockComments = [
      {
        id: '1',
        user_id: 'user1',
        username: 'AdventureSeeker',
        text: 'Amazing content! Love the production quality.',
        timestamp: '2024-01-15T11:00:00Z',
        likes: 12,
        avatar: 'AS'
      },
      {
        id: '2',
        user_id: 'user2',
        username: 'MovieBuff92',
        text: 'This is exactly what I was looking for. Great work!',
        timestamp: '2024-01-15T11:30:00Z',
        likes: 8,
        avatar: 'MB'
      },
      {
        id: '3',
        user_id: 'user3',
        username: 'ContentLover',
        text: 'The cinematography is absolutely stunning. When is the next episode coming out?',
        timestamp: '2024-01-15T12:00:00Z',
        likes: 15,
        avatar: 'CL'
      }
    ];

    const mockRelatedVideos = [
      {
        id: '2',
        title: 'Mystery Unveiled',
        thumbnail: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=300&h=169&fit=crop',
        duration: 2100,
        views: 23100
      },
      {
        id: '3',
        title: 'Tech Revolution',
        thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=169&fit=crop',
        duration: 1650,
        views: 8920
      }
    ];

    setVideo(mockVideo);
    setComments(mockComments);
    setRelatedVideos(mockRelatedVideos);
  }, [id]);

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

  const handleLike = () => {
    setIsLiked(!isLiked);
    setIsDisliked(false);
    toast.success(isLiked ? 'Like removed' : 'Video liked!');
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    setIsLiked(false);
    toast.success(isDisliked ? 'Dislike removed' : 'Feedback recorded');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Video link copied to clipboard!');
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now().toString(),
      user_id: user.id,
      username: user.username,
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      avatar: user.username.charAt(0).toUpperCase()
    };

    setComments([comment, ...comments]);
    setNewComment('');
    toast.success('Comment added!');
  };

  if (!video) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="btn-ghost mb-6 flex items-center gap-2"
        data-testid="back-button"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Video Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="glass-card overflow-hidden">
            <div className="relative bg-black aspect-video">
              {/* Mock Video Player - Replace with actual video embedding */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={32} className="text-white ml-1" fill="currentColor" />
                  </div>
                  <p className="text-white text-lg font-medium">Video Player</p>
                  <p className="text-gray-300 text-sm">Google Drive integration coming soon</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn-ghost p-2"
                    data-testid="play-pause-button"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="btn-ghost p-2"
                    data-testid="mute-button"
                  >
                    {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                  </button>
                  
                  <div className="flex-1 bg-white bg-opacity-20 h-1 rounded-full">
                    <div className="w-1/3 bg-pink-500 h-full rounded-full"></div>
                  </div>
                  
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="btn-ghost p-2"
                    data-testid="fullscreen-button"
                  >
                    <Maximize size={24} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="glass-card p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{video.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Eye size={18} />
                  <span>{formatViews(video.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{getTimeAgo(video.created_at)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`btn-ghost flex items-center gap-2 px-4 py-2 ${
                    isLiked ? 'text-pink-400' : 'text-gray-400'
                  }`}
                  data-testid="like-button"
                >
                  <ThumbsUp size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{video.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className={`btn-ghost flex items-center gap-2 px-4 py-2 ${
                    isDisliked ? 'text-red-400' : 'text-gray-400'
                  }`}
                  data-testid="dislike-button"
                >
                  <ThumbsDown size={18} fill={isDisliked ? 'currentColor' : 'none'} />
                  <span>{video.dislikes + (isDisliked ? 1 : 0)}</span>
                </button>
                
                <button
                  onClick={handleShare}
                  className="btn-ghost flex items-center gap-2 px-4 py-2 text-gray-400"
                  data-testid="share-button"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                
                <button className="btn-primary flex items-center gap-2 px-4 py-2" data-testid="favorite-button">
                  <Heart size={18} />
                  <span>Add to Favorites</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                PS
              </div>
              <div>
                <div className="font-semibold text-white">{video.uploader}</div>
                <div className="text-sm text-gray-400">Content Creator</div>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">{video.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm hover:bg-pink-500 hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Comments ({comments.length})</h3>
            
            {/* Add Comment */}
            <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input resize-none"
                  rows="3"
                  data-testid="comment-input"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    className="btn-primary flex items-center gap-2"
                    data-testid="submit-comment"
                  >
                    <Send size={16} />
                    Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4" data-testid={`comment-${comment.id}`}>
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold">
                    {comment.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-semibold text-white">{comment.username}</span>
                      <span className="text-sm text-gray-400">{getTimeAgo(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{comment.text}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-gray-400 hover:text-pink-400 transition-colors text-sm">
                        <ThumbsUp size={14} />
                        <span>{comment.likes}</span>
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors text-sm">
                        Reply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Videos */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-6">Related Videos</h3>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <div
                  key={relatedVideo.id}
                  className="flex gap-3 p-3 hover:bg-white hover:bg-opacity-5 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate(`/video/${relatedVideo.id}`)}
                  data-testid={`related-video-${relatedVideo.id}`}
                >
                  <img
                    src={relatedVideo.thumbnail}
                    alt={relatedVideo.title}
                    className="w-24 h-14 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
                      {relatedVideo.title}
                    </h4>
                    <div className="text-xs text-gray-400">
                      {formatViews(relatedVideo.views)} views
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;