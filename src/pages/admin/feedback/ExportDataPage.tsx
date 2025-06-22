import React from 'react';
import { Calendar, Download } from 'lucide-react';

const ExportDataPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Export Feedback Data</h1>

      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date Range</h2>
        <p className="text-sm text-gray-600 mb-6">
          Choose a start and end date to export the feedback submissions within that period.
          The data will be exported in a CSV format.
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
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Calendar className="w-5 h-5 text-gray-400 absolute top-1/2 right-3 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPage; 