import React, { useEffect, useState } from 'react';

const TypewriterText = ({ text = '', speed = 30, className = '' }) => {
  const safeText = typeof text === 'string' ? text : '';
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + (safeText[i] || ''));
      i++;
      if (i >= safeText.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < safeText.length && <span className="typewriter-cursor">|</span>}
    </span>
  );
};

export default TypewriterText; 