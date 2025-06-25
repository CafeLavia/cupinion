import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { User as UserIcon } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          setProfile(data);
          setName(data.full_name || '');
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameLoading(true);
    setNameMessage(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', user.id);
    if (!error) {
      setNameMessage('Name updated successfully!');
      setProfile((prev) => prev ? { ...prev, full_name: name } : prev);
    } else {
      setNameMessage('Failed to update name.');
    }
    setNameLoading(false);
    setTimeout(() => setNameMessage(null), 2500);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage('Passwords do not match.');
      setPasswordLoading(false);
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
    if (!error) {
      setPasswordMessage('Password updated successfully!');
      setPasswords({ newPassword: '', confirmPassword: '' });
    } else {
      setPasswordMessage('Failed to update password.');
    }
    setPasswordLoading(false);
    setTimeout(() => setPasswordMessage(null), 2500);
  };

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="text-gray-400">Loading...</div></div>;

  return (
    <div className="w-full flex flex-col items-center px-2 md:px-0">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-10 mt-8 flex flex-col gap-8 border border-gray-100">
        {/* Avatar and Name */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-400 flex items-center justify-center text-white text-4xl font-bold shadow-md mb-2">
            {profile?.full_name ? profile.full_name[0].toUpperCase() : <UserIcon className="w-10 h-10" />}
          </div>
          <div className="text-xl font-semibold text-gray-900">{profile?.full_name}</div>
          <div className="text-gray-500 text-sm">{profile?.email}</div>
        </div>
        {/* Divider */}
        <div className="border-t border-gray-200" />
        {/* Name Update */}
        <form onSubmit={handleNameUpdate} className="flex flex-col gap-3">
          <label className="text-gray-700 font-semibold">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base"
            required
            disabled={nameLoading}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-base w-full md:w-fit"
            disabled={nameLoading || !name}
          >
            {nameLoading ? 'Updating...' : 'Update Name'}
          </button>
          {nameMessage && <div className={`text-sm mt-1 ${nameMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{nameMessage}</div>}
        </form>
        {/* Divider */}
        <div className="border-t border-gray-200" />
        {/* Password Update */}
        <form onSubmit={handlePasswordUpdate} className="flex flex-col gap-3">
          <label className="text-gray-700 font-semibold">Change Password</label>
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base"
            required
            disabled={passwordLoading}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={e => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 text-base"
            required
            disabled={passwordLoading}
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 text-base w-full md:w-fit"
            disabled={passwordLoading || !passwords.newPassword || !passwords.confirmPassword}
          >
            {passwordLoading ? 'Updating...' : 'Change Password'}
          </button>
          {passwordMessage && <div className={`text-sm mt-1 ${passwordMessage.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{passwordMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 