import { Alert, Button, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FileEdit, Save, AlertCircle, Tag, Type, Loader } from 'lucide-react';

export default function UpdatePost() {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const categories = [
    { value: 'uncategorized', label: 'Select a category', icon: '📋' },
    { value: 'tax', label: 'Tax Regulations', icon: '📊' },
    { value: 'labor', label: 'Labour Laws', icon: '👥' },
    { value: 'finance', label: 'Finance & Banking', icon: '💰' },
    { value: 'compliance', label: 'Corporate Compliance', icon: '⚖️' },
    { value: 'schemes', label: 'Government Schemes', icon: '🏛️' },
  ];

  useEffect(() => {
    try {
      const fetchPost = async () => {
        setIsLoading(true);
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
          setPublishError(data.message);
          setIsLoading(false);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
          setIsLoading(false);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
      setPublishError('Failed to load post');
      setIsLoading(false);
    }
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const res = await fetch(`/api/post/updatepost/${postId}/${currentUser._id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setPublishError(data.message);
        setIsSubmitting(false);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
      }
    } catch (error) {
      setPublishError('Something went wrong. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <FileEdit className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Update Post
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Make changes to your compliance update
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 fade-in" style={{ animationDelay: '100ms' }}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Title Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Post Title
              </label>
              <TextInput
                type="text"
                placeholder="Enter a clear, descriptive title..."
                required
                id="title"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                value={formData.title || ''}
              />
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Category
              </label>
              <Select
                required
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                value={formData.category || 'uncategorized'}
                className="w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </Select>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <FileEdit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Content
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <ReactQuill
                  theme="snow"
                  value={formData.content || ''}
                  placeholder="Write detailed information about the regulatory update..."
                  className="h-80"
                  required
                  onChange={(value) => {
                    setFormData((prevFormData) => ({ ...prevFormData, content: value }));
                  }}
                />
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                    Important Note
                  </p>
                  <p className="text-xs text-yellow-800 dark:text-yellow-400">
                    Make sure all changes are accurate and verified. Updated posts will immediately reflect for all users.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            {publishError && (
              <Alert color="failure" className="animate-fadeIn">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span>{publishError}</span>
                </div>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Update Post
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Last Updated Info */}
        {formData.updatedAt && (
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 fade-in" style={{ animationDelay: '200ms' }}>
            <p>
              Last updated: {new Date(formData.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        .ql-container {
          min-height: 320px;
          font-size: 1rem;
        }

        .ql-editor {
          min-height: 320px;
        }

        .ql-editor.ql-blank::before {
          color: rgb(156, 163, 175);
          font-style: normal;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}