import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor,
  Lock,
  Key,
  Mail,
  Smartphone,
  Camera,
  Volume2,
  VolumeX
} from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile Settings
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    avatar: user?.avatar || null,
    
    // Privacy Settings
    profileVisibility: 'public',
    showActivity: true,
    showWatchHistory: false,
    allowComments: true,
    allowMessages: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    commentNotifications: true,
    likeNotifications: false,
    followNotifications: true,
    weeklyDigest: true,
    
    // Display Settings
    theme: 'dark',
    language: 'en',
    autoplay: true,
    videoQuality: 'auto',
    subtitles: false,
    volume: 80,
    
    // Security Settings
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    downloadHistory: true
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Setting updated successfully!');
  };

  const handleSaveProfile = () => {
    // Mock save profile
    toast.success('Profile updated successfully!');
  };

  const handleExportData = () => {
    // Mock data export
    toast.success('Data export started! You will receive an email when ready.');
  };

  const handleDeleteAccount = () => {
    // Mock account deletion
    toast.error('Account deletion is irreversible. Contact support if you\'re sure.');
  };

  const SettingsSection = ({ title, children }) => (
    <div className="glass-card p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-6">{title}</h2>
      {children}
    </div>
  );

  const SettingItem = ({ icon: Icon, title, description, children, action }) => (
    <div className="flex items-start gap-4 py-4 border-b border-white border-opacity-10 last:border-b-0">
      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400 mb-3">{description}</p>
        <div className="flex items-center gap-4">
          {children}
          {action}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeTab === id
          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
          : 'hover:bg-white hover:bg-opacity-10 text-gray-300'
      }`}
      data-testid={`settings-tab-${id}`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="fade-in max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and privacy settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 space-y-2">
            <TabButton id="profile" icon={User} label="Profile" />
            <TabButton id="privacy" icon={Shield} label="Privacy" />
            <TabButton id="notifications" icon={Bell} label="Notifications" />
            <TabButton id="display" icon={Palette} label="Display" />
            <TabButton id="security" icon={Lock} label="Security" />
            <TabButton id="data" icon={Download} label="Data & Export" />
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div>
              <SettingsSection title="Profile Information">
                <SettingItem
                  icon={Camera}
                  title="Profile Picture"
                  description="Upload a profile picture to personalize your account"
                  action={
                    <button className="btn-secondary text-sm">
                      Change Avatar
                    </button>
                  }
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {settings.username.charAt(0)?.toUpperCase()}
                  </div>
                </SettingItem>

                <SettingItem
                  icon={User}
                  title="Username"
                  description="Your unique username displayed on your profile"
                >
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => handleSettingChange('profile', 'username', e.target.value)}
                    className="input max-w-xs"
                    data-testid="username-input"
                  />
                </SettingItem>

                <SettingItem
                  icon={Mail}
                  title="Email Address"
                  description="Your email address for account notifications and recovery"
                >
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                    className="input max-w-xs"
                    data-testid="email-input"
                  />
                </SettingItem>

                <div className="pt-4">
                  <button onClick={handleSaveProfile} className="btn-primary">
                    Save Profile Changes
                  </button>
                </div>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div>
              <SettingsSection title="Privacy Controls">
                <SettingItem
                  icon={Globe}
                  title="Profile Visibility"
                  description="Control who can see your profile and activity"
                >
                  <select
                    value={settings.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                    className="input max-w-xs"
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </SettingItem>

                <SettingItem
                  icon={Eye}
                  title="Show Activity Status"
                  description="Let others see when you're online and active"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.showActivity}
                      onChange={(e) => handleSettingChange('privacy', 'showActivity', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Show my activity status</span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={EyeOff}
                  title="Watch History"
                  description="Control visibility of your watch history to other users"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.showWatchHistory}
                      onChange={(e) => handleSettingChange('privacy', 'showWatchHistory', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Make watch history public</span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={Mail}
                  title="Comments & Messages"
                  description="Control who can comment on your content and send you messages"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.allowComments}
                        onChange={(e) => handleSettingChange('privacy', 'allowComments', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-300">Allow comments on my content</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.allowMessages}
                        onChange={(e) => handleSettingChange('privacy', 'allowMessages', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-300">Allow direct messages</span>
                    </label>
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <SettingsSection title="Notification Preferences">
                <SettingItem
                  icon={Mail}
                  title="Email Notifications"
                  description="Receive important updates and notifications via email"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Enable email notifications</span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={Smartphone}
                  title="Push Notifications"
                  description="Receive real-time notifications on your device"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Enable push notifications</span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={Bell}
                  title="Activity Notifications"
                  description="Get notified about comments, likes, and follows"
                >
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.commentNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'commentNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-300">Comments on my content</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.likeNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'likeNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-300">Likes on my content</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={settings.followNotifications}
                        onChange={(e) => handleSettingChange('notifications', 'followNotifications', e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-300">New followers</span>
                    </label>
                  </div>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'display' && (
            <div>
              <SettingsSection title="Display & Playback">
                <SettingItem
                  icon={Moon}
                  title="Theme"
                  description="Choose your preferred color scheme"
                >
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
                    className="input max-w-xs"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="auto">Auto</option>
                  </select>
                </SettingItem>

                <SettingItem
                  icon={Globe}
                  title="Language"
                  description="Select your preferred language for the interface"
                >
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('display', 'language', e.target.value)}
                    className="input max-w-xs"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </SettingItem>

                <SettingItem
                  icon={Volume2}
                  title="Default Volume"
                  description="Set the default volume level for video playback"
                >
                  <div className="flex items-center gap-4 max-w-xs">
                    <VolumeX size={16} className="text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.volume}
                      onChange={(e) => handleSettingChange('display', 'volume', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <Volume2 size={16} className="text-gray-400" />
                    <span className="text-white text-sm min-w-[3rem]">{settings.volume}%</span>
                  </div>
                </SettingItem>

                <SettingItem
                  icon={Monitor}
                  title="Video Quality"
                  description="Choose default video quality for playback"
                >
                  <select
                    value={settings.videoQuality}
                    onChange={(e) => handleSettingChange('display', 'videoQuality', e.target.value)}
                    className="input max-w-xs"
                  >
                    <option value="auto">Auto</option>
                    <option value="1080p">1080p HD</option>
                    <option value="720p">720p HD</option>
                    <option value="480p">480p</option>
                    <option value="360p">360p</option>
                  </select>
                </SettingItem>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <SettingsSection title="Security Settings">
                <SettingItem
                  icon={Key}
                  title="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                  action={
                    <button className="btn-secondary text-sm">
                      {settings.twoFactorAuth ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                  }
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">
                      {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={Bell}
                  title="Login Alerts"
                  description="Get notified when someone logs into your account"
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.loginAlerts}
                      onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-gray-300">Send login alerts</span>
                  </label>
                </SettingItem>

                <SettingItem
                  icon={Lock}
                  title="Session Timeout"
                  description="Automatically log out after inactivity"
                >
                  <select
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                    className="input max-w-xs"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={240}>4 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </SettingItem>

                <div className="pt-4 space-y-3">
                  <button className="btn-secondary w-full">
                    Change Password
                  </button>
                  <button className="btn-secondary w-full">
                    View Active Sessions
                  </button>
                </div>
              </SettingsSection>
            </div>
          )}

          {activeTab === 'data' && (
            <div>
              <SettingsSection title="Data Management">
                <SettingItem
                  icon={Download}
                  title="Download Your Data"
                  description="Get a copy of all your data including profile, history, and preferences"
                  action={
                    <button onClick={handleExportData} className="btn-secondary text-sm">
                      Request Export
                    </button>
                  }
                >
                  <p className="text-gray-300 text-sm">
                    Export includes: Profile data, watch history, playlists, comments, and settings
                  </p>
                </SettingItem>

                <SettingItem
                  icon={Trash2}
                  title="Clear Watch History"
                  description="Remove all videos from your watch history"
                  action={
                    <button className="btn-ghost text-red-400 hover:bg-red-500 hover:bg-opacity-20 text-sm">
                      Clear History
                    </button>
                  }
                >
                  <p className="text-gray-300 text-sm">
                    This action cannot be undone. Your recommendations may be affected.
                  </p>
                </SettingItem>

                <SettingItem
                  icon={Trash2}
                  title="Delete Account"
                  description="Permanently delete your account and all associated data"
                  action={
                    <button onClick={handleDeleteAccount} className="btn-ghost text-red-400 hover:bg-red-500 hover:bg-opacity-20 text-sm">
                      Delete Account
                    </button>
                  }
                >
                  <p className="text-red-400 text-sm font-medium">
                    ⚠️ This action is irreversible. All your data will be permanently deleted.
                  </p>
                </SettingItem>
              </SettingsSection>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;