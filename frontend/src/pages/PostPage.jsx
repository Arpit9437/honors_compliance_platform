import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { Calendar, Clock, Tag, Bookmark, BookmarkCheck, ArrowLeft, Share2 } from 'lucide-react';

const PostPage = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          // Check bookmark status
          try {
            if (currentUser) {
              const bmRes = await fetch('/api/user/bookmarks', { credentials: 'include' });
              const bmData = await bmRes.json();
              if (bmRes.ok) {
                const ids = (bmData.bookmarks || []).map((b) => b._id);
                setIsBookmarked(ids.includes(data.posts[0]._id));
              }
            }
          } catch (err) {
            console.log(err.message);
          }
          setLoading(false);
          setError(false);
        }
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug, currentUser]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getPosts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleBookmark = async () => {
    if (!currentUser) {
      return;
    }
    setBookmarkLoading(true);
    try {
      const res = await fetch(`/api/user/bookmark/${post._id}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        setIsBookmarked((b) => !b);
      } else {
        const body = await res.json().catch(() => ({}));
        console.log('Bookmark failed', body.error || body.message);
      }
    } catch (err) {
      console.log(err.message);
    } finally {
      setBookmarkLoading(false);
    }
  };

  const categoryColors = {
    tax: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    labor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    finance: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    compliance: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    schemes: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Post Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The post you're looking for doesn't exist.</p>
          <Link to="/">
            <Button className="mt-4">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Button */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Updates</span>
          </Link>
        </div>
      </div>

      {/* Post Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden fade-in">
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Category Badge */}
            <Link to={`/search?category=${post.category}`}>
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${categoryColors[post.category] || 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
            </Link>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mt-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{(post.content.length / 1000).toFixed(0)} min read</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              {currentUser && (
                <button
                  onClick={handleBookmark}
                  disabled={bookmarkLoading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isBookmarked
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {bookmarkLoading ? (
                    <Spinner size="sm" />
                  ) : isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                  <span>{isBookmarked ? 'Saved' : 'Save'}</span>
                </button>
              )}
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>

            {/* Content */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div
                className="post-content prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              ></div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden fade-in" style={{ animationDelay: '100ms' }}>
          <CommentSection postId={post._id} />
        </div>

        {/* Recent Posts */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="mt-12 fade-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Updates
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPosts.map((recentPost) => (
                <PostCard key={recentPost._id} post={recentPost} />
              ))}
            </div>
          </div>
        )}
      </article>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .prose {
          color: inherit;
        }

        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4,
        .prose h5,
        .prose h6 {
          color: inherit;
        }

        .prose strong {
          color: inherit;
          font-weight: 600;
        }

        .prose a {
          color: rgb(37, 99, 235);
          text-decoration: none;
        }

        .dark .prose a {
          color: rgb(96, 165, 250);
        }

        .prose a:hover {
          text-decoration: underline;
        }
      `}</style>
    </main>
  );
};

export default PostPage;