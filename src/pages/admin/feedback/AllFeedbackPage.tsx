import React from 'react';
import { Search, Filter, ChevronsUpDown, MoreHorizontal } from 'lucide-react';

const AllFeedbackPage: React.FC = () => {
  // Sample data - replace with actual data from your backend
  const feedbackData = [
    { id: 'FBK-001', user: 'user1@example.com', rating: 'Great', type: 'Good', date: '2023-10-27', status: 'Reviewed' },
    { id: 'FBK-002', user: 'user2@example.com', rating: 'Poor', type: 'Bad', date: '2023-10-26', status: 'Pending' },
    { id: 'FBK-003', user: 'user3@example.com', rating: 'Love it', type: 'Good', date: '2023-10-25', status: 'Reviewed' },
    { id: 'FBK-004', user: 'user4@example.com', rating: 'Okay', type: 'Good', date: '2023-10-24', status: 'Reviewed' },
    { id: 'FBK-005', user: 'user5@example.com', rating: 'Terrible', type: 'Bad', date: '2023-10-23', status: 'Pending' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Feedback</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Header with Search and Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="relative w-1/3">
            <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by user or comment..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
              Export
            </button>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <div className="flex items-center">
                    ID <ChevronsUpDown className="w-3 h-3 ml-1.5" />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3">User</th>
                <th scope="col" className="px-6 py-3">Rating</th>
                <th scope="col" className="px-6 py-3">Type</th>
                <th scope="col" className="px-6 py-3">Date</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {feedbackData.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="w-4 p-4">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
                  </td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.id}
                  </th>
                  <td className="px-6 py-4">{item.user}</td>
                  <td className="px-6 py-4">{item.rating}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.type === 'Good' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'Reviewed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button>
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-700">
            Showing <span className="font-semibold">1</span> to <span className="font-semibold">5</span> of <span className="font-semibold">5</span> entries
          </span>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100" disabled>Previous</button>
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllFeedbackPage; 