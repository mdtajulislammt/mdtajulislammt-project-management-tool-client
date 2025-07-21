  import React, { useState } from 'react';
  import { Eye, EyeOff, User, Mail, Lock, Chrome } from 'lucide-react';
  import { Link, useNavigate } from 'react-router-dom';
  import AuthLayout from '../AuthLayout';
  import { useRegisterUserMutation } from '../../../services/authApi';

  const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!termsAccepted) {
        setError('You must accept the terms and conditions');
        return;
      }
      try {
        await registerUser({ name, email, password }).unwrap();
        navigate('/tasks');
      } catch (err: any) {
        setError(err?.data?.message || 'Registration failed');
      }
    };

    const handleGoogleSignup = () => {
      // Handle Google signup logic here
      console.log('Google signup clicked');
    };

    return (
      <AuthLayout>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-dark font-sans">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-dark" htmlFor="name">Name</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-3 text-gray" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-dark" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-3 text-gray" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block mb-2 font-medium text-gray-dark" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3 text-gray" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-3 text-gray hover:text-gray-dark transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-4 relative">
            <label className="block mb-2 font-medium text-gray-dark" htmlFor="confirmPassword">Confirm Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3 text-gray" />
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-3 text-gray hover:text-gray-dark transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="mb-6 flex items-center">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 mr-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-dark">
              I accept the <a href="#" className="text-primary hover:text-green font-medium transition-colors">terms & conditions</a>
            </label>
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold text-white mb-4 flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            style={{ backgroundColor: '#51B700' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Register'
            )}
          </button>
          {/* Google Sign-up Button below Register */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-3 px-4 mb-4 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Chrome size={20} className="text-blue-500" />
            Sign up with Google
          </button>
          <div className="text-center">
            <span className="text-gray-dark">Already have an account? </span>
            <Link to="/login" className="font-semibold hover:underline transition-all" style={{ color: '#FFDF00' }}>
              Login
            </Link>
          </div>
        </form>
      </AuthLayout>
    );
  };

  export default Register;