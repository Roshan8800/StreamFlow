import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {
  Search,
  Grid,
  List,
  ExternalLink,
  Play,
  Eye,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface VideoEmbed {
  id: number;
  title: string;
  description?: string;
  embed_code: string;
  thumbnail_url?: string;
  source: string;
  duration?: string;
  tags?: string;
  category_name?: string;
  view_count: number;
  created_at: string;
}

interface ExternalLink {
  id: number;
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  category_name?: string;
  click_count: number;
  tags?: string;
  created_at: string;
}

type DirectoryItem = VideoEmbed | ExternalLink;

export default function DirectoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videoEmbeds, setVideoEmbeds] = useState<VideoEmbed[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLink[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || 'all', // all, videos, links
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    fetchDirectoryContent();
    fetchCategories();
    fetchTags();
  }, [searchParams]);

  const fetchDirectoryContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (filters.category) params.set('category', filters.category);
      if (filters.tag) params.set('tag', filters.tag);
      if (filters.sort) params.set('sort', filters.sort);

      // Fetch video embeds
      if (filters.type === 'all' || filters.type === 'videos') {
        const embedsResponse = await fetch(`/api/video-embeds?${params}`);
        if (embedsResponse.ok) {
          const embedsData = await embedsResponse.json();
          setVideoEmbeds(embedsData);
        }
      }

      // Fetch external links
      if (filters.type === 'all' || filters.type === 'links') {
        const linksResponse = await fetch(`/api/external-links?${params}`);
        if (linksResponse.ok) {
          const linksData = await linksResponse.json();
          setExternalLinks(linksData);
        }
      }
    } catch (error) {
      console.error('Error fetching directory content:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/content-tags');
      if (response.ok) {
        const data = await response.json();
        setTags(data);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    setSearchParams(params);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      category: '',
      tag: '',
      sort: 'newest'
    });
    setSearchParams({ q: searchQuery });
  };



  const recordAnalytics = async (type: 'video' | 'link', id: number, action: 'view' | 'click') => {
    try {
      await fetch('/api/analytics/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content_type: type === 'video' ? 'embed' : 'link',
          content_id: id,
          action_type: action
        })
      });
    } catch (error) {
      console.error('Error recording analytics:', error);
    }
  };

  const handleVideoView = (embed: VideoEmbed) => {
    recordAnalytics('video', embed.id, 'view');
  };

  const handleLinkClick = (link: ExternalLink) => {
    recordAnalytics('link', link.id, 'click');
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const renderVideoEmbed = (embed: VideoEmbed) => {

    return (
      <div className="bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group">
        {/* Video Player */}
        <div className="relative aspect-video bg-gray-800">
          <div
            dangerouslySetInnerHTML={{ __html: embed.embed_code }}
            className="w-full h-full"
            onClick={() => handleVideoView(embed)}
          />

          {/* Overlay info */}
          <div className="absolute top-2 left-2 flex items-center space-x-2">
            <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
              <Play className="w-3 h-3" />
              <span>Video</span>
            </span>
            {embed.duration && (
              <span className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                {embed.duration}
              </span>
            )}
          </div>

          {/* View count */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{embed.view_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
            {embed.title}
          </h3>

          {embed.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {embed.description}
            </p>
          )}

          {/* Tags and category */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {embed.category_name && (
                <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                  {embed.category_name}
                </span>
              )}
            </div>
            <span className="text-gray-500">
              {new Date(embed.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          {embed.tags && (
            <div className="flex flex-wrap gap-1">
              {JSON.parse(embed.tags).slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderExternalLink = (link: ExternalLink) => {
    return (
      <div className="bg-gray-900/50 rounded-xl overflow-hidden hover:bg-gray-900/70 transition-all duration-300 group cursor-pointer"
           onClick={() => handleLinkClick(link)}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
          {link.thumbnail_url ? (
            <img
              src={link.thumbnail_url}
              alt={link.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ExternalLink className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <ExternalLink className="w-5 h-5 text-gray-900" />
            </div>
          </div>

          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
              <ExternalLink className="w-3 h-3" />
              <span>Link</span>
            </span>
          </div>

          {/* Click count */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{link.click_count.toLocaleString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {link.title}
          </h3>

          {link.description && (
            <p className="text-gray-400 text-sm line-clamp-2">
              {link.description}
            </p>
          )}

          {/* URL preview */}
          <p className="text-blue-400 text-xs truncate font-mono">
            {link.url}
          </p>

          {/* Category and date */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              {link.category_name && (
                <span className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded">
                  {link.category_name}
                </span>
              )}
            </div>
            <span className="text-gray-500">
              {new Date(link.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Tags */}
          {link.tags && (
            <div className="flex flex-wrap gap-1">
              {JSON.parse(link.tags).slice(0, 3).map((tag: string, index: number) => (
                <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Visit button */}
          <button className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <ExternalLink className="w-4 h-4" />
            <span>Visit Site</span>
          </button>
        </div>
      </div>
    );
  };

  const allItems: DirectoryItem[] = [
    ...videoEmbeds.map(embed => ({ ...embed, type: 'video' as const })),
    ...externalLinks.map(link => ({ ...link, type: 'link' as const }))
  ].sort((a, b) => {
    switch (filters.sort) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'popular':
        const aCount = 'view_count' in a ? a.view_count : a.click_count;
        const bCount = 'view_count' in b ? b.view_count : b.click_count;
        return bCount - aCount;
      case 'title':
        return a.title.localeCompare(b.title);
      default: // newest
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const hasActiveFilters = filters.type !== 'all' || filters.category || filters.tag;

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Content Directory</h1>
            <p className="text-xl text-gray-400">Discover videos and external resources</p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, links, and resources..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400 text-lg"
              />
            </div>
          </form>

          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                )}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              <span className="text-gray-400">
                {allItems.length} items
              </span>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="bg-gray-900/50 rounded-lg p-6 mb-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Content Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Content</option>
                    <option value="videos">Videos Only</option>
                    <option value="links">Links Only</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.slug}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tag</label>
                  <select
                    value={filters.tag}
                    onChange={(e) => handleFilterChange('tag', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Tags</option>
                    {tags.map((tag) => (
                      <option key={tag.id} value={tag.slug}>
                        #{tag.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="title">Title A-Z</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content Grid/List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        ) : allItems.length > 0 ? (
          <div className={viewMode === 'grid'
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-6"
          }>
            {allItems.map((item) => (
              <div key={`${('type' in item ? item.type : ('embed_code' in item ? 'video' : 'link'))}-${item.id}`}>
                {'embed_code' in item ? renderVideoEmbed(item) : renderExternalLink(item)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No content found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
