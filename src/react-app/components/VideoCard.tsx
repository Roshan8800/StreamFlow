import { Link } from 'react-router';
import { Play, Eye, Star, Heart } from 'lucide-react';
import type { Video } from '@/shared/types';

interface VideoCardProps {
  video: Video;
  showCategory?: boolean;
  className?: string;
}

export default function VideoCard({ video, showCategory = true, className = '' }: VideoCardProps) {
  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Link
      to={`/video/${video.id}`}
      className={`group block video-card bg-gray-900/30 rounded-xl overflow-hidden hover:bg-gray-900/50 transition-all duration-300 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {video.thumbnail_url ? (
          <img
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-blue-900/30">
            <Play className="w-12 h-12 text-white/50" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
            <Play className="w-5 h-5 text-gray-900 ml-0.5" />
          </div>
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Quality badge */}
        <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-semibold">
          {video.quality}
        </div>

        {/* Premium indicator */}
        {video.is_premium === 1 && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-500 to-orange-500 px-2 py-1 rounded text-xs text-white font-semibold">
            <Star className="w-3 h-3 inline mr-1" />
            Premium
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="text-white font-semibold line-clamp-2 group-hover:text-purple-400 transition-colors duration-200">
          {video.title}
        </h3>

        {/* Description */}
        {video.description && (
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Category */}
        {showCategory && (video as any).category_name && (
          <Link
            to={`/category/${(video as any).category_slug}`}
            className="inline-block text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {(video as any).category_name}
          </Link>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.view_count)}</span>
            </span>

            <span className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{video.like_count}</span>
            </span>
          </div>

          <span className="text-xs">
            {formatDate(video.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}
