import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  User,
  Bell,
  Shield,
  Eye,
  Monitor,
  Smartphone,
  Tv,
  Save,
  RefreshCw
} from 'lucide-react';
import LoadingSpinner from '@/react-app/components/LoadingSpinner';

interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    newContent: boolean;
    recommendations: boolean;
    comments: boolean;
  };
  privacy: {
    profileVisible: boolean;
    activityVisible: boolean;
    allowRecommendations: boolean;
    showInSearch: boolean;
  };
  playback: {
    autoplay: boolean;
    quality: string;
    volume: number;
    subtitles: boolean;
    theater: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  language: string;
  theme: string;
}

export default function SettingsPage() {
  const { user, isPending } = useAuth();
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      email: true,
      push: true,
      newContent: true,
      recommendations: true,
      comments: true,
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      allowRecommendations: true,
      showInSearch: true,
    },
    playback: {
      autoplay: true,
      quality: 'HD',
      volume: 80,
      subtitles: false,
      theater: false,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      screenReader: false,
    },
    language: 'en',
    theme: 'dark',
  });
  const [activeTab, setActiveTab] = useState('account');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const response = await fetch('/api/user-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({
          ...prev,
          notifications: data.preferences?.notifications || prev.notifications,
          privacy: data.privacy_settings || prev.privacy,
          playback: data.preferences?.playback || prev.playback,
          accessibility: data.preferences?.accessibility || prev.accessibility,
          language: data.preferences?.language || prev.language,
          theme: data.preferences?.theme || prev.theme,
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/user-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            notifications: settings.notifications,
            playback: settings.playback,
            accessibility: settings.accessibility,
            language: settings.language,
            theme: settings.theme,
          },
          privacy_settings: settings.privacy,
        }),
      });

      if (response.ok) {
        // Show success message
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as Record<string, any>),
        [key]: value,
      },
    }));
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'playback', label: 'Playback', icon: Eye },
    { id: 'accessibility', label: 'Accessibility', icon: Monitor },
  ];

  if (isPending || loading) {
    return <LoadingSpinner className="min-h-screen" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account preferences and settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Settings Navigation */}
          <div className="lg:w-64">
            <nav className="bg-gray-900/50 rounded-xl p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-gray-900/50 rounded-xl p-8">
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                      <select
                        value={settings.theme}
                        onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Device Preferences</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <Monitor className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium">Desktop</h4>
                        <p className="text-gray-400 text-sm">Optimized for large screens</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <Smartphone className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium">Mobile</h4>
                        <p className="text-gray-400 text-sm">Touch-friendly interface</p>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                        <Tv className="w-8 h-8 text-green-400 mx-auto mb-2" />
                        <h4 className="text-white font-medium">TV</h4>
                        <p className="text-gray-400 text-sm">Living room experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                      { key: 'newContent', label: 'New Content', description: 'Notify when new videos are uploaded' },
                      { key: 'recommendations', label: 'Recommendations', description: 'Personalized content suggestions' },
                      { key: 'comments', label: 'Comments & Replies', description: 'Activity on your comments' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[setting.key as keyof typeof settings.notifications]}
                            onChange={(e) => updateSetting('notifications', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Privacy Settings</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'profileVisible', label: 'Public Profile', description: 'Make your profile visible to other users' },
                      { key: 'activityVisible', label: 'Activity Visibility', description: 'Show your viewing activity' },
                      { key: 'allowRecommendations', label: 'Personalized Recommendations', description: 'Use viewing history for recommendations' },
                      { key: 'showInSearch', label: 'Discoverable in Search', description: 'Allow others to find your profile' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy[setting.key as keyof typeof settings.privacy]}
                            onChange={(e) => updateSetting('privacy', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'playback' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Playback Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Default Quality</label>
                      <select
                        value={settings.playback.quality}
                        onChange={(e) => updateSetting('playback', 'quality', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="Auto">Auto</option>
                        <option value="4K">4K</option>
                        <option value="HD">HD</option>
                        <option value="SD">SD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Volume: {settings.playback.volume}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.playback.volume}
                        onChange={(e) => updateSetting('playback', 'volume', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'autoplay', label: 'Autoplay', description: 'Automatically play next video' },
                      { key: 'subtitles', label: 'Subtitles', description: 'Show subtitles when available' },
                      { key: 'theater', label: 'Theater Mode', description: 'Default to theater mode' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.playback[setting.key as keyof typeof settings.playback] as boolean}
                            onChange={(e) => updateSetting('playback', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white mb-6">Accessibility Settings</h2>

                  <div className="space-y-4">
                    {[
                      { key: 'highContrast', label: 'High Contrast', description: 'Increase contrast for better visibility' },
                      { key: 'largeText', label: 'Large Text', description: 'Increase text size throughout the app' },
                      { key: 'reducedMotion', label: 'Reduced Motion', description: 'Minimize animations and transitions' },
                      { key: 'screenReader', label: 'Screen Reader Support', description: 'Optimize for screen readers' },
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">{setting.label}</h4>
                          <p className="text-gray-400 text-sm">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.accessibility[setting.key as keyof typeof settings.accessibility]}
                            onChange={(e) => updateSetting('accessibility', setting.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-700">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={saveSettings}
                  disabled={saving}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
