import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    // On successful login, navigate to dashboard or home
    // navigate('/dashboard');
    console.log('Login submitted:', { email, password, remember });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-dark font-sans">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-dark" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={20} className="absolute left-3 top-3 text-gray" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium text-gray-dark" htmlFor="password">Password</label>
              <div className="relative">
                <Lock size={20} className="absolute left-3 top-3 text-gray" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray hover:text-gray-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mr-2"
                />
                <span className="text-sm text-gray-dark">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-green font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-gray-dark mb-4 transition-all duration-200 bg-secondary hover:bg-yellow transform hover:-translate-y-0.5 hover:shadow-lg"
              style={{ 
                backgroundColor: '#FFDF00',
                color: '#222'
              }}
            >
              Sign In
            </button>
          </form>
          <div className="text-center">
            <span className="text-gray-dark">Don't have an account? </span>
            <Link to="/register" className="font-semibold hover:underline transition-all" style={{ color: '#51B700' }}>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;