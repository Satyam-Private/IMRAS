import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Package,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2
} from "lucide-react";
import api from "../api/api";
import log_image from '../assets/Login_image.jpg'

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await api.post("/api/auth/login/", {
        email: email.trim(),
        password
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("user", JSON.stringify(user));

      if (onLogin) onLogin(user);
      navigate("/app");
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else if (err.response?.status === 403) {
        setError("User account is inactive. Please contact admin.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Right Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
          }}></div>
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>

        {/* Image Container */}
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8">
          {/* Logo and Branding */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">IMRAS</span>
            </div>
            <h2 className="text-xl font-semibold text-white mb-1">Welcome to Inventory Management</h2>
            <p className="text-blue-200 text-xs">Your intelligent solution for modern warehouse operations</p>
          </div>

          {/* Image with Modern Card Style */}
          <div className="relative group max-w-xl w-full mb-6">
            {/* Floating Background Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl backdrop-blur-sm border border-white/20 transform -rotate-3 group-hover:-rotate-6 transition-transform duration-500"></div>

            {/* Main Image Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/30 backdrop-blur-md">
              <img
                src={log_image}
                alt="Warehouse Management"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Gradient Overlay on Image */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2.5 max-w-xl w-full">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">Automated Reorder Alerts</h3>
                <p className="text-blue-200 text-xs">Get notified when stock levels are low</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">Supplier Management</h3>
                <p className="text-blue-200 text-xs">Streamline relationships with your suppliers</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-9 h-9 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm">Multi-Warehouse Support</h3>
                <p className="text-blue-200 text-xs">Manage inventory across multiple locations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 border-4 border-cyan-400/30 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border-4 border-purple-400/30 rounded-full"></div>
      </div>

      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col min-h-screen bg-white">
        {/* Header for mobile */}
        <div className="lg:hidden p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800">IMRAS</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-12">
          <div className="w-full max-w-md">
            {/* Welcome Text */}
            <div className="mb-10">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                Sign In
              </h1>
              <p className="text-lg text-slate-600">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-14 pl-12 pr-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-slate-50 focus:bg-white transition-colors text-slate-800"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-14 pl-12 pr-14 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none bg-slate-50 focus:bg-white transition-colors text-slate-800"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}


              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;