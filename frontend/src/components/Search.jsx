import { Button, Select, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Filter, SlidersHorizontal, TrendingUp, Clock, X } from "lucide-react";
import PostCard from "./PostCard";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getPosts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  const clearFilters = () => {
    setSidebarData({
      searchTerm: "",
      sort: "desc",
      category: "uncategorized",
    });
    navigate("/search");
  };

  const categoryColors = {
    tax: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    labor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    finance: "bg-green-500/10 text-green-600 dark:text-green-400",
    compliance: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    schemes: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <SearchIcon className="w-8 h-8 text-blue-500" />
                Search Compliance Updates
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Find the latest regulatory information and government schemes
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(sidebarData.searchTerm || sidebarData.category !== "uncategorized") && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
              {sidebarData.searchTerm && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2">
                  Search: "{sidebarData.searchTerm}"
                </span>
              )}
              {sidebarData.category !== "uncategorized" && (
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${categoryColors[sidebarData.category]}`}>
                  {sidebarData.category}
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block lg:w-80 flex-shrink-0`}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Filter Results
                </h2>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Search Term */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Search Term
                  </label>
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <TextInput
                      placeholder="Enter keywords..."
                      id="searchTerm"
                      type="text"
                      value={sidebarData.searchTerm}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Sort By
                  </label>
                  <Select
                    onChange={handleChange}
                    value={sidebarData.sort}
                    id="sort"
                    icon={sidebarData.sort === "desc" ? TrendingUp : Clock}
                  >
                    <option value="desc">Latest First</option>
                    <option value="asc">Oldest First</option>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <Select
                    onChange={handleChange}
                    value={sidebarData.category}
                    id="category"
                  >
                    <option value="uncategorized">All Categories</option>
                    <option value="tax">🏛️ Tax & Revenue</option>
                    <option value="labor">👷 Labor Laws</option>
                    <option value="finance">💰 Finance & Banking</option>
                    <option value="compliance">✅ Compliance</option>
                    <option value="schemes">🎯 Government Schemes</option>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                  >
                    <SearchIcon className="w-4 h-4 mr-2" />
                    Apply Filters
                  </Button>
                  <Button
                    type="button"
                    onClick={clearFilters}
                    color="gray"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reset Filters
                  </Button>
                </div>
              </form>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Results found:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {posts.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Search Results
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {loading
                      ? "Searching..."
                      : `Found ${posts.length} ${posts.length === 1 ? "result" : "results"}`}
                  </p>
                </div>
                {posts.length > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sorted by:{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {sidebarData.sort === "desc" ? "Latest" : "Oldest"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">
                    Searching compliance updates...
                  </p>
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && posts.length === 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SearchIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any compliance updates matching your search criteria. Try
                  adjusting your filters or search term.
                </p>
                <Button onClick={clearFilters} gradientDuoTone="purpleToBlue">
                  Clear Filters & Browse All
                </Button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && posts.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>

                {/* Load More Button */}
                {showMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={handleShowMore}
                      size="lg"
                      gradientDuoTone="cyanToBlue"
                      className="shadow-lg"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Load More Results
                    </Button>
                  </div>
                )}

                {/* End of Results Message */}
                {!showMore && posts.length > 0 && (
                  <div className="mt-8 text-center py-6">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                      🎉 You've reached the end of the results
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;