import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  HelpCircle,
  LogOut
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';

const Sidebar: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['feedback', 'offers', 'analytics', 'settings']);
  const navigate = useNavigate();
  const [role, setRole] = useState<string | null>(null);

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

  const handleLogout = async () => {
    const { error } = await AuthService.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally, show an error message to the user
    } else {
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    // Fetch user role from Supabase profiles (mocked for now)
    const fetchRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (!error && data) setRole(data.role);
      }
    };
    fetchRole();
  }, []);

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
              {/* Feedback Offers: manager, super_admin */}
              {(role === 'manager' || role === 'super_admin') && (
                <NavLink to="/admin/offers" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                  <Gift className="w-4 h-4 mr-3" />
                  Feedback Offers
                </NavLink>
              )}
              {/* Redeem Offers: staff, manager, super_admin */}
              {(role === 'staff' || role === 'manager' || role === 'super_admin') && (
                <NavLink to="/admin/offers/redeem" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                  <CheckSquare className="w-4 h-4 mr-3" />
                  Redeem Offers
                </NavLink>
              )}
              {/* Offer Settings: super_admin only */}
              {role === 'super_admin' && (
                <NavLink to="/admin/offers/settings" className={({isActive}) => isActive ? `${linkClasses} ${activeLinkClasses}`: linkClasses}>
                  <Settings className="w-4 h-4 mr-3" />
                  Offer Settings
                </NavLink>
              )}
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
      <div className="px-4 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 