import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { useUserRole } from '../hooks/useUserRole';

const ALLOWED_ROLES = ['staff', 'manager', 'super_admin'];

const ProtectedRoute: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const { role, loading: roleLoading } = useUserRole();
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setUserLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (userLoading || roleLoading) {
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

  if (
    role === 'staff' &&
    !['/admin/offers/redeem', '/admin/offers/all-redemptions'].includes(location.pathname)
  ) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-bold">Not authorized</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute; 