import React from 'react';

const RoundedButton = ({ children, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full h-14 rounded-full text-lg font-whitney font-semibold shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default RoundedButton; 