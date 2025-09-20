import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { User, Settings, Heart, Clock, Star, Edit, Save, X } from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';
import type { UserProfile } from '@/shared/types';

export default function ProfilePage() {
  const { user, isPending } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    display_name: '',
    bio: '',
    preferences: {} as Record<string, any>,
    privacy_settings: {} as Record<string, any>
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditForm({
          display_name: data.display_name || '',
          bio: data.bio || '',
          preferences: data.preferences ? JSON.parse(data.preferences) : {},
          privacy_settings: data.privacy_settings ? JSON.parse(data.privacy_settings) : {}
        });
      } else if (response.status === 404) {
        // Profile doesn't exist, create one
        await createProfile();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: user?.google_user_data.name || '',
          preferences: {
            theme: 'dark',
            autoplay: true,
            quality_preference: 'HD'
          },
          privacy_settings: {
            show_activity: true,
            allow_recommendations: true
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        preferences: profile.preferences ? JSON.parse(profile.preferences) : {},
        privacy_settings: profile.privacy_settings ? JSON.parse(profile.privacy_settings) : {}
      });
    }
    setEditing(false);
  };

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-900/50 rounded-xl p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                {user.google_user_data.picture ? (
                  <img
                    src={user.google_user_data.picture}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {editing ? (
                    <input
                      type="text"
                      value={editForm.display_name}
                      onChange={(e) => setEditForm({ ...editForm, display_name: e.target.value })}
                      placeholder="Display name"
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    profile?.display_name || user.google_user_data.name || 'Unnamed User'
                  )}
                </h1>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            {editing ? (
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            ) : (
              <p className="text-gray-300">
                {profile?.bio || 'No bio available. Click edit to add one!'}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Activity Stats</span>
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">0</div>
                  <div className="text-sm text-gray-400">Videos Watched</div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">0</div>
                  <div className="text-sm text-gray-400">Hours Watched</div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">0</div>
                  <div className="text-sm text-gray-400">Favorites</div>
                </div>

                <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">0</div>
                  <div className="text-sm text-gray-400">Reviews</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Recent Activity</span>
              </h2>

              <div className="text-center py-8 text-gray-400">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p>No recent activity to show.</p>
                <p className="text-sm">Start watching videos to see your activity here!</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Subscription</h3>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-1">
                  {profile?.subscription_tier || 'Free'}
                </h4>
                <p className="text-sm text-gray-400 mb-4">Current plan</p>
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg transition-all">
                  Upgrade Plan
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 text-left p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white">My Favorites</span>
                </button>

                <button className="w-full flex items-center space-x-3 text-left p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span className="text-white">Watch History</span>
                </button>

                <button className="w-full flex items-center space-x-3 text-left p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white">My Reviews</span>
                </button>

                <button className="w-full flex items-center space-x-3 text-left p-3 bg-gray-800/50 hover:bg-gray-700 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-400" />
                  <span className="text-white">Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
