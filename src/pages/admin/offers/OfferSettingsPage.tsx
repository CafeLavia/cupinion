import React, { useEffect, useState } from 'react';
import { supabase } from '../../../services/supabaseClient';
import { Save, CheckCircle } from 'lucide-react';

const RATINGS = [
  { label: 'Love it', key: 'love_it' },
  { label: 'Great', key: 'great' },
  { label: 'Okay', key: 'okay' },
];

const OfferSettingsPage: React.FC = () => {
  const [percentages, setPercentages] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfigs = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('offer_configs').select('*');
        if (error) throw error;
        const map: { [key: string]: number } = {};
        data.forEach((row: any) => {
          map[row.key] = row.offer_percentage;
        });
        setPercentages(map);
      } catch (err: any) {
        setError('Failed to load offer settings.');
      } finally {
        setLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  const handleChange = (key: string, value: string) => {
    setPercentages(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      for (const rating of RATINGS) {
        await supabase.from('offer_configs').upsert({ key: rating.key, offer_percentage: percentages[rating.key] || 0 }, { onConflict: 'key' });
      }
      setSuccess(true);
    } catch (err) {
      setError('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-lg border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 text-center tracking-tight">Offer Percentages</h1>
        <p className="text-gray-500 mb-8 text-center">Set the discount percentage for each positive feedback rating. These values will be used for customer offers.</p>
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="space-y-6 mb-6">
              {RATINGS.map(rating => (
                <div key={rating.key} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 hover:shadow-sm transition-shadow">
                  <label className="text-lg font-medium text-gray-800">{rating.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={percentages[rating.key] ?? ''}
                      onChange={e => handleChange(rating.key, e.target.value)}
                      className="w-24 px-4 py-2 border-2 border-gray-200 rounded-lg text-right text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
                      required
                    />
                    <span className="text-gray-500 text-lg font-medium">%</span>
                  </div>
                </div>
              ))}
            </div>
            {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
              disabled={saving}
            >
              {success ? <CheckCircle className="w-6 h-6 text-green-300 animate-bounce" /> : <Save className="w-6 h-6" />}
              {saving ? 'Saving...' : success ? 'Saved!' : 'Save Settings'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OfferSettingsPage; 