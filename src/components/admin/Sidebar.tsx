import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  LogOut,
  CheckCircle
} from 'lucide-react';
import { AuthService } from '../../services/authService';
import { supabase } from '../../services/supabaseClient';
import { useUserRole } from '../../hooks/useUserRole';

// Add props to Sidebar for mobile toggle
interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [openSections, setOpenSections] = useState<string[]>(['feedback', 'offers', 'analytics', 'settings']);
  const navigate = useNavigate();
  const { role, viewOnly } = useUserRole();

  const toggleSection = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? [] // Close all if clicking the open one
        : [section] // Only open the clicked section
    );
  };

  const isSectionOpen = (section: string) => openSections.includes(section);

  const baseLinkClasses = "flex items-center w-full px-3 py-2 md:px-2 md:py-1 text-xs md:text-sm font-medium rounded-md";
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

  // Helper for sidebar links
  const sidebarLink = (to: string, icon: React.ReactNode, label: string, exact: boolean = false) => (
    <NavLink
      to={to}
      end={exact}
      className={({ isActive }) =>
        isActive
          ? 'bg-[#34495E] text-white flex items-center w-full px-3 py-2 text-xs font-medium rounded-md'
          : 'hover:bg-[#34495E] text-white/80 flex items-center w-full px-3 py-2 text-xs font-medium rounded-md'
      }
      onClick={() => {
        if (window.innerWidth < 768) setSidebarOpen(false);
      }}
    >
      {icon}
      {label}
    </NavLink>
  );

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40
      w-64 md:w-56 sm:w-48 w-40
      max-w-[90vw] min-w-[10rem]
      bg-[linear-gradient(to_bottom,#186863_0%,#084040_50%,#011217_100%)]
      transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      transition-transform duration-200 ease-in-out
      md:relative md:translate-x-0 md:block
      max-h-screen overflow-y-auto
      font-quattrocento
    `}
    style={{
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Close button for mobile */}
      <button 
        className="absolute top-4 right-4 md:top-2 md:right-2 md:hidden z-50" 
        onClick={() => setSidebarOpen(false)}
        style={{
          WebkitTapHighlightColor: 'transparent'
        }}
      >
        {/* Close icon (X) */}
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="h-16 flex items-center justify-center text-xl md:text-2xl font-bold border-b border-gray-700 shrink-0 text-white font-cherry-swash">
        Cafe LaVia
      </div>
      <nav className="flex-1 px-4 py-4 md:px-2 md:py-2 space-y-2 overflow-y-auto">
        {/* Dashboard */}
        {role !== 'staff' && sidebarLink('/admin/dashboard', <LayoutDashboard className="w-5 h-5 mr-3" />, 'Dashboard')}

        {/* Feedback Management */}
        {role !== 'staff' && (
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
                {sidebarLink('/admin/feedback', <FileText className="w-4 h-4 mr-3" />, 'All Feedback')}
                {sidebarLink('/admin/feedback/export', <Download className="w-4 h-4 mr-3" />, 'Export Data')}
              </div>
            )}
          </div>
        )}

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
              {/* Redeem Offers: staff, manager, super_admin */}
              {(role === 'staff' || role === 'manager' || role === 'super_admin') &&
                sidebarLink('/admin/offers/redeem', <CheckSquare className="w-4 h-4 mr-3" />, 'Redeem Offers')}
              {/* All Redemptions: staff, manager, super_admin */}
              {(role === 'staff' || role === 'manager' || role === 'super_admin') &&
                sidebarLink('/admin/offers/all-redemptions', <CheckCircle className="w-4 h-4 mr-3" />, 'All Redemptions')}
              {/* The rest only for manager or super_admin */}
              {(role === 'manager' || role === 'super_admin') &&
                sidebarLink('/admin/offers', <Gift className="w-4 h-4 mr-3" />, 'Feedback Offers', true)}
              {(role === 'manager' || role === 'super_admin') &&
                sidebarLink('/admin/offers/settings', <Settings className="w-4 h-4 mr-3" />, 'Offer Settings')}
            </div>
          )}
        </div>

        {/* Hide all other admin links for staff */}
        {role !== 'staff' && (
          <>
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
                  {sidebarLink('/admin/analytics/ratings', <PieChart className="w-4 h-4 mr-3" />, 'Rating Distribution')}
                  {sidebarLink('/admin/analytics/trends', <TrendingUp className="w-4 h-4 mr-3" />, 'Feedback Trends')}
                  {sidebarLink('/admin/analytics/emails', <Mail className="w-4 h-4 mr-3" />, 'Email Stats')}
                  {sidebarLink('/admin/analytics/all-emails', <Mail className="w-4 h-4 mr-3" />, 'All Emails')}
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
                  {sidebarLink('/admin/settings', <Settings className="w-4 h-4 mr-3" />, 'Configuration')}
                  {/* Manager Management: only for super_admin */}
                  {role === 'super_admin' &&
                    sidebarLink('/admin/settings/user-permissions', <Settings className="w-4 h-4 mr-3" />, 'Manager Management')}
                  {/* Manage Staff: super_admin and manager (not view_only) */}
                  {(role === 'super_admin' || role === 'manager') &&
                    sidebarLink('/admin/settings/manage-staff', <Settings className="w-4 h-4 mr-3" />, 'Manage Staff')}
                </div>
              )}
            </div>
          </>
        )}
      </nav>
      <div className="px-4 py-4 md:px-2 md:py-2 border-t border-gray-700">
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