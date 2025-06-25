import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';

const ALLOWED_ROLES = ['staff', 'manager', 'super_admin'];

const ProtectedRoute: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        if (!error && profile) setRole(profile.role);
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" />;
  if (!role || !ALLOWED_ROLES.includes(role)) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-bold">Not authorized</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute; 