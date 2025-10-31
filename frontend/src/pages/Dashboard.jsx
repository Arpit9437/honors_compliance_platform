import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../components/DashProfile";
import DashSidebar from "../components/DashSidebar";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashBoardComp from "../components/DashBoardComp";
import DashBookmarks from "../components/DashBookmarks";
import { LayoutDashboard } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // Tab titles for display
  const tabTitles = {
    dashboard: "Dashboard Overview",
    profile: "My Profile",
    posts: "Manage Posts",
    users: "User Management",
    comments: "Manage Comments",
    bookmarks: "Saved Updates"
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header - Only show if a tab is selected */}
      {tab && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tabTitles[tab] || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tab === "dashboard" && "Monitor your compliance dashboard"}
                  {tab === "profile" && "Manage your account settings"}
                  {tab === "posts" && "Create and manage compliance updates"}
                  {tab === "users" && "Manage platform users"}
                  {tab === "comments" && "Review and moderate comments"}
                  {tab === "bookmarks" && "Access your saved compliance updates"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content Area */}
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar - Fixed on desktop, collapsible on mobile */}
        <div className="lg:w-64 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
            <DashSidebar />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 lg:overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {/* Content Components with fade-in animation */}
            <div className="fade-in">
              {tab === "profile" && <DashProfile />}
              {tab === "posts" && <DashPosts />}
              {tab === "users" && <DashUsers />}
              {tab === "comments" && <DashComments />}
              {tab === "bookmarks" && <DashBookmarks />}
              {tab === "dashboard" && <DashBoardComp />}
              
              {/* Welcome Screen when no tab selected */}
              {!tab && (
                <div className="min-h-screen flex items-center justify-center p-6">
                  <div className="text-center space-y-6 max-w-lg">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl mb-4">
                      <LayoutDashboard className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Welcome to Your Dashboard
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      Select an option from the sidebar to get started with managing your compliance updates.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center pt-4">
                      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        📊 View Analytics
                      </span>
                      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        📝 Manage Posts
                      </span>
                      <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        🔖 View Bookmarks
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
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

        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        /* Custom scrollbar for sidebar */
        .lg\:overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }

        .lg\:overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .lg\:overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        .lg\:overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Dashboard;