import React from "react";
import { Shield, Target, Users, Zap, Code, Database, Cloud, Lock, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const About = () => {
  const { currentUser } = useSelector((state) => state.user);
  const features = [
    {
      icon: Shield,
      title: "Verified Updates",
      description: "Only verified administrators can publish compliance updates, ensuring accuracy and reliability.",
      color: "blue"
    },
    {
      icon: Zap,
      title: "Real-Time Alerts",
      description: "Get instant notifications about regulatory changes that matter to your business.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a growing community of compliance professionals and business owners.",
      color: "purple"
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Your data is protected with industry-standard security measures and OAuth 2.0.",
      color: "green"
    }
  ];

  const techStack = [
    { name: "React", icon: Code, description: "Modern UI framework" },
    { name: "Node.js", icon: Cloud, description: "Scalable backend" },
    { name: "MongoDB", icon: Database, description: "Flexible database" },
    { name: "Express.js", icon: Zap, description: "Fast API server" },
  ];

  const complianceAreas = [
    { icon: "📊", name: "Taxation", description: "GST, Income Tax, and Direct/Indirect taxes" },
    { icon: "👥", name: "Labour Laws", description: "Employee rights, wages, and workplace regulations" },
    { icon: "💰", name: "Finance & Banking", description: "RBI guidelines, banking regulations, and financial compliance" },
    { icon: "🏛️", name: "Corporate Compliance", description: "Company law, corporate governance, and filings" },
    { icon: "🎯", name: "Government Schemes", description: "Subsidies, grants, and government initiatives" },
    { icon: "⚖️", name: "Legal Updates", description: "New laws, amendments, and court rulings" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>About PolicySync</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Simplifying India's <br />
              <span className="gradient-text">Regulatory Landscape</span>
            </h1>

            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              A platform built to help professionals, businesses, and individuals stay updated 
              with India's ever-evolving compliance requirements.
            </p>
          </div>
        </div>
      </section>



      {/* Mission Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                <Target className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Making Compliance Accessible for Everyone
              </h2>
              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  Welcome to <strong className="text-gray-900 dark:text-white">PolicySync</strong> — where regulatory 
                  compliance meets simplicity. We understand that keeping up with India's complex and constantly 
                  changing regulations can be overwhelming for businesses of all sizes.
                </p>
                <p>
                  Our platform aggregates, simplifies, and delivers the most important compliance updates directly 
                  to you, so you can focus on growing your business instead of worrying about missing critical deadlines.
                </p>
                <p>
                  Built by a team of developers at <strong className="text-gray-900 dark:text-white">Shri Ramdeobaba 
                  College of Engineering & Management</strong>, PolicySync combines cutting-edge technology with 
                  real-world compliance needs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 fade-in" style={{ animationDelay: "200ms" }}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 card-hover"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl mb-3`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Areas */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Compliance Areas We Cover
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive coverage across all major regulatory domains in India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {complianceAreas.map((area, index) => (
              <div
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all duration-300 card-hover fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{area.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
              <Code className="w-4 h-4" />
              <span>Technology Stack</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A full-stack JavaScript application leveraging the MERN stack for optimal performance and scalability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg transition-all duration-300 text-center card-hover fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-xl mb-4">
                  <tech.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {tech.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Additional Features
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Google OAuth authentication, real-time updates, AI-powered summarization, and more
                  </p>
                </div>
              </div>
              <Link
                to="https://github.com/Arpit9437/honors_compliance_platform"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
              >
                View on GitHub
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                to="/sign-up" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Create Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default About;
