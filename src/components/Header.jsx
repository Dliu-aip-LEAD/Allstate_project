import React from 'react';
import logo from '../assets/logo.png';

const Header = ({ 
  variant = 'home', // 'home' or 'onboarding'
  showButtons = false,
  buttons = [],
  className = '',
  onButtonClick = () => {}
}) => {
  const isHome = variant === 'home';
  const isOnboarding = variant === 'onboarding';

  return (
    <header className={`w-full bg-[#0033A0] fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className={`w-full flex ${isHome ? 'justify-between items-center px-4 py-3' : 'flex-col items-center py-6 px-4 md:py-8 md:px-12'}`}>
        <div className={`w-full flex items-center ${isOnboarding ? 'justify-between max-w-5xl mx-auto' : 'justify-between'}`}>
          {/* Left side - Logo/Brand */}
          <div className="flex items-center">
            {isHome ? (
              <div className="text-white">
                <p className="text-base font-bold">Allstate®</p>
                <p className="text-xs font-medium">IDENTITY PROTECTION</p>
              </div>
            ) : (
              <div className="flex items-center">
                <img 
                  src={logo} 
                  alt="Allstate Identity Protection" 
                  className="h-8 md:h-10 object-contain"
                />
              </div>
            )}
          </div>

          {/* Right side - Buttons and Shield */}
          <div className="flex items-center gap-4">
            {/* Action Buttons */}
            {showButtons && buttons.length > 0 && (
              <div className="flex items-center gap-2">
                {buttons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => onButtonClick(button.action)}
                    className={`${button.className || 'bg-[#E2F0FF] text-[#0662CD] font-bold text-lg rounded-full px-6 py-2 shadow-sm hover:bg-[#d0e7ff] focus:outline-none focus:ring-2 focus:ring-blue-400'}`}
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            )}

            {/* Shield Icon */}
            <div className={`${isHome ? 'w-8 h-8' : 'w-12 h-12'} rounded-full bg-white/80 flex items-center justify-center text-blue-900 font-bold text-lg`}>
              {isHome ? (
                <span className="text-sm font-semibold">🛡️</span>
              ) : (
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" fill="#fff"/>
                  <path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" stroke="#0033A0" strokeWidth="2"/>
                  <circle cx="16" cy="16" r="5" fill="#0033A0"/>
                  <path d="M16 13V16L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;