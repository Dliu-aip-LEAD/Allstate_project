import React from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const location = useLocation();
  const name = location.state?.name;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-3xl font-bold text-[#0033A0]">{name ? `Hi, ${name}!` : 'Hi there!'}</h1>
    </div>
  );
};

export default Home; 