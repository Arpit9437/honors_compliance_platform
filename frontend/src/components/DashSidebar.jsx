import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  User,
  FileText,
  Users,
  MessageSquare,
  Bookmark,
  LogOut,
  Shield,
  ChevronRight,
} from "lucide-react";
import { signoutSuccess } from "../Redux/user/userSlice";

const DashSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const menuItems = [
    {
      label: "Profile",
      icon: User,
      tab: "profile",
      path: "/dashboard?tab=profile",
      badge: currentUser.isAdmin ? "Admin" : "User",
      badgeColor: currentUser.isAdmin
        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
        : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      show: true,
    },
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      tab: "dashboard",
      path: "/dashboard?tab=dashboard",
      show: currentUser.isAdmin,
    },
    {
      label: "Posts",
      icon: FileText,
      tab: "posts",
      path: "/dashboard?tab=posts",
      show: currentUser.isAdmin,
    },
    {
      label: "Users",
      icon: Users,
      tab: "users",
      path: "/dashboard?tab=users",
      show: currentUser.isAdmin,
    },
    {
      label: "Comments",
      icon: MessageSquare,
      tab: "comments",
      path: "/dashboard?tab=comments",
      show: currentUser.isAdmin,
    },
    {
      label: "Bookmarks",
      icon: Bookmark,
      tab: "bookmarks",
      path: "/dashboard?tab=bookmarks",
      show: true,
    },
  ];

  return (
    <div className="w-full md:w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex flex-col h-full">
        {/* User Info Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.profilePicture}
                alt={currentUser.username}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/20"
              />
              {currentUser.isAdmin && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map(
            (item) =>
              item.show && (
                <Link
                  key={item.tab}
                  to={item.path}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    tab === item.tab || (item.tab === "dashboard" && !tab)
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon
                      className={`w-5 h-5 ${
                        tab === item.tab || (item.tab === "dashboard" && !tab)
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400"
                      }`}
                    />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {(tab === item.tab || (item.tab === "dashboard" && !tab)) && (
                      <ChevronRight className="w-4 h-4 text-white" />
                    )}
                  </div>
                </Link>
              )
          )}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleSignout}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Sign Out</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashSidebar;