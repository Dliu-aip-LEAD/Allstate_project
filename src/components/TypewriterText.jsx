import React, { useEffect, useState } from 'react';

const TypewriterText = ({ text, speed = 30, className = '' }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && <span className="typewriter-cursor">|</span>}
    </span>
  );
};

export default TypewriterText; 