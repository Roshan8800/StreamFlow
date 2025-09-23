import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Share2, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag,
  Pin,
  Star,
  Award,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';

const Community = () => {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('discussions');
  const [discussions, setDiscussions] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('recent');

  useEffect(() => {
    // Mock community data
    const mockDiscussions = [
      {
        id: '1',
        title: 'What are your favorite video categories and why?',
        content: 'I\'m curious to know what types of content everyone enjoys the most. Personally, I love adventure and mystery videos because they keep me engaged throughout.',
        author: {
          id: 'user1',
          username: 'VideoEnthusiast',
          avatar: 'VE',
          role: 'Premium Member',
          reputation: 1250
        },
        createdAt: '2024-01-21T10:30:00Z',
        replies: 24,
        likes: 67,
        views: 234,
        tags: ['discussion', 'categories', 'preferences'],
        isPinned: true,
        isPopular: true
      },
      {
        id: '2',
        title: 'Feature Request: Video bookmarks and timestamps',
        content: 'It would be amazing to have the ability to bookmark specific moments in videos and add personal notes. This would be super helpful for longer content.',
        author: {
          id: 'user2',
          username: 'TechSavvyUser',
          avatar: 'TS',
          role: 'Active Member',
          reputation: 890
        },
        createdAt: '2024-01-21T08:15:00Z',
        replies: 18,
        likes: 45,
        views: 156,
        tags: ['feature-request', 'bookmarks', 'timestamps'],
        isPinned: false,
        isPopular: false
      },
      {
        id: '3',
        title: 'PlayNite Community Guidelines - Please Read',
        content: 'Welcome to our community! Please take a moment to read through our community guidelines to ensure everyone has a positive experience.',
        author: {
          id: 'admin1',
          username: 'PlayNiteAdmin',
          avatar: 'PA',
          role: 'Administrator',
          reputation: 5000
        },
        createdAt: '2024-01-20T16:45:00Z',
        replies: 8,
        likes: 123,
        views: 567,
        tags: ['announcement', 'guidelines', 'rules'],
        isPinned: true,
        isPopular: false
      },
      {
        id: '4',
        title: 'Best video recommendations for newcomers?',
        content: 'I just joined PlayNite and I\'m looking for some great video recommendations to get started. What would you suggest for someone new to the platform?',
        author: {
          id: 'user3',
          username: 'NewMember2024',
          avatar: 'NM',
          role: 'New Member',
          reputation: 45
        },
        createdAt: '2024-01-21T14:20:00Z',
        replies: 31,
        likes: 78,
        views: 298,
        tags: ['recommendations', 'newcomers', 'help'],
        isPinned: false,
        isPopular: true
      }
    ];

    const mockTopUsers = [
      {
        id: 'user1',
        username: 'VideoEnthusiast',
        avatar: 'VE',
        role: 'Premium Member',
        reputation: 1250,
        posts: 89,
        rank: 1
      },
      {
        id: 'user4',
        username: 'CommunityHelper',
        avatar: 'CH',
        role: 'Moderator',
        reputation: 2100,
        posts: 156,
        rank: 2
      },
      {
        id: 'user2',
        username: 'TechSavvyUser',
        avatar: 'TS',
        role: 'Active Member',
        reputation: 890,
        posts: 67,
        rank: 3
      },
      {
        id: 'user5',
        username: 'ContentCreator',
        avatar: 'CC',
        role: 'Creator',
        reputation: 1456,
        posts: 112,
        rank: 4
      }
    ];

    setDiscussions(mockDiscussions);
    setTopUsers(mockTopUsers);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Administrator':
        return 'text-red-400 bg-red-900 bg-opacity-20';
      case 'Moderator':
        return 'text-green-400 bg-green-900 bg-opacity-20';
      case 'Premium Member':
        return 'text-yellow-400 bg-yellow-900 bg-opacity-20';
      case 'Creator':
        return 'text-purple-400 bg-purple-900 bg-opacity-20';
      default:
        return 'text-blue-400 bg-blue-900 bg-opacity-20';
    }
  };

  const filteredDiscussions = discussions
    .filter(discussion => 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      switch (filterBy) {
        case 'popular':
          return (b.likes + b.replies) - (a.likes + a.replies);
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'trending':
          return (b.views / Math.max(1, Math.floor((Date.now() - new Date(b.createdAt)) / (1000 * 60 * 60)))) - 
                 (a.views / Math.max(1, Math.floor((Date.now() - new Date(a.createdAt)) / (1000 * 60 * 60))));
        default:
          return 0;
      }
    });

  const handleLikeDiscussion = (discussionId) => {
    setDiscussions(discussions.map(discussion => 
      discussion.id === discussionId 
        ? { ...discussion, likes: discussion.likes + 1 }
        : discussion
    ));
    toast.success('Discussion liked!');
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">Community</h1>
          <p className="text-gray-400">Connect with fellow PlayNite members and share your thoughts</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="btn-primary flex items-center gap-2" data-testid="create-post-button">
            <Plus size={16} />
            Create Post
          </button>
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">1.2K</div>
          <div className="text-sm text-gray-400">Active Members</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">89</div>
          <div className="text-sm text-gray-400">Discussions</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">456</div>
          <div className="text-sm text-gray-400">Posts Today</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">12</div>
          <div className="text-sm text-gray-400">Online Now</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Search and Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-12"
                  data-testid="community-search-input"
                />
              </div>
              
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="input md:w-auto"
                data-testid="discussion-filter"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Discussions List */}
          <div className="space-y-4">
            {filteredDiscussions.map((discussion) => (
              <div key={discussion.id} className="glass-card p-6 hover:bg-white hover:bg-opacity-5 transition-colors" data-testid={`discussion-${discussion.id}`}>
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {discussion.author.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{discussion.author.username}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(discussion.author.role)}`}>
                        {discussion.author.role}
                      </span>
                      {discussion.author.reputation > 1000 && (
                        <Star size={14} className="text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{formatDate(discussion.createdAt)}</span>
                      <span>{discussion.author.reputation} reputation</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {discussion.isPinned && (
                      <Pin size={16} className="text-yellow-400" />
                    )}
                    {discussion.isPopular && (
                      <TrendingUp size={16} className="text-green-400" />
                    )}
                    <button className="btn-ghost p-2">
                      <Flag size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    {discussion.isPinned && <Pin size={18} className="text-yellow-400" />}
                    {discussion.title}
                  </h2>
                  <p className="text-gray-300 leading-relaxed">{discussion.content}</p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {discussion.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-sm hover:bg-pink-500 hover:text-white transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{discussion.views} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={16} />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{formatDate(discussion.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLikeDiscussion(discussion.id)}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-pink-500 hover:bg-opacity-20 rounded-lg transition-colors text-gray-400 hover:text-pink-400"
                    >
                      <ThumbsUp size={16} />
                      <span>{discussion.likes}</span>
                    </button>
                    
                    <Link
                      to={`/community/discussion/${discussion.id}`}
                      className="btn-secondary flex items-center gap-2 px-4 py-2"
                    >
                      <Reply size={16} />
                      Reply
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="btn-secondary">Load More Discussions</button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award size={20} />
              Top Contributors
            </h2>
            
            <div className="space-y-4">
              {topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center gap-4" data-testid={`top-user-${index}`}>
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      {index === 0 && (
                        <Crown size={16} className="absolute -top-2 -right-2 text-yellow-400" />
                      )}
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white">{user.username}</span>
                        {index < 3 && (
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            'bg-orange-500 text-black'
                          }`}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">
                        {user.reputation} reputation • {user.posts} posts
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <Link to="/community/leaderboard" className="btn-secondary w-full mt-4">
              View Full Leaderboard
            </Link>
          </div>

          {/* Community Guidelines */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Community Guidelines</h2>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">1.</span>
                <span>Be respectful and kind to all members</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">2.</span>
                <span>No spam, self-promotion, or off-topic content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">3.</span>
                <span>Use appropriate language and content</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-pink-400 font-bold">4.</span>
                <span>Report inappropriate behavior</span>
              </div>
            </div>
            
            <Link to="/community/guidelines" className="btn-secondary w-full mt-4">
              Read Full Guidelines
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Activity</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Posts Created</span>
                <span className="text-white font-semibold">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Replies Made</span>
                <span className="text-white font-semibold">67</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Likes Received</span>
                <span className="text-white font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Reputation</span>
                <span className="text-gradient font-bold">892</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;