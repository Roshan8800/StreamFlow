import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { login } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock authentication - replace with real API calls later
      if (isLogin) {
        // Mock login
        const mockUser = {
          id: 'user-' + Date.now(),
          email: formData.email,
          username: formData.email.split('@')[0],
          role: formData.email.includes('admin') ? 'admin' : 'user'
        };
        
        login(mockUser, 'mock-token-' + Date.now());
        toast.success('Welcome to PlayNite!');
      } else {
        // Mock registration
        const mockUser = {
          id: 'user-' + Date.now(),
          email: formData.email,
          username: formData.username,
          role: 'user'
        };
        
        login(mockUser, 'mock-token-' + Date.now());
        toast.success('Account created successfully!');
      }
    } catch (error) {
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-purple-900 to-pink-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">P</span>
          </div>
          <h1 className="text-4xl font-bold text-gradient font-['Poppins'] mb-2">PlayNite</h1>
          <p className="text-gray-400">Premium adult entertainment platform</p>
        </div>

        {/* Auth Form */}
        <div className="glass-card p-8">
          {/* Tab Switcher */}
          <div className="flex mb-8">
            <button
              className={`flex-1 py-3 px-4 text-center font-semibold transition-all duration-300 ${
                isLogin 
                  ? 'text-white border-b-2 border-pink-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setIsLogin(true)}
              data-testid="login-tab"
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center font-semibold transition-all duration-300 ${
                !isLogin 
                  ? 'text-white border-b-2 border-pink-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setIsLogin(false)}
              data-testid="register-tab"
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input pl-12"
                  required={!isLogin}
                  data-testid="username-input"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="input pl-12"
                required
                data-testid="email-input"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="input pl-12 pr-12"
                required
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                data-testid="toggle-password"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-pink-400 hover:text-pink-300 transition-colors"
                  data-testid="forgot-password"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
              data-testid="submit-button"
            >
              {isLoading ? (
                <div className="loading-spinner w-5 h-5 border-2"></div>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-800 bg-opacity-50 rounded-lg">
            <h4 className="text-sm font-semibold text-white mb-2">Demo Credentials:</h4>
            <div className="text-xs text-gray-300 space-y-1">
              <div><strong>User:</strong> user@demo.com / password</div>
              <div><strong>Admin:</strong> admin@demo.com / password</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-400">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;