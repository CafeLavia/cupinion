import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, X, Image as ImageIcon, Save, Info, CheckCircle } from 'lucide-react';
import { FeedbackService } from '../../../services/feedbackService';
import { createPortal } from 'react-dom';

const AllFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ rating: 'All', table: 'All', startDate: '', endDate: '' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});
  const [savingNotes, setSavingNotes] = useState<{ [id: string]: boolean }>({});
  const [billImage, setBillImage] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<any[]>([]);
  const [detailsModal, setDetailsModal] = useState<any | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number } | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Get unique table numbers for filter dropdown
  const tableNumbers = useMemo(() => {
    const nums = qrCodes.map(qr => qr.table_number).filter((v, i, arr) => v && arr.indexOf(v) === i);
    return nums.sort((a, b) => a - b);
  }, [qrCodes]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [feedback, qrCodes] = await Promise.all([
          FeedbackService.fetchAllFeedback(),
          FeedbackService.fetchAllQRCodes()
        ]);
        // Merge location into feedback
        const qrMap = Object.fromEntries(qrCodes.map((qr: any) => [qr.table_number, qr.location]));
        setFeedbackData(feedback.map((fb: any) => ({ ...fb, location: qrMap[fb.table_number] || '-' })));
        setQrCodes(qrCodes);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch feedback');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return feedbackData.filter(item => {
      const searchMatch = (item.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.feedback_id || item.id)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.table_number !== null && item.table_number.toString().includes(searchTerm)));
      const ratingMatch = filters.rating === 'All' || item.rating === filters.rating;
      const tableMatch = filters.table === 'All' || String(item.table_number) === filters.table;
      // Date filter
      let dateMatch = true;
      if (filters.startDate) {
        dateMatch = dateMatch && new Date(item.created_at) >= new Date(filters.startDate);
      }
      if (filters.endDate) {
        dateMatch = dateMatch && new Date(item.created_at) <= new Date(filters.endDate);
      }
      return searchMatch && ratingMatch && tableMatch && dateMatch;
    });
  }, [searchTerm, filters, feedbackData]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({ rating: 'All', table: 'All', startDate: '', endDate: '' });
    setFilterOpen(false);
  };

  const handleNotesChange = (id: string, value: string) => {
    setEditingNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      await FeedbackService.updateAdminNotes(id, editingNotes[id] || '');
      setFeedbackData(prev => prev.map(fb => fb.id === id ? { ...fb, admin_notes: editingNotes[id] } : fb));
    } catch (err) {
      alert('Failed to save notes');
    } finally {
      setSavingNotes(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleMarkReviewed = async (id: string) => {
    setSavingNotes(prev => ({ ...prev, [id]: true }));
    try {
      await FeedbackService.updateStatus(id, 'Reviewed');
      setFeedbackData(prev => prev.map(fb => fb.id === id ? { ...fb, status: 'Reviewed' } : fb));
    } catch (err) {
      alert('Failed to update status');
    } finally {
      setSavingNotes(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleActionMenu = (id: string, event: React.MouseEvent<HTMLButtonElement>) => {
    if (activeMenu === id) {
      setActiveMenu(null);
      setDropdownPos(null);
    } else {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setActiveMenu(id);
      setDropdownPos({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX - 180, // 180 = menu width, adjust as needed
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Feedback</h1>
      <div className="flex-1 flex flex-col bg-white p-6 rounded-xl shadow-lg min-h-[500px]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input type="text" placeholder="Search by user, feedback ID, or table..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-200"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative" ref={filterRef}>
              <button onClick={() => setFilterOpen(!isFilterOpen)} className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              {isFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-30 border p-4">
                  <h4 className="text-sm font-semibold mb-3">Filter Options</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                      <select onChange={(e) => handleFilterChange('rating', e.target.value)} value={filters.rating} className="w-full border-gray-300 rounded-md text-sm p-2 border">
                        <option>All</option> <option>Love it</option> <option>Great</option> <option>Okay</option> <option>Poor</option> <option>Terrible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Table</label>
                      <select onChange={(e) => handleFilterChange('table', e.target.value)} value={filters.table} className="w-full border-gray-300 rounded-md text-sm p-2 border">
                        <option value="All">All</option>
                        {tableNumbers.map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                        <input type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 border" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                        <input type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-full border-gray-300 rounded-md text-sm p-2 border" />
                      </div>
                    </div>
                  </div>
                  <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline mt-4">Reset Filters</button>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/admin/feedback/export')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              Export
            </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-x-auto rounded-lg border border-gray-200 min-h-[300px]">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading feedback...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : (
            <>
            <table className="w-full text-sm text-left bg-white">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Feedback ID</th>
                  <th className="px-4 py-3">Table</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Bill</th>
                  <th className="px-4 py-3">Admin Notes</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-semibold text-gray-800">{item.feedback_id || `FD-${String(item.table_number).padStart(2, '0')}-${item.id.slice(-4).toUpperCase()}`}</td>
                    <td className="px-4 py-3 text-gray-700">{item.table_number}</td>
                    <td className="px-4 py-3 text-gray-700">{item.location || '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{item.customer_email}</td>
                    <td className="px-4 py-3 text-gray-700">{item.rating}</td>
                    <td className="px-4 py-3 text-gray-700">{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</td>
                    <td className="px-4 py-3">
                      {item.bill_image_url ? (
                        <button title="View Bill Image" onClick={() => setBillImage(item.bill_image_url)} className="flex items-center gap-1 text-blue-600 hover:underline">
                          <ImageIcon className="w-5 h-5" /> View
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <textarea
                          className="border border-gray-300 rounded-md text-sm p-1 w-32 focus:ring-2 focus:ring-blue-200"
                          rows={1}
                          value={editingNotes[item.id] !== undefined ? editingNotes[item.id] : (item.admin_notes || '')}
                          onChange={e => handleNotesChange(item.id, e.target.value)}
                        />
                        <button
                          title="Save Notes"
                          className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                          disabled={savingNotes[item.id] || (editingNotes[item.id] === item.admin_notes)}
                          onClick={() => handleSaveNotes(item.id)}
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.status === 'Reviewed' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          <CheckCircle className="w-4 h-4" /> Reviewed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Info className="w-4 h-4" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right relative">
                      <div className="inline-block text-left">
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                          onClick={e => handleActionMenu(item.id, e)}
                          title="Actions"
                        >
                          <MoreHorizontal className="w-5 h-5 text-gray-500" />
                        </button>
                        {activeMenu === item.id && dropdownPos && createPortal(
                          <div
                            className="fixed w-48 bg-white rounded-md shadow-lg z-[1000] border divide-y divide-gray-100"
                            style={{ top: dropdownPos.top, left: dropdownPos.left }}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              onClick={() => { setDetailsModal(item); setActiveMenu(null); setDropdownPos(null); }}
                            >
                              <Info className="w-4 h-4" /> View Details
                            </button>
                            {item.status !== 'Reviewed' && (
                              <button
                                className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                                onClick={() => { handleMarkReviewed(item.id); setActiveMenu(null); setDropdownPos(null); }}
                                disabled={savingNotes[item.id]}
                              >
                                <CheckCircle className="w-4 h-4" /> Mark as Reviewed
                              </button>
                            )}
                          </div>,
                          document.body
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Bill image modal */}
            {billImage && (
              <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-lg flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-4 max-w-2xl w-full relative flex flex-col items-center">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setBillImage(null)}><X className="w-6 h-6" /></button>
                  <img
                    src={billImage}
                    alt="Bill"
                    className="max-w-full max-h-[80vh] rounded object-contain"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <span className="mt-2 text-sm text-gray-400" style={{ display: 'none' }}>Bill image not available</span>
                </div>
              </div>
            )}
            {/* Details modal */}
            {detailsModal && (
              <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-xl w-full relative border border-gray-200">
                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setDetailsModal(null)}><X className="w-6 h-6" /></button>
                  <h2 className="text-xl font-bold mb-4">Feedback Details</h2>
                  <div className="space-y-2">
                    <div><span className="font-semibold">Feedback ID:</span> {detailsModal.feedback_id || `FD-${String(detailsModal.table_number).padStart(2, '0')}-${detailsModal.id.slice(-4).toUpperCase()}`}</div>
                    <div><span className="font-semibold">Table:</span> {detailsModal.table_number}</div>
                    <div><span className="font-semibold">Location:</span> {detailsModal.location || '-'}</div>
                    <div><span className="font-semibold">User:</span> {detailsModal.customer_email}</div>
                    <div><span className="font-semibold">Rating:</span> {detailsModal.rating}</div>
                    <div><span className="font-semibold">Date:</span> {detailsModal.created_at ? new Date(detailsModal.created_at).toLocaleString() : ''}</div>
                    <div><span className="font-semibold">Status:</span> {detailsModal.status}</div>
                    <div><span className="font-semibold">Admin Notes:</span> {detailsModal.admin_notes || '-'}</div>
                    {detailsModal.details && Array.isArray(detailsModal.details.categories) && detailsModal.details.categories.length > 0 && (
                      <div>
                        <span className="font-semibold">Details:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {detailsModal.details.categories.map((cat: string, idx: number) => (
                            <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">{cat}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {detailsModal.bill_image_url && (
                      <div>
                        <span className="font-semibold">Bill Image:</span>
                        <img src={detailsModal.bill_image_url} alt="Bill" className="w-full h-auto rounded mt-2" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">Showing <span className="font-semibold">{filteredData.length > 0 ? 1 : 0}</span> to <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{feedbackData.length}</span> entries</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFeedbackPage; 