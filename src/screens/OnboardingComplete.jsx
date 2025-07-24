import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import styles from './OnboardingQuestions.module.css';
import onboard1 from '../assets/alli_question.png';

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Try to get answers from location.state (from onboarding flow)
  const answers = location.state?.answers;

  return (
    <div className="fixed inset-0 w-full h-full min-h-screen bg-white flex flex-col items-center overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col items-center bg-[#0033A0] py-6 px-4 md:py-8 md:px-12 relative">
        <div className="w-full flex items-center justify-between max-w-5xl mx-auto">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold mr-2">Allstate</span>
            <span className="text-white text-xs font-whitney tracking-widest">IDENTITY PROTECTION</span>
          </div>
          <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center text-blue-900 font-bold text-lg">
            {/* Shield icon placeholder */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" fill="#fff"/><path d="M16 3L28 7V15C28 22.18 22.84 28.27 16 29C9.16 28.27 4 22.18 4 15V7L16 3Z" stroke="#0033A0" strokeWidth="2"/><circle cx="16" cy="16" r="5" fill="#0033A0"/><path d="M16 13V16L18 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
        </div>
      </div>
      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6"
        ariaLabel="Back"
      />
      {/* Main Content */}
      <div className="flex flex-col items-center w-full max-w-xl px-4 mt-8 relative">
        <div className={styles.bubbleRow}>
          <img
            src={onboard1}
            alt="Detective Alli"
            className={styles.alliImage}
          />
          <div className={styles.speechBubble}>
            <div className={styles.bubbleTail} />
            <div className={styles.speechText + ' !font-bold !text-white !text-lg'}>
              Fantastic! I've created your personalized protection plan! 🎉
            </div>
          </div>
        </div>
        <div className="w-full text-center text-[#0033A0] text-xl font-bold leading-snug mb-8 mt-2">
          "Almost there! Create your account so I can save your personalized protection plan and start keeping you safe! <span role='img' aria-label='lock'>🔒</span>"
        </div>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <RoundedButton
            className="bg-[#0662CD] text-white font-bold text-lg hover:bg-[#0033A0] w-full h-14"
            onClick={() => navigate('/signup', { state: { answers } })}
          >
            Let's create my account!
          </RoundedButton>
          <RoundedButton
            className="bg-[#E2F0FF] text-[#0662CD] font-bold text-lg hover:bg-[#d0e7ff] w-full h-14"
            onClick={() => navigate('/')}
          >
            Back to the home page
          </RoundedButton>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete; 