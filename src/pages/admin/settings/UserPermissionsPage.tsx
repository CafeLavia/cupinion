import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabaseClient';

interface Profile {
  id: string;
  username: string;
  full_name: string;
  email: string;
  view_only: boolean;
  role: string;
  avatar_url?: string;
}

const UserPermissionsPage: React.FC = () => {
  const [managers, setManagers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, view_only, role, avatar_url')
        .eq('role', 'manager');
      if (error) {
        setError(error.message);
      } else {
        setManagers(data || []);
      }
      setLoading(false);
    };
    fetchManagers();
  }, []);

  const handleToggleViewOnly = async (id: string, current: boolean) => {
    setUpdatingId(id);
    const { data: userData } = await supabase.auth.getUser();
    console.log('Updating manager id:', id, 'Current user id:', userData?.user?.id);
    const { data, error } = await supabase
      .from('profiles')
      .update({ view_only: !current })
      .eq('id', id)
      .select();
    console.log('Supabase update result:', { data, error });
    if (!error) {
      setManagers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, view_only: !current } : m))
      );
      setToast({ type: 'success', message: `View-only mode ${!current ? 'enabled' : 'disabled'} for this manager.` });
    } else {
      setToast({ type: 'error', message: 'Failed to update view-only status.' });
    }
    setUpdatingId(null);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="text-gray-400">Loading...</div></div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manager Permissions</h2>
      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-white font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
      )}
      <div className="overflow-x-auto rounded-lg shadow border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View Only</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {manager.avatar_url ? (
                    <img src={manager.avatar_url} alt={manager.full_name} className="w-10 h-10 rounded-full object-cover border" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {manager.full_name ? manager.full_name[0] : manager.username[0]}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{manager.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{manager.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{manager.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handleToggleViewOnly(manager.id, manager.view_only)}
                    disabled={updatingId === manager.id}
                    className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors focus:outline-none ${manager.view_only ? 'bg-green-500' : 'bg-gray-300'} ${updatingId === manager.id ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                    aria-pressed={manager.view_only}
                  >
                    <span
                      className={`inline-block w-6 h-6 transform bg-white rounded-full shadow transition-transform ${manager.view_only ? 'translate-x-6' : 'translate-x-0'}`}
                    />
                  </button>
                  <span className="ml-2 text-xs font-semibold text-gray-600">{manager.view_only ? 'Enabled' : 'Disabled'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserPermissionsPage; 