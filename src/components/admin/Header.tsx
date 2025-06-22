import React from 'react';
import { Menu, Search, Sun, Settings, Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="text-gray-500 mr-4">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <Sun className="w-6 h-6" />
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <Settings className="w-6 h-6" />
        </button>
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          <span className="absolute -top-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">3</span>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <User className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header; 