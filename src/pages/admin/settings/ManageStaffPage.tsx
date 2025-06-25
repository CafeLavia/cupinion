import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const ManageStaffPage: React.FC = () => {
  const [staff, setStaff] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [inviteForm, setInviteForm] = useState({ full_name: '', email: '', password: '' });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'staff');
      if (error) {
        setError(error.message);
      } else {
        setStaff(data || []);
      }
      setLoading(false);
    };
    fetchStaff();
  }, []);

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
          role: 'staff',
        }, { onConflict: 'id' });
      if (profileError) throw profileError;
      setToast({ type: 'success', message: 'Staff added successfully! Please log in again as admin.' });
      setInviteForm({ full_name: '', email: '', password: '' });
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
      }, 1500);
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to add staff.' });
    }
    setInviteLoading(false);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDeleteStaff = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this staff member? This action cannot be undone.')) return;
    setDeletingId(id);
    setToast(null);
    try {
      // 1. Delete from Supabase Auth (admin API, only works with service role key on backend)
      // await supabase.auth.admin.deleteUser(id); // Uncomment if using backend/service role
      // 2. Delete from profiles table
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      setStaff(prev => prev.filter(s => s.id !== id));
      setToast({ type: 'success', message: 'Staff deleted successfully.' });
    } catch (err: any) {
      setToast({ type: 'error', message: err?.message || 'Failed to delete staff.' });
    }
    setDeletingId(null);
    setTimeout(() => setToast(null), 2500);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="text-gray-400">Loading...</div></div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="w-full flex flex-col items-center px-2 md:px-0">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 mt-8">
        <h2 className="text-3xl font-bold mb-2 text-gray-900">Staff Management</h2>
        <p className="text-gray-500 mb-6">Add, view, and manage staff accounts.</p>
        {/* Invite Staff Form */}
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
            {inviteLoading ? 'Adding...' : 'Add Staff'}
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{s.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{s.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeleteStaff(s.id)}
                      disabled={deletingId === s.id}
                      className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50 text-xs font-semibold"
                    >
                      {deletingId === s.id ? 'Deleting...' : 'Delete'}
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

export default ManageStaffPage; 