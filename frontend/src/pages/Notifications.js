import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Heart, 
  MessageSquare, 
  Users, 
  Video, 
  Star, 
  AlertCircle,
  Check,
  X,
  Trash2,
  Settings,
  Filter,
  MarkAsRead
} from 'lucide-react';
import { toast } from 'sonner';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: '1',
        type: 'like',
        title: 'New Like on Your Comment',
        message: 'VideoEnthusiast liked your comment on "Epic Adventure Begins"',
        timestamp: '2024-01-21T14:30:00Z',
        isRead: false,
        actionUrl: '/video/1',
        avatar: 'VE',
        priority: 'normal'
      },
      {
        id: '2',
        type: 'comment',
        title: 'New Comment Reply',
        message: 'TechSavvyUser replied to your comment: "That\'s a great point! I never thought about it that way."',
        timestamp: '2024-01-21T13:15:00Z',
        isRead: false,
        actionUrl: '/video/2',
        avatar: 'TS',
        priority: 'high'
      },
      {
        id: '3',
        type: 'follow',
        title: 'New Follower',
        message: 'NewMember2024 started following you',
        timestamp: '2024-01-21T12:00:00Z',
        isRead: true,
        actionUrl: '/profile/newmember2024',
        avatar: 'NM',
        priority: 'normal'
      },
      {
        id: '4',
        type: 'video',
        title: 'New Video Uploaded',
        message: 'A new video "Mystery Unveiled Part 2" was added to your subscribed category',
        timestamp: '2024-01-21T10:45:00Z',
        isRead: true,
        actionUrl: '/video/5',
        avatar: 'PS',
        priority: 'normal'
      },
      {
        id: '5',
        type: 'system',
        title: 'Account Security Alert',
        message: 'Your password was successfully changed from a new device',
        timestamp: '2024-01-21T09:30:00Z',
        isRead: false,
        actionUrl: '/settings/security',
        avatar: 'SYS',
        priority: 'urgent'
      },
      {
        id: '6',
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: 'Congratulations! You\'ve earned the "Active Commenter" badge',
        timestamp: '2024-01-21T08:15:00Z',
        isRead: true,
        actionUrl: '/profile/achievements',
        avatar: 'ACH',
        priority: 'normal'
      },
      {
        id: '7',
        type: 'like',
        title: 'Multiple Likes Received',
        message: '5 users liked your playlist "Action Adventures"',
        timestamp: '2024-01-20T20:00:00Z',
        isRead: true,
        actionUrl: '/playlist/2',
        avatar: 'ML',
        priority: 'normal'
      },
      {
        id: '8',
        type: 'comment',
        title: 'New Comment on Your Playlist',
        message: 'CommunityHelper commented: "Excellent collection! Adding to my watchlist."',
        timestamp: '2024-01-20T18:30:00Z',
        isRead: true,
        actionUrl: '/playlist/1',
        avatar: 'CH',
        priority: 'normal'
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type, size = 20) => {
    switch (type) {
      case 'like':
        return <Heart size={size} className="text-pink-400" />;
      case 'comment':
        return <MessageSquare size={size} className="text-blue-400" />;
      case 'follow':
        return <Users size={size} className="text-green-400" />;
      case 'video':
        return <Video size={size} className="text-purple-400" />;
      case 'system':
        return <AlertCircle size={size} className="text-orange-400" />;
      case 'achievement':
        return <Star size={size} className="text-yellow-400" />;
      default:
        return <Bell size={size} className="text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-4 border-red-500';
      case 'high':
        return 'border-l-4 border-orange-500';
      default:
        return 'border-l-4 border-transparent';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.isRead;
    if (filter === 'read') return notification.isRead;
    if (filter !== 'all') return notification.type === filter;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notificationId) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => 
      ({ ...notification, isRead: true })
    ));
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const handleBulkMarkAsRead = () => {
    setNotifications(notifications.map(notification => 
      selectedNotifications.includes(notification.id)
        ? { ...notification, isRead: true }
        : notification
    ));
    setSelectedNotifications([]);
    toast.success(`${selectedNotifications.length} notifications marked as read`);
  };

  const handleBulkDelete = () => {
    setNotifications(notifications.filter(n => !selectedNotifications.includes(n.id)));
    setSelectedNotifications([]);
    toast.success(`${selectedNotifications.length} notifications deleted`);
  };

  const toggleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredNotifications.map(n => n.id);
    if (selectedNotifications.length === visibleIds.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(visibleIds);
    }
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2 flex items-center gap-3">
            <Bell size={32} />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-400">Stay updated with your latest activity</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={handleMarkAllAsRead}
            className="btn-secondary flex items-center gap-2"
            data-testid="mark-all-read-button"
          >
            <Check size={16} />
            Mark All Read
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{notifications.length}</div>
          <div className="text-sm text-gray-400">Total</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{unreadCount}</div>
          <div className="text-sm text-gray-400">Unread</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">
            {notifications.filter(n => n.type === 'like').length}
          </div>
          <div className="text-sm text-gray-400">Likes</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">
            {notifications.filter(n => n.type === 'comment').length}
          </div>
          <div className="text-sm text-gray-400">Comments</div>
        </div>
      </div>

      {/* Filters and Bulk Actions */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'unread', 'read', 'like', 'comment', 'follow', 'video', 'system'].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                data-testid={`filter-${filterType}`}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)} 
                {filterType === 'unread' && unreadCount > 0 && (
                  <span className="ml-1 bg-white bg-opacity-20 px-1 rounded">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={selectAllVisible}
              className="rounded"
            />
            <span className="text-gray-300 text-sm">Select All</span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-pink-500 bg-opacity-10 rounded-lg border border-pink-500 border-opacity-30">
            <span className="text-pink-400 font-medium">
              {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleBulkMarkAsRead}
                className="btn-ghost text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 px-3 py-1 text-sm"
              >
                Mark Read
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn-ghost text-red-400 hover:bg-red-500 hover:bg-opacity-20 px-3 py-1 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedNotifications([])}
                className="btn-ghost text-gray-400 px-3 py-1 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.map((notification) => (
          <div 
            key={notification.id} 
            className={`glass-card p-4 transition-all hover:bg-white hover:bg-opacity-5 ${
              !notification.isRead ? 'bg-pink-500 bg-opacity-5' : ''
            } ${getPriorityColor(notification.priority)}`}
            data-testid={`notification-${notification.id}`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={selectedNotifications.includes(notification.id)}
                onChange={() => toggleSelectNotification(notification.id)}
                className="mt-1 rounded"
              />
              
              <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
                {getNotificationIcon(notification.type, 20)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-semibold ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                    {notification.title}
                    {!notification.isRead && (
                      <span className="ml-2 w-2 h-2 bg-pink-500 rounded-full inline-block"></span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                    {notification.priority === 'urgent' && (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </div>
                </div>
                
                <p className={`mb-3 ${!notification.isRead ? 'text-gray-300' : 'text-gray-400'}`}>
                  {notification.message}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      notification.type === 'like' ? 'bg-pink-900 bg-opacity-20 text-pink-400' :
                      notification.type === 'comment' ? 'bg-blue-900 bg-opacity-20 text-blue-400' :
                      notification.type === 'follow' ? 'bg-green-900 bg-opacity-20 text-green-400' :
                      notification.type === 'video' ? 'bg-purple-900 bg-opacity-20 text-purple-400' :
                      notification.type === 'system' ? 'bg-orange-900 bg-opacity-20 text-orange-400' :
                      'bg-yellow-900 bg-opacity-20 text-yellow-400'
                    }`}>
                      {notification.type.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="btn-ghost px-3 py-1 text-sm text-blue-400 hover:bg-blue-500 hover:bg-opacity-20"
                      >
                        View
                      </a>
                    )}
                    
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20"
                        title="Mark as read"
                      >
                        <Check size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteNotification(notification.id)}
                      className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20"
                      title="Delete notification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredNotifications.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No notifications found</h3>
          <p className="text-gray-400">
            {filter === 'all' 
              ? "You're all caught up! No new notifications at the moment." 
              : `No ${filter} notifications found. Try a different filter.`
            }
          </p>
        </div>
      )}

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center mt-8">
          <button className="btn-secondary">Load More Notifications</button>
        </div>
      )}
    </div>
  );
};

export default Notifications;