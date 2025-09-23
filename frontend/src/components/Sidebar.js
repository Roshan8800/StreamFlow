import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';
import { 
  Home, 
  Play, 
  Heart, 
  History, 
  User, 
  Settings, 
  Shield,
  Users,
  Video,
  BarChart3,
  Menu,
  X,
  List,
  Clock,
  MessageSquare,
  Bell,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const { user, sidebarOpen, setSidebarOpen } = useContext(AppContext);
  const location = useLocation();

  const userMenuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Play, label: 'Videos', path: '/videos' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
    { icon: History, label: 'Watch History', path: '/history' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const adminMenuItems = [
    { icon: Shield, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Video, label: 'Videos', path: '/admin/videos' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  const menuItems = user?.role === 'admin' ? [...userMenuItems, ...adminMenuItems] : userMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-20 left-0 z-50 h-[calc(100vh-5rem)] w-80 
        glass border-r border-white border-opacity-10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Close button for mobile */}
          <div className="flex justify-end mb-4 lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="btn-ghost p-2"
              data-testid="close-sidebar"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-4 p-3 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg' 
                      : 'hover:bg-white hover:bg-opacity-10 text-gray-300 hover:text-white'
                    }
                    ${!sidebarOpen && 'lg:justify-center lg:w-12 lg:h-12 lg:p-0'}
                  `}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  data-testid={`sidebar-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span className={`font-medium ${!sidebarOpen && 'lg:hidden'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* User Role Badge */}
          {user?.role === 'admin' && sidebarOpen && (
            <div className="mt-auto pt-4 border-t border-white border-opacity-10">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl text-black font-semibold">
                <Shield size={16} />
                <span className="text-sm">Administrator</span>
              </div>
            </div>
          )}

          {/* Toggle Button for Desktop */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex items-center justify-center p-2 mt-4 hover:bg-white hover:bg-opacity-10 rounded-xl transition-colors"
            data-testid="desktop-sidebar-toggle"
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;