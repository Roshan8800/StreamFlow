import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  Upload,
  Youtube,
  ExternalLink,
  Plus,
  Check,
  X,
  Eye
} from 'lucide-react';


export default function ContentSubmissionPage() {
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState<'video' | 'link'>('video');
  const [categories, setCategories] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    embed_code: '',
    thumbnail_url: '',
    duration: '',
    category_id: '',
    tags: ''
  });

  const [linkForm, setLinkForm] = useState({
    title: '',
    description: '',
    url: '',
    thumbnail_url: '',
    category_id: '',
    tags: ''
  });

  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchUserSubmissions();
    }
  }, [user]);

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

  const fetchUserSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/content-submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateYouTubeEmbed = (embedCode: string): boolean => {
    return embedCode.includes('youtube.com/embed/') &&
           embedCode.includes('<iframe') &&
           embedCode.includes('</iframe>');
  };

  const validateURL = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const extractYouTubeThumbnail = (embedCode: string): string => {
    const match = embedCode.match(/youtube\.com\/embed\/([^"?]+)/);
    if (match) {
      return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
    }
    return '';
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateYouTubeEmbed(videoForm.embed_code)) {
      alert('Please enter a valid YouTube embed code');
      return;
    }

    setSubmitting(true);
    try {
      const thumbnail = videoForm.thumbnail_url || extractYouTubeThumbnail(videoForm.embed_code);
      const tags = videoForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch('/api/content-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_type: 'video_embed',
          title: videoForm.title,
          description: videoForm.description,
          content_data: JSON.stringify({
            embed_code: videoForm.embed_code,
            duration: videoForm.duration
          }),
          thumbnail_url: thumbnail,
          category_id: videoForm.category_id ? parseInt(videoForm.category_id) : null,
          tags: JSON.stringify(tags)
        })
      });

      if (response.ok) {
        alert('Video submitted successfully! It will be reviewed by admins.');
        setVideoForm({
          title: '',
          description: '',
          embed_code: '',
          thumbnail_url: '',
          duration: '',
          category_id: '',
          tags: ''
        });
        fetchUserSubmissions();
      } else {
        alert('Error submitting video. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting video:', error);
      alert('Error submitting video. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateURL(linkForm.url)) {
      alert('Please enter a valid URL');
      return;
    }

    setSubmitting(true);
    try {
      const tags = linkForm.tags.split(',').map(tag => tag.trim()).filter(Boolean);

      const response = await fetch('/api/content-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_type: 'external_link',
          title: linkForm.title,
          description: linkForm.description,
          content_data: JSON.stringify({
            url: linkForm.url
          }),
          thumbnail_url: linkForm.thumbnail_url,
          category_id: linkForm.category_id ? parseInt(linkForm.category_id) : null,
          tags: JSON.stringify(tags)
        })
      });

      if (response.ok) {
        alert('Link submitted successfully! It will be reviewed by admins.');
        setLinkForm({
          title: '',
          description: '',
          url: '',
          thumbnail_url: '',
          category_id: '',
          tags: ''
        });
        fetchUserSubmissions();
      } else {
        alert('Error submitting link. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting link:', error);
      alert('Error submitting link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Eye className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-500/10';
      case 'rejected':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-yellow-500 bg-yellow-500/10';
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-gray-400">Please sign in to submit content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Submit Content</h1>
          <p className="text-gray-400">Share videos and links with the community</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-8">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'video'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Youtube className="w-5 h-5" />
            <span>YouTube Video</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
              activeTab === 'link'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ExternalLink className="w-5 h-5" />
            <span>External Link</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submission Form */}
          <div className="lg:col-span-2">
            {activeTab === 'video' ? (
              <form onSubmit={handleVideoSubmit} className="bg-gray-900/50 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Youtube className="w-5 h-5" />
                  <span>Submit YouTube Video</span>
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    YouTube Embed Code *
                  </label>
                  <textarea
                    required
                    value={videoForm.embed_code}
                    onChange={(e) => setVideoForm({ ...videoForm, embed_code: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder='<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>'
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the complete YouTube embed iframe code
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="Describe the video content"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 10:30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={videoForm.category_id}
                      onChange={(e) => setVideoForm({ ...videoForm, category_id: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={videoForm.thumbnail_url}
                    onChange={(e) => setVideoForm({ ...videoForm, thumbnail_url: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/thumbnail.jpg (optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-generate from YouTube
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={videoForm.tags}
                    onChange={(e) => setVideoForm({ ...videoForm, tags: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Submit Video</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLinkSubmit} className="bg-gray-900/50 rounded-xl p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <ExternalLink className="w-5 h-5" />
                  <span>Submit External Link</span>
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={linkForm.title}
                    onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter link title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={linkForm.url}
                    onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={linkForm.description}
                    onChange={(e) => setLinkForm({ ...linkForm, description: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="Describe the linked content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={linkForm.category_id}
                    onChange={(e) => setLinkForm({ ...linkForm, category_id: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    value={linkForm.thumbnail_url}
                    onChange={(e) => setLinkForm({ ...linkForm, thumbnail_url: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={linkForm.tags}
                    onChange={(e) => setLinkForm({ ...linkForm, tags: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate tags with commas
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      <span>Submit Link</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Submissions History */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Your Submissions</span>
              </h3>

              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              ) : submissions.length > 0 ? (
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="bg-gray-800/50 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-white font-medium text-sm line-clamp-2">
                          {submission.title}
                        </h4>
                        <div className={`px-2 py-1 rounded text-xs ${getStatusColor(submission.status)}`}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(submission.status)}
                            <span className="capitalize">{submission.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span className="capitalize">{submission.submission_type.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                      </div>
                      {submission.admin_notes && (
                        <p className="text-xs text-gray-500 mt-2">
                          Admin: {submission.admin_notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No submissions yet.</p>
              )}
            </div>

            {/* Guidelines */}
            <div className="bg-gray-900/50 rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Submission Guidelines</h3>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Only YouTube official embed codes are accepted</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>External links must be safe and relevant</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>All submissions are reviewed by admins</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Provide accurate titles and descriptions</span>
                </div>
                <div className="flex items-start space-x-2">
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>No inappropriate or copyrighted content</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
