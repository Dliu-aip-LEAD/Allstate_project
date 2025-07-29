import React from 'react';
import { useNavigate } from 'react-router-dom';
import onboard1 from '../assets/onboard1.png';
import RoundedButton from '../components/RoundedButton';
import alliAvatar from '../assets/onboard1.png';
import Header from '../components/Header';

const Onboarding = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center overflow-y-auto">
      {/* Header */}
      <Header variant="onboarding" />

      {/* Main Content with top padding for fixed header */}
      <div className="w-full flex flex-col items-center pt-32">
        {/* Illustration */}
        <div className="flex-1 flex items-center justify-center w-full py-8">
          <div className="w-full max-w-xl h-full flex items-center justify-center px-4">
            <div className="w-full aspect-square max-w-[413px] max-h-[413px] bg-blue-100 rounded-2xl flex items-center justify-center text-blue-900 text-2xl">
              <img src={onboard1} alt="Onboarding Illustration" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
        {/* Headline */}
        <div className="w-full flex items-center justify-center px-4 py-4">
          <div className="w-full max-w-xl text-[#0033A0] text-xl md:text-2xl font-tilt-warp text-center font-normal leading-snug mb-4">
            Your AI-powered, fun, and effective way to spot scams!
          </div>
        </div>
        {/* Buttons */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 px-4 pb-8">
          <RoundedButton
            className="md:w-1/3 max-w-xs bg-[#0662CD] text-white hover:bg-[#0033A0]"
            onClick={() => navigate('/detective-intro')}
          >
            Get Started
          </RoundedButton>
          <RoundedButton
            className="md:w-1/3 max-w-xs bg-[#E2F0FF] text-[#1F6FCB]"
            onClick={() => navigate('/login')}
          >
            I Already Have An Account
          </RoundedButton>
        </div>
      </div>
    </div>
  );
};

export default Onboarding; 