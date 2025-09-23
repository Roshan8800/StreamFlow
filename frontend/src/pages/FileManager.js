import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  File, 
  Image, 
  FileText, 
  Archive, 
  Folder, 
  Search, 
  Filter, 
  Grid, 
  List,
  Trash2,
  Edit3,
  Eye,
  Share2,
  MoreVertical,
  Plus,
  FolderPlus
} from 'lucide-react';
import { toast } from 'sonner';

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    // Mock file data with various types
    const mockFiles = [
      {
        id: '1',
        name: 'video-thumbnail-1.jpg',
        type: 'image',
        size: 245760, // bytes
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-20T14:30:00Z',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=169&fit=crop',
        folder: 'thumbnails'
      },
      {
        id: '2',
        name: 'content-policy.pdf',
        type: 'pdf',
        size: 1024000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-19T10:15:00Z',
        url: '/files/content-policy.pdf',
        folder: 'documents'
      },
      {
        id: '3',
        name: 'video-assets.zip',
        type: 'archive',
        size: 5242880,
        mimeType: 'application/zip',
        uploadedAt: '2024-01-18T16:45:00Z',
        url: '/files/video-assets.zip',
        folder: 'archives'
      },
      {
        id: '4',
        name: 'user-avatars.zip',
        type: 'archive',
        size: 2097152,
        mimeType: 'application/zip',
        uploadedAt: '2024-01-17T08:20:00Z',
        url: '/files/user-avatars.zip',
        folder: 'archives'
      },
      {
        id: '5',
        name: 'banner-image.png',
        type: 'image',
        size: 512000,
        mimeType: 'image/png',
        uploadedAt: '2024-01-16T12:30:00Z',
        url: 'https://images.unsplash.com/photo-1551244072-578d99c90064?w=400&h=200&fit=crop',
        folder: 'images'
      },
      {
        id: '6',
        name: 'terms-of-service.pdf',
        type: 'pdf',
        size: 768000,
        mimeType: 'application/pdf',
        uploadedAt: '2024-01-15T09:45:00Z',
        url: '/files/terms-of-service.pdf',
        folder: 'documents'
      },
      {
        id: '7',
        name: 'logo-variations.zip',
        type: 'archive',
        size: 1536000,
        mimeType: 'application/zip',
        uploadedAt: '2024-01-14T15:20:00Z',
        url: '/files/logo-variations.zip',
        folder: 'assets'
      },
      {
        id: '8',
        name: 'gallery-01.jpg',
        type: 'image',
        size: 387200,
        mimeType: 'image/jpeg',
        uploadedAt: '2024-01-13T11:10:00Z',
        url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=200&h=200&fit=crop',
        folder: 'gallery'
      }
    ];

    setFiles(mockFiles);
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type, size = 24) => {
    switch (type) {
      case 'image':
        return <Image size={size} className="text-blue-400" />;
      case 'pdf':
        return <FileText size={size} className="text-red-400" />;
      case 'archive':
        return <Archive size={size} className="text-yellow-400" />;
      default:
        return <File size={size} className="text-gray-400" />;
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileSelect = (fileId) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map(file => file.id));
    }
  };

  const handleBulkDelete = () => {
    setFiles(files.filter(file => !selectedFiles.includes(file.id)));
    setSelectedFiles([]);
    toast.success(`Deleted ${selectedFiles.length} files successfully!`);
  };

  const handleBulkDownload = () => {
    // Mock bulk download
    toast.success(`Starting download of ${selectedFiles.length} files...`);
    selectedFiles.forEach((fileId, index) => {
      setTimeout(() => {
        const file = files.find(f => f.id === fileId);
        toast.success(`Downloaded: ${file?.name}`);
      }, index * 1000);
    });
    setSelectedFiles([]);
  };

  const handleFileUpload = (uploadData) => {
    const newFiles = uploadData.files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type === 'application/pdf' ? 'pdf' :
            file.type.includes('zip') || file.type.includes('archive') ? 'archive' : 'file',
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date().toISOString(),
      url: URL.createObjectURL(file),
      folder: uploadData.folder || 'uploads'
    }));

    setFiles([...newFiles, ...files]);
    setShowUploadModal(false);
    toast.success(`Uploaded ${newFiles.length} files successfully!`);
  };

  const UploadModal = () => {
    const [dragActive, setDragActive] = useState(false);
    const [uploadFiles, setUploadFiles] = useState([]);
    const [targetFolder, setTargetFolder] = useState('uploads');

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      const droppedFiles = Array.from(e.dataTransfer.files);
      setUploadFiles(droppedFiles);
    };

    const handleFileInput = (e) => {
      const selectedFiles = Array.from(e.target.files);
      setUploadFiles(selectedFiles);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (uploadFiles.length === 0) return;
      
      handleFileUpload({ files: uploadFiles, folder: targetFolder });
    };

    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="glass-card p-6 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Upload Files</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-pink-500 bg-pink-500 bg-opacity-10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-white text-lg mb-2">
                Drag and drop files here, or{' '}
                <label className="text-pink-400 hover:text-pink-300 cursor-pointer underline">
                  browse
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                    accept="image/*,.pdf,.zip,.rar,.7z"
                  />
                </label>
              </p>
              <p className="text-gray-400 text-sm">
                Supports: Images (JPG, PNG, GIF), PDFs, Archives (ZIP, RAR, 7Z)
              </p>
            </div>

            {/* File List */}
            {uploadFiles.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <h3 className="font-semibold text-white">Files to Upload ({uploadFiles.length})</h3>
                {uploadFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    {getFileIcon(
                      file.type.startsWith('image/') ? 'image' : 
                      file.type === 'application/pdf' ? 'pdf' :
                      file.type.includes('zip') ? 'archive' : 'file',
                      16
                    )}
                    <div className="flex-1">
                      <div className="text-white text-sm">{file.name}</div>
                      <div className="text-gray-400 text-xs">{formatFileSize(file.size)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Folder Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Target Folder</label>
              <select
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
                className="input"
              >
                <option value="uploads">Uploads</option>
                <option value="images">Images</option>
                <option value="documents">Documents</option>
                <option value="archives">Archives</option>
                <option value="thumbnails">Thumbnails</option>
                <option value="assets">Assets</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button 
                type="submit" 
                className="btn-primary flex-1"
                disabled={uploadFiles.length === 0}
              >
                Upload {uploadFiles.length} Files
              </button>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient font-['Poppins'] mb-2">File Manager</h1>
          <p className="text-gray-400">Upload, organize, and manage your files</p>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button className="btn-secondary flex items-center gap-2">
            <FolderPlus size={16} />
            New Folder
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2"
            data-testid="upload-files-button"
          >
            <Upload size={16} />
            Upload Files
          </button>
        </div>
      </div>

      {/* File Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">{files.length}</div>
          <div className="text-sm text-gray-400">Total Files</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">
            {files.filter(f => f.type === 'image').length}
          </div>
          <div className="text-sm text-gray-400">Images</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">
            {files.filter(f => f.type === 'pdf').length}
          </div>
          <div className="text-sm text-gray-400">PDFs</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-bold text-gradient">
            {files.filter(f => f.type === 'archive').length}
          </div>
          <div className="text-sm text-gray-400">Archives</div>
        </div>
      </div>

      {/* Controls */}
      <div className="glass-card p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-12"
                data-testid="file-search-input"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input"
              data-testid="file-type-filter"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="pdf">PDFs</option>
              <option value="archive">Archives</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn-ghost p-2 ${viewMode === 'grid' ? 'text-pink-400' : 'text-gray-400'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn-ghost p-2 ${viewMode === 'list' ? 'text-pink-400' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 flex items-center gap-4 p-4 bg-pink-500 bg-opacity-10 rounded-lg border border-pink-500 border-opacity-30">
            <span className="text-pink-400 font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </span>
            
            <div className="flex gap-2">
              <button
                onClick={handleBulkDownload}
                className="btn-ghost text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 px-3 py-1 text-sm"
              >
                <Download size={14} className="mr-1" />
                Download
              </button>
              <button
                onClick={handleBulkDelete}
                className="btn-ghost text-red-400 hover:bg-red-500 hover:bg-opacity-20 px-3 py-1 text-sm"
              >
                <Trash2 size={14} className="mr-1" />
                Delete
              </button>
              <button
                onClick={() => setSelectedFiles([])}
                className="btn-ghost text-gray-400 px-3 py-1 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Select All */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
            onChange={handleSelectAll}
            className="rounded"
          />
          <label className="text-gray-300 text-sm">Select All</label>
        </div>
      </div>

      {/* File Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="glass-card overflow-hidden" data-testid={`file-item-${file.id}`}>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => handleFileSelect(file.id)}
                  className="absolute top-2 left-2 z-10"
                />
                
                {file.type === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 flex items-center justify-center bg-gray-800">
                    {getFileIcon(file.type, 32)}
                  </div>
                )}
                
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded text-xs text-white">
                  {file.type.toUpperCase()}
                </div>
              </div>

              <div className="p-3">
                <h3 className="font-medium text-white text-sm mb-1 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-gray-400 mb-2">{formatFileSize(file.size)}</p>
                <p className="text-xs text-gray-500">{formatDate(file.uploadedAt)}</p>
                
                <div className="flex items-center gap-1 mt-2">
                  <button className="btn-ghost p-1 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20">
                    <Eye size={12} />
                  </button>
                  <button className="btn-ghost p-1 text-green-400 hover:bg-green-500 hover:bg-opacity-20">
                    <Download size={12} />
                  </button>
                  <button className="btn-ghost p-1 text-yellow-400 hover:bg-yellow-500 hover:bg-opacity-20">
                    <Edit3 size={12} />
                  </button>
                  <button className="btn-ghost p-1 text-red-400 hover:bg-red-500 hover:bg-opacity-20">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white bg-opacity-5">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="text-left p-4 text-gray-300 font-medium">Name</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Type</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Size</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Modified</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="border-t border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type, 20)}
                        <span className="text-white">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                        {file.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4 text-gray-300">{formatFileSize(file.size)}</td>
                    <td className="p-4 text-gray-300">{formatDate(file.uploadedAt)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="btn-ghost p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20">
                          <Eye size={16} />
                        </button>
                        <button className="btn-ghost p-2 text-green-400 hover:bg-green-500 hover:bg-opacity-20">
                          <Download size={16} />
                        </button>
                        <button className="btn-ghost p-2 text-yellow-400 hover:bg-yellow-500 hover:bg-opacity-20">
                          <Share2 size={16} />
                        </button>
                        <button className="btn-ghost p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredFiles.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <File size={32} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No files found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Upload your first files to get started.'
            }
          </p>
          {!searchQuery && filterType === 'all' && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Upload size={16} />
              Upload Files
            </button>
          )}
        </div>
      )}

      <UploadModal />
    </div>
  );
};

export default FileManager;