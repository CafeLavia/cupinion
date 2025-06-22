import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Gift,
  BarChart2,
  Settings,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  CheckSquare,
  PieChart,
  TrendingUp,
  Mail,
  Info,
  Link,
  HelpCircle
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['feedback', 'offers', 'analytics', 'settings']);

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const isSectionOpen = (section: string) => openSections.includes(section);

  const baseLinkClasses = "flex items-center w-full px-3 py-2 text-xs font-medium rounded-md";
  const linkClasses = `${baseLinkClasses} text-gray-400 hover:bg-gray-700 hover:text-white`;
  const activeLinkClasses = "bg-gray-700 text-white";

  return (
    <div className="w-64 bg-[#2C3E50] text-white flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-gray-700 shrink-0">
        Cafe LaVia
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-md ${
              isActive ? 'bg-[#1ABC9C] text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mr-3" />
          Dashboard
        </NavLink>

        {/* Feedback Management */}
        <div>
          <button
            onClick={() => toggleSection('feedback')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <span className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-3" />
              Feedback Management
            </span>
            {isSectionOpen('feedback') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {isSectionOpen('feedback') && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-600 space-y-1">
              <NavLink to="/admin/feedback" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <FileText className="w-4 h-4 mr-3" />
                All Feedback
              </NavLink>
              <NavLink to="/admin/feedback/export" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <Download className="w-4 h-4 mr-3" />
                Export Data
              </NavLink>
            </div>
          )}
        </div>

        {/* Offer Management */}
        <div>
          <button
            onClick={() => toggleSection('offers')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <span className="flex items-center">
              <Gift className="w-5 h-5 mr-3" />
              Offer Management
            </span>
            {isSectionOpen('offers') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {isSectionOpen('offers') && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-600 space-y-1">
              <NavLink to="/admin/offers" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <CheckSquare className="w-4 h-4 mr-3" />
                Offers
              </NavLink>
            </div>
          )}
        </div>

        {/* Analytics & Reports */}
        <div>
          <button
            onClick={() => toggleSection('analytics')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <span className="flex items-center">
              <BarChart2 className="w-5 h-5 mr-3" />
              Analytics & Reports
            </span>
            {isSectionOpen('analytics') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {isSectionOpen('analytics') && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-600 space-y-1">
              <NavLink to="/admin/analytics/ratings" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <PieChart className="w-4 h-4 mr-3" />
                Rating Distribution
              </NavLink>
              <NavLink to="/admin/analytics/trends" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <TrendingUp className="w-4 h-4 mr-3" />
                Feedback Trends
              </NavLink>
              <NavLink to="/admin/analytics/emails" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                <Mail className="w-4 h-4 mr-3" />
                Email Stats
              </NavLink>
            </div>
          )}
        </div>

        {/* Settings */}
        <div>
          <button
            onClick={() => toggleSection('settings')}
            className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-left text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
          >
            <span className="flex items-center">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </span>
            {isSectionOpen('settings') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {isSectionOpen('settings') && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-600 space-y-1">
               <NavLink to="/admin/settings" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                 <Settings className="w-4 h-4 mr-3" />
                Configuration
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 