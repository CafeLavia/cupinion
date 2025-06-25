import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import logo from '../../assets/logo.png';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Fetch user role after login
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (!profileError && profile) {
          if (profile.role === 'staff') {
            navigate('/admin/offers/redeem');
            return;
          }
        }
      }
      navigate('/admin/dashboard');
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100"
    >
      <div className="w-full max-w-md p-8 md:p-10 space-y-8 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col items-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full shadow-md border border-gray-200 flex items-center justify-center" style={{ background: 'linear-gradient(to bottom, #186863 0%, #084040 50%, #011217 100%)' }}>
          <img src={logo} alt="Cafe LaVia Logo" className="w-14 h-14 object-contain" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1 tracking-tight" style={{ fontFamily: "'Cherry Swash', cursive" }}>
          Admin Login
        </h1>
        <p className="text-gray-500 mb-6 text-base">Welcome back, please sign in.</p>
        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
              {error}
            </div>
          )}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 bg-gradient-to-r from-teal-500 to-green-400 hover:from-teal-600 hover:to-green-500 focus:ring-2 focus:ring-green-400 focus:outline-none"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage; 