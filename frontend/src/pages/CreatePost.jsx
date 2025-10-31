import { Alert, Button, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { FileText, Send, AlertCircle, Tag, Type } from "lucide-react";

const CreatePost = () => {
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { value: "uncategorized", label: "Select a category", icon: "📋" },
    { value: "tax", label: "Tax Regulations", icon: "📊" },
    { value: "labor", label: "Labour Laws", icon: "👥" },
    { value: "finance", label: "Finance & Banking", icon: "💰" },
    { value: "compliance", label: "Corporate Compliance", icon: "⚖️" },
    { value: "schemes", label: "Government Schemes", icon: "🏛️" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setPublishError(null);

    try {
      const res = await fetch(`/api/post/create`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
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
      setPublishError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Create Compliance Update
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share important regulatory changes with the community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 fade-in" style={{ animationDelay: "100ms" }}>
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
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Choose a title that clearly describes the regulatory update
              </p>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <Tag className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Category
              </label>
              <Select
                required
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select the most relevant compliance area
              </p>
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Content
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <ReactQuill
                  theme="snow"
                  placeholder="Write detailed information about the regulatory update..."
                  className="h-80"
                  required
                  onChange={(value) => {
                    setFormData((prevFormData) => ({ ...prevFormData, content: value }));
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Provide comprehensive details including effective dates, implications, and action items
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    Guidelines for posting
                  </p>
                  <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-disc list-inside">
                    <li>Ensure all information is accurate and verified</li>
                    <li>Include relevant dates and deadlines</li>
                    <li>Link to official sources when possible</li>
                    <li>Use clear and professional language</li>
                  </ul>
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

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Publish Update
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

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 fade-in" style={{ animationDelay: "200ms" }}>
          <p>
            Need help? Check out our{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              posting guidelines
            </a>{" "}
            or{" "}
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              contact support
            </a>
          </p>
        </div>
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
      `}</style>
    </div>
  );
};

export default CreatePost;