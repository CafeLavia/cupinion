import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

interface UserRoleInfo {
  role: string | null;
  viewOnly: boolean;
  loading: boolean;
}

export function useUserRole(): UserRoleInfo {
  const [role, setRole] = useState<string | null>(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role, view_only')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          setRole(data.role);
          setViewOnly(!!data.view_only);
        } else {
          // Fallback if profile not found
          setRole('unknown');
          setViewOnly(false);
        }
      } else {
        setRole(null);
        setViewOnly(false);
      }
      setLoading(false);
    };
    fetchRole();
  }, []);

  return { role, viewOnly, loading };
} 