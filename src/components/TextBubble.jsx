import React from 'react';

const TextBubble = ({ children, className = '', style = {} }) => (
  <div
    className={`flex flex-col items-center justify-center border border-[#D9D9D9] bg-[#1F6FCB] text-white text-base font-whitney rounded-lg shadow-[0px_1px_4px_rgba(12,12,13,0.1),0px_1px_4px_rgba(12,12,13,0.05)] ${className}`}
    style={style}
  >
    {children}
  </div>
);

export default TextBubble; 