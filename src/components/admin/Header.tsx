import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, User, MessageSquare, Gift, AlertCircle } from 'lucide-react';

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
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute top-1/2 left-3 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setNotificationOpen(!isNotificationOpen)}
            className="relative text-gray-500 hover:text-gray-700"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4">
              3
            </span>
          </button>
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20">
              <div className="py-2 px-4 text-sm font-semibold text-gray-700 border-b">
                Notifications
              </div>
              <div className="divide-y divide-gray-100">
                {notifications.map((item, index) => (
                   <a href="#" key={index} className="flex items-start px-4 py-3 hover:bg-gray-100">
                      <item.icon className={`w-5 h-5 ${item.color} mt-1 mr-3`} />
                      <div className="w-full">
                        <p className="text-sm text-gray-600">{item.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                      </div>
                   </a>
                ))}
              </div>
              <a href="#" className="block bg-gray-50 text-center text-sm font-medium text-blue-600 py-2 hover:underline">
                View all notifications
              </a>
            </div>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <User className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};

export default Header; 