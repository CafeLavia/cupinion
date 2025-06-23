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

      navigate('/admin/dashboard');
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-gray-50"
      style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, #d1d5db 1px, transparent 0)",
        backgroundSize: "20px 20px"
      }}
    >
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <img src={logo} alt="Cafe LaVia Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Cherry Swash', cursive" }}>
            Admin Login
          </h1>
          <p className="text-gray-500">Welcome back, please sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-4 py-2 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full px-4 py-3 font-semibold text-white transition-transform duration-200 transform rounded-lg shadow-md disabled:opacity-50"
              style={{ backgroundColor: '#20b2aa' }}
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