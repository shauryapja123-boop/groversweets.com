import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Button } from '../components/UI';
import { Eye, EyeOff, Lock, User, Mail, Phone, Building, UserPlus, LogIn, CheckCircle } from 'lucide-react';
import { outlets } from '../data/mockData';

export const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addSignupRequest, employees, managers } = useApp();
  const navigate = useNavigate();

  // Signup form state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    outletId: '',
    department: '',
    designation: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const additionalUsers = [...employees, ...managers];
    const success = await login(identifier, password, additionalUsers);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    if (!/^[0-9]{10}$/.test(signupData.mobile)) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create signup request
    addSignupRequest({
      fullName: signupData.fullName,
      email: signupData.email,
      mobile: signupData.mobile,
      password: signupData.password,
      outletId: signupData.outletId,
      department: signupData.department,
      designation: signupData.designation
    });

    setLoading(false);
    setSuccess('Signup request submitted! Your request will be reviewed by the admin. You will be able to log in after approval.');
    
    // Reset form after 3 seconds and switch to login
    setTimeout(() => {
      setSignupData({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        outletId: '',
        department: '',
        designation: ''
      });
      setSuccess('');
      setIsSignup(false);
    }, 3000);
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSignupData({
      ...signupData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen shell-pattern flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="fixed top-0 left-0 w-64 h-64 bg-gradient-to-br from-gold/20 to-transparent rounded-full blur-3xl" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-maroon/10 to-transparent rounded-full blur-3xl" />
      
      <div className="w-full max-w-md relative">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-maroon to-maroon-light rounded-full shadow-xl mb-4">
            <span className="text-gold font-serif text-3xl font-bold">G</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-maroon mb-2">Grover Sweets</h1>
          <p className="text-gray-600">Leave Management System</p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gold/20 overflow-hidden">
          <div className="bg-gradient-to-r from-maroon to-maroon-light p-6">
            <h2 className="text-xl font-semibold text-cream text-center">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-cream/70 text-sm text-center mt-1">
              {isSignup ? 'Register as a new employee' : 'Sign in to continue'}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              type="button"
              onClick={() => { setIsSignup(false); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                !isSignup 
                  ? 'text-maroon border-b-2 border-gold bg-cream/50' 
                  : 'text-gray-500 hover:text-maroon hover:bg-cream/30'
              }`}
            >
              <LogIn size={16} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignup(true); setError(''); setSuccess(''); }}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                isSignup 
                  ? 'text-maroon border-b-2 border-gold bg-cream/50' 
                  : 'text-gray-500 hover:text-maroon hover:bg-cream/30'
              }`}
            >
              <UserPlus size={16} />
              Sign Up
            </button>
          </div>

          {!isSignup ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    placeholder="Email, Employee ID, or Mobile"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Sign In
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-maroon hover:text-gold transition-colors">
                  Forgot Password?
                </a>
              </div>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignup} className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Full Name */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={signupData.fullName}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number (10 digits)"
                    value={signupData.mobile}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* Outlet Selection */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Building size={18} />
                  </div>
                  <select
                    name="outletId"
                    value={signupData.outletId}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all appearance-none bg-white"
                    required
                  >
                    <option value="">Select Outlet</option>
                    {outlets.map(outlet => (
                      <option key={outlet.id} value={outlet.id}>{outlet.name} - {outlet.city}</option>
                    ))}
                  </select>
                </div>

                {/* Department & Designation */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={signupData.department}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                  <input
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    value={signupData.designation}
                    onChange={handleSignupChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Password (min 6 characters)"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading} disabled={!!success}>
                <UserPlus size={18} className="mr-2" />
                Create Account
              </Button>

              <p className="text-xs text-gray-500 text-center">
                By signing up, you agree to our Terms of Service and Privacy Policy.
                Your account will be activated after admin approval.
              </p>
            </form>
          )}
        </div>

        {/* Demo Credentials - Only show on login */}
        {!isSignup && (
          <div className="mt-6 bg-white/80 backdrop-blur rounded-2xl p-4 border border-gold/20">
            <p className="text-xs text-gray-500 text-center mb-3 font-medium">Demo Credentials</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-cream rounded-lg">
                <p className="font-semibold text-maroon">Admin</p>
                <p className="text-gray-600 truncate">admin@groversweets.com</p>
                <p className="text-gray-500">admin123</p>
              </div>
              <div className="text-center p-2 bg-cream rounded-lg">
                <p className="font-semibold text-maroon">Manager</p>
                <p className="text-gray-600 truncate">manager1@groversweets.com</p>
                <p className="text-gray-500">manager123</p>
              </div>
              <div className="text-center p-2 bg-cream rounded-lg">
                <p className="font-semibold text-maroon">Employee</p>
                <p className="text-gray-600 truncate">emp1@groversweets.com</p>
                <p className="text-gray-500">emp123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
