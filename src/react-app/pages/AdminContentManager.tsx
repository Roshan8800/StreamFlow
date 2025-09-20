import { useState, useEffect } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import {
  Check,
  X,
  Eye,
  Youtube,
  ExternalLink,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';


interface Submission {
  id: number;
  user_id: string;
  submission_type: string;
  title: string;
  description?: string;
  content_data: string;
  thumbnail_url?: string;
  category_name?: string;
  submitter_name?: string;
  tags?: string;
  status: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export default function AdminContentManagerPage() {
  const { user, isPending } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  // Check if user is admin
  const isAdmin = user?.email === 'admin@streamflow.com' || user?.email?.includes('admin');

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubmissions();
    }
  }, [user, isAdmin, activeTab]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions?status=${activeTab}`);
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

  const handleReview = async (submissionId: number, status: 'approved' | 'rejected') => {
    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          admin_notes: reviewNotes
        })
      });

      if (response.ok) {
        alert(`Submission ${status} successfully!`);
        setSelectedSubmission(null);
        setReviewNotes('');
        fetchSubmissions();
      } else {
        alert('Error updating submission');
      }
    } catch (error) {
      console.error('Error reviewing submission:', error);
      alert('Error updating submission');
    } finally {
      setProcessing(false);
    }
  };

  const renderContentPreview = (submission: Submission) => {
    const contentData = JSON.parse(submission.content_data);

    if (submission.submission_type === 'video_embed') {
      return (
        <div className="space-y-4">
          <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <div
              dangerouslySetInnerHTML={{ __html: contentData.embed_code }}
              className="w-full h-full"
            />
          </div>
          {contentData.duration && (
            <p className="text-sm text-gray-400">Duration: {contentData.duration}</p>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-blue-400 font-mono text-sm break-all">{contentData.url}</p>
            </div>
          </div>
        </div>
      );
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Admin access required to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-400">Review and manage user-submitted content</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-900/50 rounded-lg p-1 mb-8">
          {[
            { id: 'pending', label: 'Pending Review', icon: Eye },
            { id: 'approved', label: 'Approved', icon: Check },
            { id: 'rejected', label: 'Rejected', icon: X }
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
              </div>
            ) : submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`bg-gray-900/50 rounded-xl p-6 cursor-pointer transition-all hover:bg-gray-900/70 ${
                      selectedSubmission?.id === submission.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {submission.submission_type === 'video_embed' ? (
                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                              <Youtube className="w-5 h-5 text-white" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                              <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold line-clamp-2 mb-1">
                            {submission.title}
                          </h3>
                          {submission.description && (
                            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
                              {submission.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{submission.submitter_name || 'Unknown'}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                            </span>
                            {submission.category_name && (
                              <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                {submission.category_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {submission.tags && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {JSON.parse(submission.tags).slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Admin Notes */}
                    {submission.admin_notes && (
                      <div className="bg-gray-800/50 rounded-lg p-3 mt-3">
                        <p className="text-gray-400 text-sm flex items-start space-x-2">
                          <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{submission.admin_notes}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No submissions</h3>
                <p className="text-gray-500">
                  No {activeTab} submissions found.
                </p>
              </div>
            )}
          </div>

          {/* Review Panel */}
          <div className="lg:col-span-1">
            {selectedSubmission ? (
              <div className="bg-gray-900/50 rounded-xl p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-white mb-4">Review Submission</h3>

                {/* Submission Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-white font-medium mb-1">{selectedSubmission.title}</h4>
                    {selectedSubmission.description && (
                      <p className="text-gray-400 text-sm">{selectedSubmission.description}</p>
                    )}
                  </div>

                  {/* Content Preview */}
                  {renderContentPreview(selectedSubmission)}

                  {/* Metadata */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white capitalize">
                        {selectedSubmission.submission_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Submitter:</span>
                      <span className="text-white">{selectedSubmission.submitter_name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Submitted:</span>
                      <span className="text-white">
                        {new Date(selectedSubmission.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedSubmission.category_name && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white">{selectedSubmission.category_name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review Notes */}
                {activeTab === 'pending' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Review Notes (optional)
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-20"
                        placeholder="Add notes for the submitter..."
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleReview(selectedSubmission.id, 'approved')}
                        disabled={processing}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {processing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleReview(selectedSubmission.id, 'rejected')}
                        disabled={processing}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                      >
                        {processing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}

                {/* Already Reviewed */}
                {activeTab !== 'pending' && selectedSubmission.admin_notes && (
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-2">Admin Notes:</h4>
                    <p className="text-gray-400 text-sm">{selectedSubmission.admin_notes}</p>
                    {selectedSubmission.reviewed_at && (
                      <p className="text-gray-500 text-xs mt-2">
                        Reviewed on {new Date(selectedSubmission.reviewed_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-900/50 rounded-xl p-6 text-center">
                <Eye className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-white font-medium mb-2">Select a submission</h3>
                <p className="text-gray-400 text-sm">
                  Click on a submission to review its details and take action.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
