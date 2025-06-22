import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronsUpDown, MoreHorizontal, X } from 'lucide-react';

const AllFeedbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ rating: 'All', type: 'All', status: 'All' });
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filterRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const feedbackData = [
    { id: 'FBK-001', user: 'user1@example.com', rating: 'Great', type: 'Good', date: '2023-10-27', status: 'Reviewed' },
    { id: 'FBK-002', user: 'user2@example.com', rating: 'Poor', type: 'Bad', date: '2023-10-26', status: 'Pending' },
    { id: 'FBK-003', user: 'user3@example.com', rating: 'Love it', type: 'Good', date: '2023-10-25', status: 'Reviewed' },
    { id: 'FBK-004', user: 'user4@example.com', rating: 'Okay', type: 'Good', date: '2023-10-24', status: 'Reviewed' },
    { id: 'FBK-005', user: 'user5@example.com', rating: 'Terrible', type: 'Bad', date: '2023-10-23', status: 'Pending' },
  ];

  const filteredData = useMemo(() => {
    return feedbackData.filter(item => {
      const searchMatch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) || item.id.toLowerCase().includes(searchTerm.toLowerCase());
      const ratingMatch = filters.rating === 'All' || item.rating === filters.rating;
      const typeMatch = filters.type === 'All' || item.type === filters.type;
      const statusMatch = filters.status === 'All' || item.status === filters.status;
      return searchMatch && ratingMatch && typeMatch && statusMatch;
    });
  }, [searchTerm, filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const resetFilters = () => {
    setFilters({ rating: 'All', type: 'All', status: 'All' });
    setFilterOpen(false);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">All Feedback</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input type="text" placeholder="Search by user or comment..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm"
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
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-20 border p-4">
                  <h4 className="text-sm font-semibold mb-3">Filter Options</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
                      <select onChange={(e) => handleFilterChange('rating', e.target.value)} value={filters.rating} className="w-full border-gray-300 rounded-md text-sm p-2 border">
                        <option>All</option> <option>Love it</option> <option>Great</option> <option>Okay</option> <option>Poor</option> <option>Terrible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                      <select onChange={(e) => handleFilterChange('type', e.target.value)} value={filters.type} className="w-full border-gray-300 rounded-md text-sm p-2 border">
                        <option>All</option> <option>Good</option> <option>Bad</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                      <select onChange={(e) => handleFilterChange('status', e.target.value)} value={filters.status} className="w-full border-gray-300 rounded-md text-sm p-2 border">
                        <option>All</option> <option>Reviewed</option> <option>Pending</option>
                      </select>
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" /></th>
                <th scope="col" className="px-6 py-3 font-medium">ID</th>
                <th scope="col" className="px-6 py-3 font-medium">User</th>
                <th scope="col" className="px-6 py-3 font-medium">Rating</th>
                <th scope="col" className="px-6 py-3 font-medium">Type</th>
                <th scope="col" className="px-6 py-3 font-medium">Date</th>
                <th scope="col" className="px-6 py-3 font-medium">Status</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="bg-white border-b">
                  <td className="w-4 p-4"><input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" /></td>
                  <td className="px-6 py-4 font-semibold text-gray-700">{item.id}</td>
                  <td className="px-6 py-4 text-gray-600">{item.user}</td>
                  <td className="px-6 py-4 text-gray-600">{item.rating}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${ item.type === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{item.type}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${item.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="relative" ref={activeMenu === item.id ? menuRef : null}>
                      <button onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}><MoreHorizontal className="w-5 h-5 text-gray-500" /></button>
                      {activeMenu === item.id && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">View Details</a>
                          <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mark as Reviewed</a>
                          <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Delete</a>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredData.length}</span> of <span className="font-semibold">{feedbackData.length}</span> entries</span>
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