import React, { useContext } from 'react';
import { AppContext } from '../App';
import { Search, Menu, User, LogOut, Settings, Shield } from 'lucide-react';

const Header = () => {
  const { user, logout, sidebarOpen, setSidebarOpen } = useContext(AppContext);

  return (
    <header className="glass sticky top-0 z-50 h-20 px-6 flex items-center justify-between border-b border-opacity-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="btn-ghost p-2 lg:hidden"
          data-testid="mobile-menu-toggle"
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white">
            P
          </div>
          <h1 className="text-2xl font-bold text-gradient font-['Poppins']">PlayNite</h1>
        </div>
      </div>

      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="search-container w-full">
          <div className="relative">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search videos..."
              className="input search-input"
              data-testid="search-input"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-xs font-semibold text-black">
            <Shield size={14} />
            ADMIN
          </div>
        )}
        
        <div className="relative group">
          <button className="btn-ghost p-2 rounded-full" data-testid="user-menu-toggle">
            <User size={24} />
          </button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-12 glass-card p-4 min-w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white border-opacity-10">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-white">{user?.username}</div>
                <div className="text-sm text-gray-400">{user?.email}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <button 
                className="w-full flex items-center gap-3 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors text-left"
                data-testid="profile-link"
              >
                <User size={16} />
                Profile
              </button>
              
              <button 
                className="w-full flex items-center gap-3 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors text-left"
                data-testid="settings-link"
              >
                <Settings size={16} />
                Settings
              </button>
              
              <hr className="border-white border-opacity-10 my-2" />
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 p-2 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors text-left text-red-400"
                data-testid="logout-button"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;