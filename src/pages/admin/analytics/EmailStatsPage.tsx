import React from 'react';
import { Mail, BarChart } from 'lucide-react';

const EmailStatsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Email Collection Statistics</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stat Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100">
                    <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-500 text-sm font-medium">Total Emails Collected</h4>
                    <p className="text-3xl font-bold text-gray-800">1,284</p>
                </div>
            </div>
        </div>

        {/* Stat Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                    <BarChart className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                    <h4 className="text-gray-500 text-sm font-medium">Collection Rate</h4>
                    <p className="text-3xl font-bold text-gray-800">15.2%</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStatsPage; 