import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

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
  const [tab, setTab] = useState<'manager' | 'super_admin'>('manager');
  const [managers, setManagers] = useState<Profile[]>([]);
  const [superAdmins, setSuperAdmins] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inviteForm, setInviteForm] = useState({ full_name: '', email: '', password: '' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

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
    const fetchSuperAdmins = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, email, view_only, role, avatar_url')
        .eq('role', 'super_admin');
      if (error) {
        setError(error.message);
      } else {
        setSuperAdmins(data || []);
      }
      setLoading(false);
    };
    fetchManagers();
    fetchSuperAdmins();
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    setToast(null);
    try {
      // 1. Create user in Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email: inviteForm.email,
        password: inviteForm.password,
      });
      if (authError || !userData.user) throw authError || new Error('No user returned');
      // 2. Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userData.user.id,
          full_name: inviteForm.full_name,
          email: inviteForm.email,
          role: tab === 'manager' ? 'manager' : 'super_admin',
          view_only: false,
        }, { onConflict: 'id' });
      if (profileError) throw profileError;
      setToast({ type: 'success', message: `${tab === 'manager' ? 'Manager' : 'Super Admin'} added successfully! Please log in again as admin.` });
      setInviteForm({ full_name: '', email: '', password: '' });
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
      }, 1500);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || `Failed to add ${tab === 'manager' ? 'manager' : 'super admin'}.` });
    }
    setInviteLoading(false);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id: string, email: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${tab === 'manager' ? 'manager' : 'super admin'}? This action cannot be undone.`)) return;
    setDeletingId(id);
    setToast(null);
    try {
      // 1. Delete from Supabase Auth (admin API, only works with service role key on backend)
      // await supabase.auth.admin.deleteUser(id); // Uncomment if using backend/service role
      // 2. Delete from profiles table
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      if (tab === 'manager') {
        setManagers(prev => prev.filter(m => m.id !== id));
      } else {
        setSuperAdmins(prev => prev.filter(m => m.id !== id));
      }
      setToast({ type: 'success', message: `${tab === 'manager' ? 'Manager' : 'Super Admin'} deleted successfully.` });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || `Failed to delete ${tab === 'manager' ? 'manager' : 'super admin'}.` });
    }
    setDeletingId(null);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="text-gray-400">Loading...</div></div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center px-2 md:px-0">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 mt-8">
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-base ${tab === 'manager' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('manager')}
          >
            Managers
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-base ${tab === 'super_admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setTab('super_admin')}
          >
            Super Admins
          </button>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-gray-900">{tab === 'manager' ? 'Manager Permissions' : 'Super Admin Permissions'}</h2>
        <p className="text-gray-500 mb-6">Add, view, and manage {tab === 'manager' ? 'manager' : 'super admin'} accounts. {tab === 'manager' ? 'Toggle view-only mode for each manager.' : ''}</p>
        {/* Invite Form */}
        <form onSubmit={handleInvite} className="mb-8 w-full flex flex-col md:flex-row gap-3 items-center bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
          <input
            type="text"
            placeholder="Full Name"
            value={inviteForm.full_name}
            onChange={e => setInviteForm(f => ({ ...f, full_name: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base w-full md:w-1/4"
            required
            disabled={inviteLoading}
          />
          <input
            type="email"
            placeholder="Email"
            value={inviteForm.email}
            onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base w-full md:w-1/4"
            required
            disabled={inviteLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={inviteForm.password}
            onChange={e => setInviteForm(f => ({ ...f, password: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base w-full md:w-1/4"
            required
            disabled={inviteLoading}
          />
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base"
            disabled={inviteLoading || !inviteForm.full_name || !inviteForm.email || !inviteForm.password}
          >
            {inviteLoading ? 'Adding...' : `Add ${tab === 'manager' ? 'Manager' : 'Super Admin'}`}
          </button>
        </form>
        {/* Toast message */}
        {toast && (
          <div className={`mb-4 px-4 py-2 rounded text-white font-medium ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>{toast.message}</div>
        )}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-base">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                {tab === 'manager' && <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">View Only</th>}
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {(tab === 'manager' ? managers : superAdmins).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                        {user.full_name ? user.full_name[0] : user.username?.[0] || '?'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.username}</td>
                  {tab === 'manager' && (
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleToggleViewOnly(user.id, user.view_only)}
                        disabled={updatingId === user.id}
                        className={`relative inline-flex items-center h-7 rounded-full w-14 transition-colors focus:outline-none ${user.view_only ? 'bg-green-500' : 'bg-gray-300'} ${updatingId === user.id ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
                        aria-pressed={user.view_only}
                      >
                        <span
                          className={`inline-block w-7 h-7 transform bg-white rounded-full shadow transition-transform ${user.view_only ? 'translate-x-7' : 'translate-x-0'}`}
                        />
                      </button>
                      <span className="ml-2 text-xs font-semibold text-gray-600">{user.view_only ? 'Enabled' : 'Disabled'}</span>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleDelete(user.id, user.email)}
                      disabled={deletingId === user.id}
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 text-xs font-semibold"
                    >
                      {deletingId === user.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsPage; 