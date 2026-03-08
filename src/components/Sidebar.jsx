import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DICTLogo from '../assets/DICTLogo.png';
import FreeWifi from '../assets/FreeWifi.png';
import Dashboard from '../assets/Dashboard.png';
import MapMarker from '../assets/MapMarker.png';
import AddLocation from '../assets/AddLocation.png';
import Logout from '../assets/Logout.png';
import { Wifi, List } from 'lucide-react';

const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      console.log("Logging out...");
      localStorage.removeItem('user');
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return { logout };
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useAuth();

  useEffect(() => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    setActiveTab(path);
  }, [location, setActiveTab]);

  const navItems = [
    { id: 'logo', label: 'DICT Logo', icon: DICTLogo, type: 'logo' },
    { id: 'wifi', label: 'WiFi List', icon: 'wifi-icon', path: '/wifi', type: 'title' },
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard, path: '/dashboard', section: 'main' },
    { id: 'map', label: 'Map', icon: MapMarker, path: '/map', section: 'main' },
    { id: 'add', label: 'Add Location', icon: AddLocation, path: '/add-wifi-site', section: 'bottom' },
    { id: 'logout', label: 'Logout', icon: Logout, path: '/login', section: 'bottom' }
  ];

  const handleNavigation = (item) => {
    setActiveTab(item.id);
    if (item.id === 'logout') {
      setShowLogoutConfirm(true); // show confirmation modal
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const renderNavItem = (item) => {
    if (item.type === 'logo') return null;

    const isActive = activeTab === item.id;

    return (
      <div
        key={item.id}
        className={`relative w-full flex flex-col items-center py-3 cursor-pointer transition-all duration-200
          ${isActive ? 'bg-blue-900' : 'hover:bg-blue-700'}
          ${item.type === 'title' ? 'mb-4' : ''}`}
        onClick={() => handleNavigation(item)}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{ 
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)' 
        }}
      >
        {item.icon === 'wifi-icon' ? (
          <div className="relative w-6 h-6 mb-1">
            <Wifi className="w-4 h-4 absolute top-0 left-1" />
            <List className="w-3 h-3 absolute bottom-0 right-0" />
          </div>
        ) : (
          <img src={item.icon} alt={item.label} className="w-6 h-6 mb-1" />
        )}
        <span className="text-xs text-center">{item.label}</span>
      </div>
    );
  };

  const mainItems = navItems.filter(item => item.section === 'main');
  const bottomItems = navItems.filter(item => item.section === 'bottom');
  const titleItems = navItems.filter(item => item.type === 'title');

  return (
    <>
      <div 
        className="text-white w-16 flex flex-col h-full overflow-hidden shadow-black-100"
        style={{ 
          backgroundColor: 'rgba(30, 64, 175, 1)', // Blue-800 equivalent
          WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
        }}
      >
        <div 
          className="h-40"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderBottomColor: 'rgba(229, 231, 235, 1)', // Gray-200 equivalent
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid'
          }}
        >
          <div className="w-full flex justify-center py-3">
            <div 
              className="rounded-full p-1"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 1)' 
              }}
            >
              <img src={DICTLogo} alt="DICT Logo" className="w-10 h-10" />
            </div>
          </div>
          <div className="w-full flex justify-center py-3 mb-8">
            <div 
              className="rounded-full p-1"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 1)' 
              }}
            >
              <img src={FreeWifi} alt="Free WiFi Logo" className="w-10 h-10" />
            </div>
          </div>

          <div>{mainItems.map(renderNavItem)}</div>
        </div>

        <div className="flex-grow" />
        <div>{titleItems.map(renderNavItem)}</div>
        <div>{bottomItems.map(renderNavItem)}</div>
      </div>

      {showLogoutConfirm && (
        <div 
          className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
          }}
        >
          <div 
            className="rounded-lg shadow-xl p-6 max-w-sm w-full"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(229, 231, 235, 1)', // Gray-200 equivalent
              borderWidth: '1px',
              borderStyle: 'solid'
            }}
          >
            <h3 
              className="text-lg font-semibold mb-4"
              style={{ 
                color: 'rgba(17, 24, 39, 1)' // Gray-900 equivalent
              }}
            >
              Confirm Logout
            </h3>
            <p 
              className="mb-6"
              style={{ 
                color: 'rgba(55, 65, 81, 1)' // Gray-700 equivalent
              }}
            >
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-sm rounded transition-colors duration-200"
                style={{ 
                  backgroundColor: 'rgba(229, 231, 235, 1)', // Gray-200 equivalent
                  color: 'rgba(17, 24, 39, 1)', // Gray-900 equivalent
                  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(209, 213, 219, 1)'} // Gray-300 equivalent
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(229, 231, 235, 1)'} // Gray-200 equivalent
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm rounded transition-colors duration-200"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 1)', // Red-500 equivalent
                  color: 'rgba(255, 255, 255, 1)',
                  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(220, 38, 38, 1)'} // Red-600 equivalent
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 1)'} // Red-500 equivalent
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default Sidebar;