import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Table, TextInput } from "flowbite-react";
import {
  MessageSquare,
  Trash2,
  AlertTriangle,
  Search,
  Heart,
  Calendar,
  TrendingUp,
  Filter,
  MessageCircle,
  User,
  FileText,
} from "lucide-react";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/getComments`);
        const data = await res.json();

        if (res.ok) {
          setComments(data.comments);
          setFilteredComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = comments.filter((comment) =>
        comment.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComments(filtered);
    } else {
      setFilteredComments(comments);
    }
  }, [searchTerm, comments]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(
        `/api/comment/getcomments?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const totalLikes = comments.reduce(
    (sum, comment) => sum + comment.numberOfLikes,
    0
  );
  const avgLikes = comments.length > 0 ? (totalLikes / comments.length).toFixed(1) : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-blue-500" />
          Comment Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Monitor and moderate user comments across all posts
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Comments</p>
              <p className="text-3xl font-bold mt-2">{comments.length}</p>
            </div>
            <MessageCircle className="w-12 h-12 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total Likes</p>
              <p className="text-3xl font-bold mt-2">{totalLikes}</p>
            </div>
            <Heart className="w-12 h-12 text-pink-200" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Avg Likes/Comment</p>
              <p className="text-3xl font-bold mt-2">{avgLikes}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Search Comments
          </h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <TextInput
            type="text"
            placeholder="Search by comment content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
          Showing {filteredComments.length} of {comments.length} comments
        </p>
      </div>

      {/* Comments Table */}
      {currentUser.isAdmin && comments.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Created
                </Table.HeadCell>
                <Table.HeadCell>
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Updated
                </Table.HeadCell>
                <Table.HeadCell>
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  Comment Content
                </Table.HeadCell>
                <Table.HeadCell>
                  <Heart className="w-4 h-4 inline mr-2" />
                  Likes
                </Table.HeadCell>
                <Table.HeadCell>
                  <FileText className="w-4 h-4 inline mr-2" />
                  Post ID
                </Table.HeadCell>
                <Table.HeadCell>
                  <User className="w-4 h-4 inline mr-2" />
                  User ID
                </Table.HeadCell>
                <Table.HeadCell>Action</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {filteredComments.map((comment) => (
                  <Table.Row
                    key={comment._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap">
                      {new Date(comment.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell className="max-w-md">
                      <div className="line-clamp-2 text-gray-700 dark:text-gray-300">
                        {comment.content}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full text-sm font-semibold">
                        <Heart className="w-3 h-3" />
                        {comment.numberOfLikes}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                        {comment.postId.slice(0, 8)}...
                      </code>
                    </Table.Cell>
                    <Table.Cell>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                        {comment.userId.slice(0, 8)}...
                      </code>
                    </Table.Cell>
                    <Table.Cell>
                      <button
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors font-medium text-sm"
                        onClick={() => {
                          setShowModal(true);
                          setCommentIdToDelete(comment._id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>

          {showMore && (
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <Button
                onClick={handleShowMore}
                gradientDuoTone="purpleToBlue"
                className="shadow-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Load More Comments
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Comments Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            There are no comments to display at the moment.
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              Delete Comment?
            </h3>
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
              This action cannot be undone. The comment will be permanently deleted.
            </p>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
                <Trash2 className="w-4 h-4 mr-2" />
                Yes, Delete
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashComments;