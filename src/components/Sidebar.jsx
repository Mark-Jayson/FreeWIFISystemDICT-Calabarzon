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
      <div className="bg-blue-800 text-white w-16 flex flex-col h-full overflow-hidden shadow-black-100">
        <div className="bg-white h-40">
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
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-white/20 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Confirm Logout</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white hover:bg-red-600 rounded"
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
