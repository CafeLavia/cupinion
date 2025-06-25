import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, User, MessageSquare, Gift, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  const notifications = [
    { icon: MessageSquare, text: "New feedback received from user@example.com", time: "5m ago", color: "text-blue-500" },
    { icon: Gift, text: "Offer 'WEEKEND20' was redeemed.", time: "1h ago", color: "text-green-500" },
    { icon: AlertCircle, text: "A new negative feedback requires attention.", time: "3h ago", color: "text-red-500" },
  ];

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <button className="text-gray-500 mr-4 md:hidden" onClick={() => setSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center space-x-5">
        <Link to="/admin/profile" className="text-gray-500 hover:text-gray-700">
          <User className="w-6 h-6" />
        </Link>
      </div>
    </header>
  );
};

export default Header; 