import React from 'react';

const BackButton = ({ onClick, className = '', ariaLabel = 'Back', ...props }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-blue-50 transition z-10 ${className}`}
    aria-label={ariaLabel}
    type="button"
    {...props}
  >
    <svg
      className="w-6 h-6 text-[#0033A0]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  </button>
);

export default BackButton; 