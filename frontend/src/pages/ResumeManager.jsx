import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';

const ResumeManager = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Fetch all resumes
  const fetchResumes = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/resumes');
      setResumes(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Upload resume
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (file.type !== 'application/pdf') {
      setMessage('Only PDF files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File size must be under 5MB');
      return;
    }

    setUploading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await api.post('/resumes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResumes([response.data, ...resumes]);
      setMessage(`Resume v${response.data.version} uploaded successfully!`);
    } catch (err) {
      setMessage(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Download resume
  const handleDownload = async (resume) => {
    try {
      const response = await api.get(`/resumes/${resume._id}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', resume.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Download failed');
    }
  };

  // Delete resume
  const handleDelete = async (id) => {
    if (window.confirm('Delete this resume?')) {
      await api.delete(`/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
    }
  };

  // Format file size
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Resume Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload and manage your resumes</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {uploading ? 'Uploading...' : '📄 Upload Resume'}
          </button>
        </div>
      </div>

      {/* Status message */}
      {message && (
        <div className={`text-sm p-3 rounded-lg ${
          message.includes('success') 
            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' 
            : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
        }`}>
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg">
          {error} <button onClick={fetchResumes} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Upload area (when empty) */}
      {!loading && resumes.length === 0 && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-16 text-center cursor-pointer hover:border-blue-400 transition-colors"
        >
          <p className="text-4xl mb-3">📄</p>
          <p className="font-medium text-gray-700 dark:text-gray-300">Upload Your First Resume</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PDF only, max 5MB</p>
        </div>
      )}

      {/* Resume list */}
      {loading ? (
        <p className="text-center py-20 text-gray-500">Loading resumes...</p>
      ) : resumes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">📁 Version History ({resumes.length})</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {resumes.map((resume, index) => (
              <div key={resume._id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-2xl">📄</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-800 dark:text-white text-sm truncate">{resume.originalName}</p>
                      {index === 0 && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">Latest</span>
                      )}
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <span>v{resume.version}</span>
                      <span>{formatSize(resume.fileSize)}</span>
                      <span>{new Date(resume.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => handleDownload(resume)} className="text-xs text-blue-600 hover:underline">Download</button>
                  <button onClick={() => handleDelete(resume._id)} className="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;
