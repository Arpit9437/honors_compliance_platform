import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import OAuth from '../components/OAuth';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.password) {
      return setErrorMessage('Please fill out all fields.');
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if (res.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-200 dark:bg-cyan-900/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-6xl w-full">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="p-8 sm:p-12 lg:p-16 order-2 lg:order-1">
              <div className="max-w-md mx-auto">
                {/* Mobile Logo */}
                <div className="lg:hidden text-center mb-8">
                  <Link to="/" className="inline-flex items-center gap-2">
                    <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                      PolicySync
                    </span>
                  </Link>
                </div>

                <div className="space-y-6 fade-in" style={{ animationDelay: '100ms' }}>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Start tracking compliance updates today
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {/* Username Input */}
                    <div className="space-y-2">
                      <Label htmlFor="username" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Username
                      </Label>
                      <TextInput
                        type="text"
                        placeholder="johndoe"
                        id="username"
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Email Address
                      </Label>
                      <TextInput
                        type="email"
                        placeholder="name@company.com"
                        id="email"
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        Password
                      </Label>
                      <TextInput
                        type="password"
                        placeholder="••••••••"
                        id="password"
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Must be at least 8 characters long
                      </p>
                    </div>

                    {/* Error Alert */}
                    {errorMessage && (
                      <Alert color="failure" className="animate-fadeIn">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5" />
                          <span>{errorMessage}</span>
                        </div>
                      </Alert>
                    )}

                    {/* Sign Up Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Spinner size="sm" />
                          <span>Creating account...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span>Create Account</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    {/* OAuth */}
                    <OAuth />
                  </form>

                  {/* Sign In Link */}
                  <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                      Already have an account?{' '}
                      <Link
                        to="/sign-in"
                        className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Sign In
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Branding */}
            <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700 text-white order-1 lg:order-2">
              <div className="space-y-6 fade-in">
                <div className="inline-flex items-center gap-3">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Shield className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">PolicySync</h2>
                    <p className="text-blue-100 text-sm">Compliance Dashboard</p>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <h3 className="text-2xl font-bold">Join Our Community</h3>
                  <p className="text-blue-100 text-lg">
                    Get started with PolicySync and never miss a regulatory update again. Join professionals and businesses staying compliant.
                  </p>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Free Forever</h4>
                      <p className="text-blue-100 text-sm">No credit card required, start immediately</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Real-Time Updates</h4>
                      <p className="text-blue-100 text-sm">Get notified instantly about changes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold">AI-Powered</h4>
                      <p className="text-blue-100 text-sm">Simplified summaries of complex regulations</p>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/20">
                  <p className="text-sm text-blue-100">
                    "PolicySync has saved our team countless hours. We now stay compliant effortlessly!"
                  </p>
                  <p className="text-sm font-semibold mt-2">- Student Project Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </p>
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
          animation: fadeIn 0.5s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SignUp;