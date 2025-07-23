import React from 'react';
import { useNavigate } from 'react-router-dom';
import onboard1 from '../assets/onboard1.png';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';

const DetectiveIntro = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate('/')}
        className="absolute top-6 left-6"
        ariaLabel="Back to Onboarding"
      />
      <div className="flex flex-col items-center w-full max-w-xl px-4">
        <img src={onboard1} alt="Detective Alli" className="w-60 h-60 md:w-80 md:h-80 object-contain mb-6" />
        <h1 className="text-[#0033A0] text-2xl md:text-3xl font-whitney font-bold text-center mb-4">
          Hello there, Detective! I'm Alli, your personal scam-fighting partner! 🕵️‍♂️
        </h1>
        <p className="text-[#0033A0] text-lg md:text-xl font-whitney text-center mb-6">
          I help people like you stay safe from online scams and suspicious messages. Ready to become a scam-detection expert?
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
            <RoundedButton
              className="md:w-1/2 max-w-xs bg-[#0662CD] text-white hover:bg-[#0033A0]"
            >
              Yes, Let's Go!
            </RoundedButton>
            <RoundedButton
              className="md:w-1/2 max-w-xs bg-[#E2F0FF] text-[#1F6FCB]"
            >
              Tell Me More
            </RoundedButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectiveIntro; 