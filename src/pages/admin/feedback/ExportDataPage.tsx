import React from 'react';
import { Calendar, Download } from 'lucide-react';
import { FeedbackService } from '../../../services/feedbackService';
import * as XLSX from 'xlsx';
import { useUserRole } from '../../../hooks/useUserRole';

const ExportDataPage: React.FC = () => {
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { viewOnly } = useUserRole();

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const allFeedback = await FeedbackService.fetchAllFeedback();
      // Filter by date range
      const filtered = allFeedback.filter((item: any) => {
        const created = new Date(item.created_at);
        const afterStart = !startDate || created >= new Date(startDate);
        const beforeEnd = !endDate || created <= new Date(endDate + 'T23:59:59');
        return afterStart && beforeEnd;
      });
      // Prepare data for Excel
      const excelData = filtered.map((item: any) => ({
        'Feedback ID': item.custom_id || item.id,
        'Table': item.table_number,
        'User': item.customer_email,
        'Rating': item.rating,
        'Comment': item.details && item.details.notes ? item.details.notes : '',
        'Date': item.created_at ? new Date(item.created_at).toLocaleString() : '',
        'Status': item.status,
        'Admin Notes': item.admin_notes,
        'Details': item.details && item.details.categories ? item.details.categories.join(', ') : '',
      }));
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Feedback');
      XLSX.writeFile(wb, 'feedback_export.xlsx');
    } catch (err: any) {
      setError('Failed to export data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Export Feedback Data</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date Range</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose a start and end date to export the feedback submissions within that period.<br/>
          The data will be exported in an Excel (.xlsx) format.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Start Date */}
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2" />
            </div>
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        <div className="flex justify-end">
          <button
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            onClick={handleExport}
            disabled={loading || viewOnly}
          >
            {loading ? (
              <span className="mr-2">Exporting...</span>
            ) : (
              <><Download className="w-4 h-4 mr-2" />Export Data</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPage; 