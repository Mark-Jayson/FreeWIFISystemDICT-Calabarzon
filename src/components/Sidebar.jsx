import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DICTLogo from '../assets/DICTLogo.png';
import FreeWifi from '../assets/FreeWifi.png';
import Dashboard from '../assets/Dashboard.png';
import MapMarker from '../assets/MapMarker.png';
import AddLocation from '../assets/AddLocation.png';
import Logout from '../assets/logout.png';
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

  // RGB color palette to override Tailwind OKLCH defaults
  const colors = {
    // Blue palette
    blue800: 'rgb(30, 64, 175)',
    blue700: 'rgb(29, 78, 216)',
    blue900: 'rgb(30, 58, 138)',
    
    // Gray palette
    white: 'rgb(255, 255, 255)',
    gray200: 'rgb(229, 231, 235)',
    gray300: 'rgb(209, 213, 219)',
    gray700: 'rgb(55, 65, 81)',
    gray900: 'rgb(17, 24, 39)',
    
    // Red palette
    red500: 'rgb(239, 68, 68)',
    red600: 'rgb(220, 38, 38)',
    
    // Overlay
    whiteOverlay: 'rgba(255, 255, 255, 0.2)',
    transparent: 'rgba(0, 0, 0, 0)'
  };

  useEffect(() => {
    // Inject CSS custom properties to override Tailwind colors
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --color-blue-800: ${colors.blue800};
        --color-blue-700: ${colors.blue700};
        --color-blue-900: ${colors.blue900};
        --color-white: ${colors.white};
        --color-gray-200: ${colors.gray200};
        --color-gray-300: ${colors.gray300};
        --color-gray-700: ${colors.gray700};
        --color-gray-900: ${colors.gray900};
        --color-red-500: ${colors.red500};
        --color-red-600: ${colors.red600};
      }
      
      /* Override Tailwind classes with RGB values */
      .bg-blue-800 { background-color: ${colors.blue800} !important; }
      .bg-blue-700 { background-color: ${colors.blue700} !important; }
      .bg-blue-900 { background-color: ${colors.blue900} !important; }
      .bg-white { background-color: ${colors.white} !important; }
      .bg-gray-200 { background-color: ${colors.gray200} !important; }
      .bg-red-500 { background-color: ${colors.red500} !important; }
      
      .text-white { color: ${colors.white} !important; }
      .text-gray-700 { color: ${colors.gray700} !important; }
      .text-gray-900 { color: ${colors.gray900} !important; }
      
      .border-gray-200 { border-color: ${colors.gray200} !important; }
      
      .hover\\:bg-blue-700:hover { background-color: ${colors.blue700} !important; }
      .hover\\:bg-gray-300:hover { background-color: ${colors.gray300} !important; }
      .hover\\:bg-red-600:hover { background-color: ${colors.red600} !important; }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      setShowLogoutConfirm(true);
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
          WebkitTapHighlightColor: colors.transparent
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
        className="bg-blue-800 text-white w-16 flex flex-col h-full overflow-hidden shadow-black-100"
        style={{ 
          WebkitTapHighlightColor: colors.transparent
        }}
      >
        <div 
          className="bg-white border-b border-gray-200 h-40"
        >
          <div className="w-full flex justify-center py-3">
            <div className="bg-white rounded-full p-1">
              <img src={DICTLogo} alt="DICT Logo" className="w-10 h-10" />
            </div>
          </div>
          <div className="w-full flex justify-center py-3 mb-8">
            <div className="bg-white rounded-full p-1">
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
            backgroundColor: colors.whiteOverlay,
            WebkitTapHighlightColor: colors.transparent
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-gray-900 text-lg font-semibold mb-4">
              Confirm Logout
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="bg-gray-200 text-gray-900 hover:bg-gray-300 px-4 py-2 text-sm rounded transition-colors duration-200"
                style={{ 
                  WebkitTapHighlightColor: colors.transparent
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 text-sm rounded transition-colors duration-200"
                style={{ 
                  WebkitTapHighlightColor: colors.transparent
                }}
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