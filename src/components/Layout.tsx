import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import {
  Home, Calendar, FileText, Users, Building2, BarChart3, LogOut,
  Menu, X, Bell, Moon, Sun, ChevronDown, User
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { notifications, darkMode, toggleDarkMode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    const baseItems = [
      { path: '/dashboard', label: 'Dashboard', icon: Home },
    ];

    if (user?.role === 'employee') {
      return [
        ...baseItems,
        { path: '/apply-leave', label: 'Apply Leave', icon: Calendar },
        { path: '/leave-history', label: 'Leave History', icon: FileText },
      ];
    }

    if (user?.role === 'manager') {
      return [
        ...baseItems,
        { path: '/leave-requests', label: 'Leave Requests', icon: FileText },
        { path: '/team', label: 'Team', icon: Users },
      ];
    }

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { path: '/outlets', label: 'Outlets', icon: Building2 },
        { path: '/employees', label: 'Employees', icon: Users },
        { path: '/leave-requests', label: 'Leave Requests', icon: FileText },
        { path: '/reports', label: 'Reports', icon: BarChart3 },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'shell-pattern'}`}>
      {/* Mobile Header */}
      <header className={`lg:hidden fixed top-0 left-0 right-0 z-50 ${darkMode ? 'bg-gray-800' : 'bg-maroon'} shadow-lg`}>
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-cream p-2">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
              <span className="text-maroon font-serif font-bold text-sm">G</span>
            </div>
            <span className="text-cream font-serif font-semibold">Grover Sweets</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setNotifOpen(!notifOpen)} className="text-cream p-2 relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setSidebarOpen(false)}>
          <div className={`w-72 h-full ${darkMode ? 'bg-gray-800' : 'bg-maroon'} p-4`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-maroon font-serif font-bold">G</span>
                </div>
                <div>
                  <h1 className="text-cream font-serif font-bold text-lg">Grover Sweets</h1>
                  <p className="text-cream/60 text-xs">Leave Management</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-cream p-2">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    location.pathname === item.path
                      ? 'bg-gold text-maroon font-medium'
                      : 'text-cream/80 hover:bg-white/10'
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-cream/80 hover:bg-white/10 rounded-lg transition-all"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-64 ${darkMode ? 'bg-gray-800' : 'bg-maroon pattern-bg-maroon'} shadow-xl z-40`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center shadow-lg">
              <span className="text-maroon font-serif font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-cream font-serif font-bold text-xl">Grover Sweets</h1>
              <p className="text-gold/80 text-xs tracking-wide">Leave Management System</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? 'bg-gold text-maroon font-semibold shadow-lg'
                  : 'text-cream/80 hover:bg-white/10 hover:text-cream'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-cream/80 hover:bg-white/10 hover:text-cream rounded-xl transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`lg:ml-64 min-h-screen ${darkMode ? 'bg-gray-900' : ''}`}>
        {/* Desktop Header */}
        <header className={`hidden lg:flex items-center justify-between px-8 py-4 ${darkMode ? 'bg-gray-800' : 'bg-cream'} border-b ${darkMode ? 'border-gray-700' : 'border-gold/20'} sticky top-0 z-30`}>
          <div>
            <h2 className={`font-serif text-2xl ${darkMode ? 'text-cream' : 'text-maroon'} font-semibold`}>
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Welcome back, {user?.name}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gold' : 'bg-cream-dark text-maroon'} transition-all hover:scale-105`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-cream' : 'bg-cream-dark text-maroon'} transition-all hover:scale-105 relative`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {notifOpen && (
                <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gold/20'} overflow-hidden`}>
                  <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gold/10'} border-b ${darkMode ? 'border-gray-600' : 'border-gold/20'}`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-cream' : 'text-maroon'}`}>Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.filter(n => n.userId === user?.id).slice(0, 5).map(notif => (
                      <div key={notif.id} className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'} ${!notif.read ? (darkMode ? 'bg-gray-700/50' : 'bg-gold/5') : ''}`}>
                        <p className={`text-sm font-medium ${darkMode ? 'text-cream' : 'text-gray-800'}`}>{notif.title}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{notif.message}</p>
                      </div>
                    ))}
                    {notifications.filter(n => n.userId === user?.id).length === 0 && (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-cream-dark'} transition-all hover:shadow-md`}
              >
                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                  <User size={16} className="text-maroon" />
                </div>
                <div className="text-left hidden xl:block">
                  <p className={`text-sm font-medium ${darkMode ? 'text-cream' : 'text-maroon'}`}>{user?.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>{user?.role}</p>
                </div>
                <ChevronDown size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
              
              {userMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl border ${darkMode ? 'border-gray-700' : 'border-gold/20'} overflow-hidden`}>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 w-full px-3 py-2 text-sm ${darkMode ? 'text-cream hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} rounded-lg transition-all`}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </div>
      </main>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast-enter flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-72 ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'warning' ? 'bg-orange text-white' :
            'bg-maroon text-cream'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="hover:opacity-70">
            <X size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};
