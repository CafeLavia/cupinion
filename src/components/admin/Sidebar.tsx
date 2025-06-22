import React from 'react';
import { LayoutDashboard, Palette, Type, Shield, Lock, UserPlus, Menu, File } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-[#2C3E50] text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700">
        Datta Able
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        <div>
          <h3 className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wider">Navigation</h3>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-100 bg-[#1ABC9C] rounded-md">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </a>
        </div>
        <div>
          <h3 className="px-4 py-2 mt-4 text-xs text-gray-400 uppercase tracking-wider">UI Elements</h3>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <Palette className="w-5 h-5 mr-3" />
            Color
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <Type className="w-5 h-5 mr-3" />
            Typography
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <Shield className="w-5 h-5 mr-3" />
            Icons
          </a>
        </div>
        <div>
          <h3 className="px-4 py-2 mt-4 text-xs text-gray-400 uppercase tracking-wider">Pages</h3>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <Lock className="w-5 h-5 mr-3" />
            Login
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <UserPlus className="w-5 h-5 mr-3" />
            Register
          </a>
        </div>
        <div>
          <h3 className="px-4 py-2 mt-4 text-xs text-gray-400 uppercase tracking-wider">Other</h3>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <Menu className="w-5 h-5 mr-3" />
            Menu levels
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md">
            <File className="w-5 h-5 mr-3" />
            Sample page
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 