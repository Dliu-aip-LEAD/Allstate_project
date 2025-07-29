import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RoundedButton from '../components/RoundedButton';
import BackButton from '../components/BackButton';
import Header from '../components/Header';
import styles from './OnboardingQuestions.module.css';
import onboard1 from '../assets/alli_question.png';

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Try to get answers from location.state (from onboarding flow)
  const answers = location.state?.answers;

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center overflow-y-auto relative">
      {/* Header */}
      <Header variant="onboarding" />

      {/* Back Arrow */}
      <BackButton
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-10"
        ariaLabel="Back"
      />
      {/* Main Content with top padding for fixed header */}
      <div className="flex flex-col items-center w-full max-w-xl px-4 py-8 pt-32 relative">
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