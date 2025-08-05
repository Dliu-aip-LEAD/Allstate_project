import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ activePage = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active page from location if not provided
  const currentPage = activePage || location.pathname;

  const navItems = [
    { path: '/home', icon: '🏠', label: 'Home' },
    { path: '/play', icon: '🎮', label: 'Play' },
    { path: '/chat', icon: '💬', label: 'Chat' },
    { path: '/profile', icon: '👤', label: 'Profile' }
  ];

  return (
    <nav className="bg-[#0033A0] text-white text-xs fixed bottom-0 left-0 right-0 flex justify-around py-2 shadow-md z-50">
      {navItems.map((item) => (
        <NavItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          onClick={() => navigate(item.path)}
          active={currentPage === item.path}
        />
      ))}
    </nav>
  );
};

const NavItem = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center transition-all ${active ? 'text-white' : 'hover:text-[#00AEFF]'}`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

export default BottomNav;