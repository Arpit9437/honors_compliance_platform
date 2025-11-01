import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from '../components/PostCard';
import { useSelector } from "react-redux";
import { 
  Shield, 
  FileText, 
  Bell, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Clock,
  Search
} from "lucide-react";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  const stats = [
    { icon: FileText, label: "Regulatory Updates", value: "500+" },
    { icon: Users, label: "Active Users", value: "1,200+" },
    { icon: Bell, label: "Alerts Sent", value: "5,000+" },
    { icon: TrendingUp, label: "Success Rate", value: "98%" },
  ];

  const features = [
    {
      icon: Shield,
      title: "Real-Time Compliance",
      description: "Stay updated with the latest regulatory changes as they happen",
      color: "blue"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Summaries",
      description: "Complex legal jargon simplified into easy-to-understand insights",
      color: "purple"
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified about changes relevant to your industry and region",
      color: "green"
    },
    {
      icon: Clock,
      title: "Never Miss a Deadline",
      description: "Automated reminders for compliance deadlines and submissions",
      color: "orange"
    }
  ];

  const categories = [
    { name: "Tax Regulations", icon: "📊", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    { name: "Labour Laws", icon: "👥", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    { name: "Finance & Banking",  icon: "💰", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
    { name: "Government Schemes",  icon: "🏛️", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="text-center space-y-8 fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>AI-Powered Compliance Assistant</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
              Welcome to{" "}
              <span className="gradient-text">PolicySync</span>
            </h1>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Get the latest verified updates on tax, labour laws, finance, compliance, 
              and government schemes — simplified and organized to keep you ahead of regulatory changes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/search" 
                className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <Search className="w-5 h-5" />
                Explore Updates
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {!currentUser && (
                <Link 
                  to="/dashboard?tab=profile" 
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Shield className="w-5 h-5" />
                  Get Started Free
                </Link>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 pt-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Free forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section
      <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center space-y-2 fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl mb-2">
                  <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Find compliance updates specific to your industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              // Map the category names to their corresponding values in the search filter
              const categoryMap = {
                'Tax Regulations': 'tax',
                'Labour Laws': 'labor',
                'Finance & Banking': 'finance',
                'Government Schemes': 'schemes'
              };
              const searchValue = categoryMap[category.name] || 'uncategorized';
              
              return (
                <Link
                  key={index}
                  to={`/search?category=${searchValue}&order=desc`}
                  className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 card-hover"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{category.icon}</span>
                    <span className={`px-3 py-1 ${category.color} rounded-full text-sm font-semibold`}>
                      {category.count}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      {posts && posts.length > 0 && (
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Latest Updates
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Stay informed with the most recent compliance changes
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            <div className="text-center">
              <Link 
                to="/search" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                View All Updates
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose PolicySync?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to stay compliant, in one powerful platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl transition-all duration-300 fade-in card-hover"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Ready to Stay Compliant?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of businesses staying ahead of regulatory changes
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/sign-up" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>
      )}

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -50px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(50px, 50px) scale(1.05);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Home;
